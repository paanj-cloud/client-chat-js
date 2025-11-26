# @paanj/chat-client

> Build powerful real-time chat applications with ease.

[![npm version](https://img.shields.io/npm/v/@paanj/chat-client.svg)](https://www.npmjs.com/package/@paanj/chat-client)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-Custom-blue.svg)](./LICENSE)

## Overview

The `@paanj/chat-client` SDK empowers developers to integrate robust, real-time messaging capabilities into their applications. Whether you're building a social platform, a customer support tool, or an internal collaboration app, our SDK handles the heavy lifting of real-time communication.

### Key Features

- 💬 **Real-time Messaging**: Instant message delivery with low latency.
- 👥 **Group Conversations**: Create and manage dynamic group chats and direct messages.
- 🔔 **Live Events**: Subscribe to real-time updates for new messages and conversation changes.
- 🌐 **Cross-Platform**: Fully isomorphic design working seamlessly in Node.js and modern browsers.
- 🔒 **Secure**: Built with security in mind, integrating with `@paanj/client` for robust authentication.

## Installation

```bash
npm install @paanj/client @paanj/chat-client
```

## Quick Start

Get up and running in minutes.

```typescript
import { PaanjClient } from '@paanj/client';
import { ChatClient } from '@paanj/chat-client';

// 1. Initialize the core client
const client = new PaanjClient({ apiKey: 'YOUR_API_KEY' });

// 2. Authenticate your user
// Option A: Anonymous / New Session
await client.authenticateAnonymous({ name: 'Alice' });

// Option B: Existing Session (with Access Token and Refresh Token)
// await client.authenticateWithToken('ACCESS_TOKEN', 'USER_ID', 'REFRESH_TOKEN');

await client.connect();

// 3. Initialize the Chat SDK
const chat = new ChatClient(client);

// 4. Create a conversation
const conversation = await chat.conversations.create({
  name: 'Team Project',
  participantIds: [client.getUserId()!]
});

// 5. Listen for incoming messages globally
chat.onMessage((message) => {
  console.log(`[${message.senderId}]: ${message.content}`);
});

// 6. Send a message
await chat.conversations(conversation.id).send('Hello, team! 👋');
```

## API Reference

### Initialization

#### `new ChatClient(client)`
Creates a new instance of the Chat SDK.
- `client`: An authenticated `PaanjClient` instance.

### Conversations

Manage chat rooms and direct messages.

#### `chat.conversations.create(data)`
Creates a new conversation.
- `data`: Object containing `name` (optional) and `participantIds`.
- Returns: `Promise<Conversation>`

#### `chat.conversations.list(filters?)`
Retrieves a list of conversations the current user is part of.
- Returns: `Promise<Conversation[]>`

#### `chat.conversations.get(conversationId)`
Retrieves details for a specific conversation.
- Returns: `Promise<Conversation>`

### Conversation Context

Interact with a specific conversation using the fluent API: `chat.conversations(conversationId)`

#### `.send(content, metadata?)`
Sends a message to the conversation.
- `content`: The text content of the message.
- `metadata`: Optional JSON object for custom data.
- Returns: `Promise<void>`

#### `.messages().list(filters?)`
Retrieves message history. Supports chaining for pagination.
- `.limit(n)`: Limit number of messages.
- `.page(n)`: specific page number.
- `.offset(n)`: specific offset.
- Returns: `Promise<Message[]>`

Example:
```typescript
const history = await chat.conversations(id)
  .messages()
  .list()
  .limit(20)
  .page(2);
```

#### `.participants().list()`
List all participants in the conversation.
- Returns: `Promise<Participant[]>`

#### `.participants().add(userId, role?)`
Add a user to the conversation (Admin only).
- `userId`: ID of the user to add.
- `role`: 'admin' or 'member' (default: 'member').
- Returns: `Promise<void>`

#### `.leave()`
Removes the current user from the conversation.
- Returns: `Promise<void>`

### Global Events

#### `chat.onMessage(callback)`
Subscribes to real-time messages across all joined conversations.
- `callback`: Function called when a new message is received.
- Returns: `Unsubscribe` function.

## Support

- 📖 **Documentation**: [docs.paanj.com](https://docs.paanj.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/paanj/chat-baas/issues)
- 📧 **Contact**: support@paanj.com

---

Made with ❤️ by the Paanj team
