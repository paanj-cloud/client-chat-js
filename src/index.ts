// Main exports for @paanj/chat-client

// Runtime check for Node.js version
if (typeof process !== 'undefined' && process.release?.name === 'node') {
    const version = process.version.substring(1).split('.')[0];
    if (parseInt(version) < 18) {
        console.error(`\x1b[31mError: @paanj/chat-client requires Node.js 18.0.0 or higher. Current version: ${process.version}\x1b[0m`);
        process.exit(1);
    }
}

export { ChatClient } from './chat-client';

// Export types
export type {
    User,
    Message,
    Conversation,
    ConversationMember,
    CreateConversationData,
    ConversationFilters,
    MessageFilters,
} from './types/chat-types';
