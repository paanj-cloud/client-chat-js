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
const client = new PaanjClient({ apiKey: 'YOUR_PUBLIC_API_KEY' });

// 2. Authenticate your user (required before using chat)
const session = await client.authenticateAnonymous({ 
  name: 'Alice',
  metadata: { email: 'alice@example.com' }
});

console.log('User ID:', session.userId);

// 3. Connect to real-time server
await client.connect();

// 4. Initialize the Chat SDK
const chat = new ChatClient(client);

// 5. Create a conversation
const conversation = await chat.conversations.create({
  name: 'Team Project',
  participantIds: [session.userId, 'user_456']
});

// 6. Listen for incoming messages globally
chat.onMessage((message) => {
  console.log(`[${message.senderId}]: ${message.content}`);
});

// 7. Send a message
await chat.conversations(conversation.id).send('Hello, team! 👋');
```

## API Reference

### Initialization

#### `new ChatClient(client)`
Creates a new instance of the Chat SDK.
- `client`: An authenticated `PaanjClient` instance (you must call `authenticateAnonymous()` or `authenticateWithToken()` first).

### Authentication

Before using chat features, you must authenticate:

```typescript
// Option A: Anonymous authentication (creates a new user)
const session = await client.authenticateAnonymous({ 
  name: 'John Doe',
  metadata: { email: 'john@example.com' }
});

// Option B: Existing session (reuse previous access token)
await client.authenticateWithToken(
  'ACCESS_TOKEN',
  'USER_ID',  // Optional
  'REFRESH_TOKEN'  // Optional
);

// Get user ID after authentication
const userId = client.getUserId();
console.log('Session User ID:', userId);
```

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
- `metadata`: Optional JSON object for custom data (currently not processed by the server).
- Returns: `Promise<void>`

```typescript
const ctx = chat.conversations(conversation.id);
await ctx.send('Hello!');
```

#### `.messages().list(filters?)`
Retrieves message history with fluent API chaining.
- `.limit(n)`: Limit number of messages.
- `.page(n)`: Specific page number.
- `.offset(n)`: Specific offset.
- Returns: `Promise<Message[]>`

```typescript
const history = await chat.conversations(id)
  .messages()
  .list()
  .limit(20)
  .page(1);
```

#### `.participants().list()`
List all participants in the conversation.
- Returns: `Promise<Participant[]>`

```typescript
const participants = await chat.conversations(id)
  .participants()
  .list();
```

#### `.participants().add(userId, role?)`
Add a user to the conversation (Admin only).
- `userId`: ID of the user to add.
- `role`: 'admin' or 'member' (default: 'member').
- Returns: `Promise<void>`

```typescript
await chat.conversations(id)
  .participants()
  .add('user_789', 'member');
```

#### `.leave()`
Removes the current user from the conversation.
- Returns: `Promise<void>`

```typescript
await chat.conversations(conversation.id).leave();
```

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
