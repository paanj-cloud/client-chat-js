import { PaanjClient } from '@paanj/client';
import { MessagesResource } from './resources/messages';
import { ConversationsResource } from './resources/conversations';

/**
 * ChatClient - Chat features for Paanj platform
 * 
 * Provides real-time messaging, conversation management, and user presence.
 */
export class ChatClient {
    /**
     * Messages resource - manage and monitor messages
     */
    public readonly messages: MessagesResource;

    /**
     * Conversations resource - manage and monitor conversations
     */
    public readonly conversations: ConversationsResource;

    private client: PaanjClient;

    /**
     * Create a new ChatClient instance
     * 
     * @param client - PaanjClient instance
     */
    constructor(client: PaanjClient) {
        this.client = client;

        // Initialize resources
        this.messages = new MessagesResource(client);
        this.conversations = new ConversationsResource(client);
    }
}
