import { PaanjClient, Unsubscribe } from '@paanj/client';
import { Conversation, CreateConversationData, ConversationFilters } from '../types/chat-types';

/**
 * Conversations resource - manage and monitor conversations
 */
export class ConversationsResource {
    private client: PaanjClient;

    constructor(client: PaanjClient) {
        this.client = client;
    }

    /**
     * Create a new conversation
     */
    async create(data: CreateConversationData): Promise<Conversation> {
        const httpClient = this.client.getHttpClient();
        const conversation = await httpClient.request<Conversation>('POST', '/api/v1/conversations', data);

        // Wait briefly for the server's conversation.created event to propagate
        // This ensures all participants (including creator) are subscribed via server-side event handling
        await new Promise(resolve => setTimeout(resolve, 150));

        return conversation;
    }

    /**
     * Get conversation by ID
     */
    async get(conversationId: string): Promise<Conversation> {
        const httpClient = this.client.getHttpClient();
        return httpClient.request<Conversation>('GET', `/api/v1/conversations/${conversationId}`);
    }

    /**
     * List my conversations
     */
    list(filters?: ConversationFilters) {
        const execute = async (finalFilters: ConversationFilters) => {
            const httpClient = this.client.getHttpClient();
            const params = new URLSearchParams();
            if (finalFilters?.limit) params.append('limit', finalFilters.limit.toString());
            if (finalFilters?.offset) params.append('offset', finalFilters.offset.toString());

            const query = params.toString();
            return httpClient.request<Conversation[]>('GET', `/api/v1/conversations${query ? `?${query}` : ''}`);
        };

        const currentFilters = { ...filters };

        const chain = {
            then: (resolve: (value: Conversation[]) => void, reject: (reason: any) => void) => {
                return execute(currentFilters).then(resolve, reject);
            },
            limit: (limit: number) => {
                currentFilters.limit = limit;
                return chain;
            },
            page: (page: number) => {
                // Assuming page size is limit or default 20
                const limit = currentFilters.limit || 20;
                currentFilters.offset = (page - 1) * limit;
                return chain;
            },
            offset: (offset: number) => {
                currentFilters.offset = offset;
                return chain;
            }
        };

        return chain;
    }



    /**
     * Add a participant to a conversation
     */
    async addParticipant(conversationId: string, userId: string, role: 'admin' | 'member' = 'member'): Promise<void> {
        const httpClient = this.client.getHttpClient();
        await httpClient.request<void>('POST', `/api/v1/conversations/${conversationId}/members`, {
            members: [{ userId: parseInt(userId), role }]
        });
    }

    /**
     * List participants in a conversation
     */
    async listParticipants(conversationId: string): Promise<any[]> {
        const conversation = await this.get(conversationId);
        return (conversation as any).members || [];
    }

    /**
     * Listen to new messages in a conversation
     * @param conversationId - ID of the conversation to listen to
     * @param callback - Function to call when a new message is created
     */
    onMessage(conversationId: string, callback: (message: any) => void) {
        return this.client.on(`conversation:${conversationId}:message.create`, callback);
    }

    /**
     * Leave a conversation
     */
    async leave(conversationId: string): Promise<void> {
        const httpClient = this.client.getHttpClient();
        const userId = this.client.getUserId();
        if (!userId) throw new Error('User not authenticated');

        await httpClient.request<void>('DELETE', `/api/v1/conversations/${conversationId}/members`, {
            userIds: [parseInt(userId)]
        });
    }

    /**
     * Listen to conversation updates
     */
    onUpdate(conversationId: string, callback: (data: any) => void): Unsubscribe {
        this.client.subscribe({
            type: 'subscribe',
            resource: 'conversation',
            id: conversationId,
            events: ['conversation.update'],
        });
        return this.client.on(`conversation:${conversationId}:conversation.update`, callback);
    }
}
