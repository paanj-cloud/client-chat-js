import { PaanjClient } from '@paanj/client';
import { MessagesResource } from './resources/messages.js';
import { ConversationsResource } from './resources/conversations.js';
import { UsersResource } from './resources/users.js';
import { UserContext } from './resources/user-context.js';
import { ConversationContext } from './resources/conversation-context.js';

/**
 * ChatClient - Chat features for Paanj platform
 * 
 * Provides real-time messaging, conversation management, and user presence.
 */
export class ChatClient {
    private messagesResource: MessagesResource;
    private conversationsResource: ConversationsResource;
    private usersResource: UsersResource;

    private client: PaanjClient;

    /**
     * Create a new ChatClient instance
     * 
     * @param client - PaanjClient instance
     */
    constructor(client: PaanjClient) {
        this.client = client;

        // Initialize resources
        this.messagesResource = new MessagesResource(client);
        this.conversationsResource = new ConversationsResource(client);
        this.usersResource = new UsersResource(client);
    }

    /**
     * Access conversation features
     * 
     * @param conversationId - Optional ID to target a specific conversation
     */
    public conversations = Object.assign(
        (conversationId: string) => {
            return new ConversationContext(this.client, conversationId, this.messagesResource, this.conversationsResource);
        },
        {
            create: (data: any) => this.conversationsResource.create(data),
            list: (filters?: any) => this.conversationsResource.list(filters),
            get: (id: string) => this.conversationsResource.get(id),
            onMessage: (callback: (message: any) => void) => this.client.on('message.create', callback),
        }
    );

    /**
     * Access user features
     * 
     * @param userId - Optional ID to target a specific user
     */
    public users = Object.assign(
        (userId: string) => {
            return new UserContext(this.client, userId, this.usersResource);
        },
        {
            getBlocked: () => this.usersResource.getBlocked(),
            onTokenRefresh: (callback: (data: any) => void) => this.usersResource.onTokenRefresh(callback),
        }
    );
}
