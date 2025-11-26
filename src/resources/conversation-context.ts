import { PaanjClient } from '@paanj/client';
import { MessagesResource } from './messages';
import { ConversationsResource } from './conversations';
import { Message, MessageFilters } from '../types/chat-types';

export class ConversationContext {
    private client: PaanjClient;
    private conversationId: string;
    private messagesResource: MessagesResource;
    private conversationsResource: ConversationsResource;

    constructor(client: PaanjClient, conversationId: string, messagesResource: MessagesResource, conversationsResource: ConversationsResource) {
        this.client = client;
        this.conversationId = conversationId;
        this.messagesResource = messagesResource;
        this.conversationsResource = conversationsResource;
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
        await httpClient.request<void>('DELETE', `/api/v1/conversations/${this.conversationId}/participants/me`);
    }
}
