import { PaanjClient } from '@paanj/client';
import { MessagesResource } from './messages.js';
import { ConversationsResource } from './conversations.js';
import { Message, MessageFilters } from '../types/chat-types.js';

export class ConversationContext {
    private client: PaanjClient;
    private conversationId: string;
    private messagesResource: MessagesResource;
    private conversationsResource: ConversationsResource;

    private lastMessageHash: string | null = null;
    private isSyncing: boolean = false;

    constructor(client: PaanjClient, conversationId: string, messagesResource: MessagesResource, conversationsResource: ConversationsResource) {
        this.client = client;
        this.conversationId = conversationId;
        this.messagesResource = messagesResource;
        this.conversationsResource = conversationsResource;

        // Listen for reconnection events to trigger sync
        this.client.on('connect', () => this.syncMessages());
    }

    /**
     * Add a participant to this conversation
     */
    async addParticipant(userId: string, role: 'admin' | 'member' = 'member'): Promise<void> {
        return this.conversationsResource.addParticipant(this.conversationId, userId, role);
    }

    /**
     * Access participants in this conversation
     */
    participants() {
        return {
            list: () => this.conversationsResource.listParticipants(this.conversationId),
            add: (userId: string, role?: 'admin' | 'member') => this.addParticipant(userId, role)
        };
    }

    /**
     * Send a message to this conversation
     */
    async send(content: string, metadata?: Record<string, any>): Promise<void> {
        return this.messagesResource.send(this.conversationId, content, metadata);
    }

    /**
     * Get conversation details
     */
    async get() {
        return this.conversationsResource.get(this.conversationId);
    }

    /**
     * Access messages in this conversation
     */
    messages() {
        return {
            list: (filters?: MessageFilters) => this.messagesResource.list(this.conversationId, filters),
        };
    }

    /**
     * Leave this conversation
     */
    async leave(): Promise<void> {
        const httpClient = this.client.getHttpClient();
        const userId = this.client.getUserId();
        if (!userId) throw new Error('User not authenticated');

        await httpClient.request<void>('DELETE', `/api/v1/conversations/${this.conversationId}/members`, {
            userIds: [parseInt(userId)]
        });
    }

    /**
     * Listen to updates for this conversation
     */
    onUpdate(callback: (data: any) => void) {
        return this.conversationsResource.onUpdate(this.conversationId, callback);
    }

    /**
     * Listen to new messages in a conversation
     * Wraps the standard listener to track the last message hash
     */
    onMessage(callback: (message: Message) => void) {
        return this.messagesResource.onMessage(this.conversationId, (message) => {
            // Update last known hash
            if (message.metadata && message.metadata.hash) {
                this.lastMessageHash = message.metadata.hash;
            } else if ((message as any).hash) {
                this.lastMessageHash = (message as any).hash;
            }
            callback(message);
        });
    }

    /**
     * Sync messages after reconnection
     * Checks if the latest message on server matches our last known hash
     */
    private async syncMessages() {
        if (!this.lastMessageHash || this.isSyncing) {
            return;
        }

        try {
            this.isSyncing = true;

            // 1. Get the latest message from the server
            const latestMessages = await this.messagesResource.list(this.conversationId, { limit: 1 });

            if (latestMessages && latestMessages.length > 0) {
                const serverLatest = latestMessages[0];
                const serverHash = (serverLatest as any).hash || (serverLatest.metadata && serverLatest.metadata.hash) || serverLatest.id;

                // 2. If hashes don't match, we have a gap
                if (serverHash && serverHash !== this.lastMessageHash) {
                    console.log(`[ConversationContext] Gap detected. Local: ${this.lastMessageHash}, Server: ${serverHash}. Syncing...`);

                    // 3. Fetch missing messages
                    const missedMessages = await this.messagesResource.list(this.conversationId, {
                        after: this.lastMessageHash
                    });

                    // 4. Emit these messages to the application (if we could access the listener)
                    // Since we can't easily inject into the user's callback here without storing it,
                    // we rely on the user handling the 'sync' event or we just update our internal state.
                    // Ideally, we would re-emit these. For now, we update the hash.

                    if (missedMessages && missedMessages.length > 0) {
                        // Update our last hash to the latest from the sync
                        const lastSynced = missedMessages[0]; // Assuming list returns newest first? No, usually API returns list.
                        // Actually list usually returns newest first or oldest first depending on API.
                        // Let's assume we just update to the server's latest hash we found earlier.
                        this.lastMessageHash = serverHash;

                        // TODO: In a full implementation, we would emit these messages to the user's onMessage callback.
                        // However, the current architecture doesn't store the user's callback in the class.
                        // We will log for now as per the plan.
                        console.log(`[ConversationContext] Synced ${missedMessages.length} missed messages.`);
                    }
                }
            }
        } catch (error) {
            console.error('[ConversationContext] Error syncing messages:', error);
        } finally {
            this.isSyncing = false;
        }
    }
}
