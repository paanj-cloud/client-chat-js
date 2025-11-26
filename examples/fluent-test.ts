
import { PaanjClient } from '@paanj/client';
import { ChatClient } from '../src/chat-client'; // Import from src to test local changes

async function main() {
    try {
        console.log('Initializing client...');
        const client = new PaanjClient({
            apiKey: 'your_public_api_key_here',
            apiUrl: 'https://api.yourapp.com',
            wsUrl: 'wss://ws.yourapp.com'
        });

        console.log('Authenticating...');
        await client.authenticateAnonymous({ name: 'Test User' });
        await client.connect();
        console.log('Connected!');

        const chat = new ChatClient(client);

        // Test Global Listener
        chat.onMessage((msg) => {
            console.log('Global listener received:', msg);
        });

        // Test Create Conversation
        console.log('Creating conversation...');
        const conv = await chat.conversations.create({
            name: 'Fluent API Test',
            participantIds: [client.getUserId()!]
        });
        console.log('Conversation created:', conv.id);

        // Test Fluent API: Send
        console.log('Sending message...');
        await chat.conversations(conv.id).send('Hello Fluent World!');

        // Test Fluent API: List Messages with chaining
        console.log('Listing messages...');
        // Wait a bit for message to be processed
        await new Promise(r => setTimeout(r, 1000));

        const messages = await chat.conversations(conv.id)
            .messages()
            .list()
            .limit(5)
            .page(1);

        console.log(`Retrieved ${messages.length} messages`);

        // Test Admin: List Participants
        console.log('Listing participants...');
        const participants = await chat.conversations(conv.id).participants().list();
        console.log(`Participants: ${participants.length}`);

        console.log('Test Complete!');
        process.exit(0);
    } catch (err) {
        console.error('Test Failed:', err);
        process.exit(1);
    }
}

main();
