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
        return httpClient.request<Conversation>('POST', '/api/v1/conversations', data);
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
    async list(filters?: ConversationFilters): Promise<Conversation[]> {
        const httpClient = this.client.getHttpClient();
        const params = new URLSearchParams();
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.offset) params.append('offset', filters.offset.toString());

        const query = params.toString();
        return httpClient.request<Conversation[]>('GET', `/api/v1/conversations${query ? `?${query}` : ''}`);
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
