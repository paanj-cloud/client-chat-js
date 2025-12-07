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
    /**
     * List messages in a conversation
     */
    list(conversationId: string, filters?: MessageFilters) {
        const execute = async (finalFilters: MessageFilters) => {
            const httpClient = this.client.getHttpClient();
            const params = new URLSearchParams();
            if (finalFilters?.limit) params.append('limit', finalFilters.limit.toString());
            if (finalFilters?.offset) params.append('offset', finalFilters.offset.toString());
            if (finalFilters?.before) params.append('before', finalFilters.before);
            if (finalFilters?.after) params.append('after', finalFilters.after);

            const query = params.toString();
            const response = await httpClient.request<{ messages: Message[] }>('GET', `/api/v1/conversations/${conversationId}/messages${query ? `?${query}` : ''}`);
            return response.messages;
        };

        const currentFilters = { ...filters };

        const chain = {
            then: (resolve: (value: Message[]) => void, reject?: (reason: any) => void) => {
                return execute(currentFilters).then(resolve, reject);
            },
            catch: (reject: (reason: any) => void) => {
                return execute(currentFilters).catch(reject);
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
     * Listen to new messages in a conversation
     */
    onMessage(conversationId: string, callback: (message: Message) => void): Unsubscribe {
        // Client is implicitly subscribed to conversations it is a member of
        return this.client.on(`conversation:${conversationId}:message.create`, callback);
    }
}
