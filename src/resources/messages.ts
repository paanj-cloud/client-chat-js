import { PaanjClient, Unsubscribe } from '@paanj/client';
import { Message, MessageFilters } from '../types/chat-types';

/**
 * Messages resource - manage and monitor messages
 */
export class MessagesResource {
    private client: PaanjClient;

    constructor(client: PaanjClient) {
        this.client = client;
    }

    /**
     * Send a message to a conversation
     */
    async send(conversationId: string, content: string, metadata?: Record<string, any>): Promise<void> {
        // Generate simple hash for deduplication
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const hash = `${random}+${timestamp}`;

        const payload = {
            type: 'new',
            receiver: conversationId,
            message: content,
            hash,
        };

        this.client.sendWebSocketMessage(payload);
    }

    /**
     * List messages in a conversation
     */
    async list(conversationId: string, filters?: MessageFilters): Promise<Message[]> {
        const httpClient = this.client.getHttpClient();
        const params = new URLSearchParams();
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.offset) params.append('offset', filters.offset.toString());
        if (filters?.before) params.append('before', filters.before);
        if (filters?.after) params.append('after', filters.after);

        const query = params.toString();
        return httpClient.request<Message[]>('GET', `/api/v1/conversations/${conversationId}/messages${query ? `?${query}` : ''}`);
    }

    /**
     * Listen to new messages in a conversation
     */
    onMessage(conversationId: string, callback: (message: Message) => void): Unsubscribe {
        // Client is implicitly subscribed to conversations it is a member of
        return this.client.on(`conversation:${conversationId}:message.create`, callback);
    }
}
