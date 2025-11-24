/**
 * Basic Usage Example (JavaScript)
 * 
 * Demonstrates the new modular Client SDK architecture with:
 * - PaanjClient (core package)
 * - ChatClient (chat features)
 */

const { PaanjClient } = require('@paanj/client');
const { ChatClient } = require('@paanj/chat-client');
const { loadConfig } = require('./config');

async function main() {
    // Load configuration
    const config = loadConfig();

    if (!config.publicKey) {
        console.error('❌ No public key found!');
        console.error('Run: node examples/setup.js');
        process.exit(1);
    }

    console.log(`🔧 Environment: ${config.isDev ? 'Development' : 'Production'}`);
    console.log(`🔗 API URL: ${config.apiUrl}\n`);

    // Initialize core client
    const client = new PaanjClient({
        apiKey: config.publicKey,
        apiUrl: config.apiUrl,
        wsUrl: config.wsUrl,
    });

    try {
        // Authenticate as anonymous user
        console.log('🔑 Authenticating...');
        const auth = await client.authenticateAnonymous({
            name: 'Jane Doe',
            metadata: { role: 'guest' }
        });
        console.log('✅ Authenticated as:', auth.userId);

        // Connect to WebSocket
        await client.connect();
        console.log('✅ Connected to Paanj Client');

        // Initialize chat features
        const chat = new ChatClient(client);
        console.log('✅ Chat features initialized');

        // Create a conversation
        console.log('\n💬 Creating conversation...');
        const conversation = await chat.conversations.create({
            name: 'JS Demo Chat',
            participantIds: [auth.userId],
            metadata: { type: 'demo' }
        });
        console.log('✅ Created conversation:', conversation.id);

        // Listen to messages
        chat.messages.onMessage(conversation.id, (msg) => {
            console.log(`\n📨 New message in ${conversation.id}:`);
            console.log(`   From: ${msg.senderId}`);
            console.log(`   Content: ${msg.content}`);
        });
        console.log('👂 Listening for messages...');

        // Send a message
        console.log('\n📤 Sending message...');
        await chat.messages.send(conversation.id, 'Hello from JavaScript!');
        console.log('✅ Message sent');

        // Keep connection alive
        console.log('\n👀 Monitoring events... (Press Ctrl+C to exit)');

        // Handle graceful shutdown
        process.on('SIGINT', () => {
            console.log('\n\n🛑 Shutting down...');
            client.disconnect();
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        client.disconnect();
        process.exit(1);
    }
}

main();
