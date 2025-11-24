# @paanj/chat-client

> Chat client features for Paanj platform - real-time messaging and conversations

[![npm version](https://img.shields.io/npm/v/@paanj/chat-client.svg)](https://www.npmjs.com/package/@paanj/chat-client)
[![License](https://img.shields.io/badge/license-Custom-blue.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)

## Overview

`@paanj/chat-client` provides comprehensive chat features for end-users:
- 💬 **Real-time Messaging** - Send and receive messages instantly
- 👥 **Conversations** - Create and manage group chats and DMs
- 🔔 **Live Updates** - Real-time events for messages and conversations
- 🌐 **Isomorphic** - Works in Node.js and Browser environments
- 🔌 **Modular** - Works with `@paanj/client` core package

## Installation

```bash
npm install @paanj/client @paanj/chat-client
```

## Quick Start

```typescript
import { PaanjClient } from '@paanj/client';
import { ChatClient } from '@paanj/chat-client';

// Initialize core client
const client = new PaanjClient({ apiKey: 'pk_live_key' });

// Authenticate
await client.authenticateAnonymous({ name: 'John Doe' });
await client.connect();

// Initialize chat features
const chat = new ChatClient(client);

// Create conversation
const conversation = await chat.conversations.create({
  name: 'My Chat',
  participantIds: [client.getUserId()!]
});

// Send message
await chat.messages.send(conversation.id, 'Hello world!');

// Listen for messages
chat.messages.onMessage(conversation.id, (msg) => {
  console.log('New message:', msg.content);
});
```

## API Reference

### ChatClient

#### Constructor

```typescript
new ChatClient(client: PaanjClient)
```

Creates a new ChatClient instance using an existing PaanjClient instance.

### Messages Resource

#### Methods

**`send(conversationId, content, metadata?): Promise<void>`**  
Send a message to a conversation via WebSocket.

**`list(conversationId, filters?): Promise<Message[]>`**  
List messages in a conversation with pagination.

**`onMessage(conversationId, callback): Unsubscribe`**  
Listen to new messages in a specific conversation.

### Conversations Resource

#### Methods

**`create(data): Promise<Conversation>`**  
Create a new conversation.

**`get(conversationId): Promise<Conversation>`**  
Get conversation details.

**`list(filters?): Promise<Conversation[]>`**  
List conversations the user is a participant of.

**`join(conversationId): Promise<void>`**  
Join a conversation.

**`leave(conversationId): Promise<void>`**  
Leave a conversation.

**`onUpdate(conversationId, callback): Unsubscribe`**  
Listen to conversation updates.

## Examples

Check the [`examples/`](./examples) directory for complete working examples:

- `basic-usage.ts` - Basic initialization and messaging
- `basic-usage.js` - JavaScript version

### Running Examples

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run examples
npx ts-node examples/basic-usage.ts
```

## License

This project is licensed under a custom license. See the [LICENSE](./LICENSE) file for details.

## Support

- 📧 Email: support@paanj.com
- 📖 Documentation: https://docs.paanj.com
- 🐛 Issues: https://github.com/paanj/chat-baas/issues

---

Made with ❤️ by the Paanj team
