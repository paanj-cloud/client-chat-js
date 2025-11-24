# Chat Client Examples

Examples demonstrating the `@paanj/chat-client` package with the new modular SDK architecture.

## Setup

### 1. Install Dependencies

```bash
# Install required packages
npm install axios

# Or if running from monorepo root
cd sdks/javascript/chat-client/examples
npm install
```

### 2. Create Test Credentials

Run the setup script to create test credentials:

```bash
node setup.js
```

This will:
- Create a test account and project
- Generate a public API key
- Save credentials to `.env.local` (gitignored)

### 3. Run Examples

```bash
# TypeScript
npx ts-node basic-usage.ts

# JavaScript
node basic-usage.js
```

## Configuration

The examples use environment-based configuration:

**Development** (automatic):
- Reads from `.env.local` (created by `setup.js`)
- Uses `localhost` URLs

**Production**:
- Reads from environment variables:
  - `PAANJ_PUBLIC_KEY`
  - `API_URL` (defaults to `https://api.paanj.com`)
  - `WS_URL` (defaults to `wss://ws.paanj.com`)

## New API Pattern

The modular architecture uses a composition pattern:

```typescript
import { PaanjClient } from '@paanj/client';
import { ChatClient } from '@paanj/chat-client';

// Initialize core
const client = new PaanjClient({ apiKey: 'pk_live_...' });
await client.authenticateAnonymous({ name: 'User' });
await client.connect();

// Initialize chat
const chat = new ChatClient(client);

// Use chat features
await chat.messages.send(conversationId, 'Hello!');
```
