// Chat types for Paanj Chat Client SDK

export interface User {
    userId: string;
    email?: string;
    username?: string;
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
    lastActiveAt?: string;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export interface Conversation {
    id: string;
    name?: string;
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
    lastMessageAt?: string;
    participants?: string[]; // User IDs
}

export interface ConversationMember {
    userId: string;
    role?: 'admin' | 'member';
}

export interface CreateConversationData {
    name?: string;
    participants?: ConversationMember[]; // Participants with roles (defaults to 'member')
    metadata?: Record<string, any>;
}

export interface ConversationFilters {
    limit?: number;
    offset?: number;
}

export interface MessageFilters {
    limit?: number;
    offset?: number;
    before?: string;
    after?: string;
}
