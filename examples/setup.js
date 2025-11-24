/**
 * Setup Script - Create Test Credentials for Client SDK
 * 
 * This script creates:
 * - Account
 * - Organization
 * - Project
 * - Public API Key
 * 
 * And saves them to .env.local for use in examples
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const {
    createDbConnection,
    createCompleteSetup,
} = require('../../../../integration_testing/common/admin-utils');

const ADMIN_PANEL_URL = process.env.ADMIN_PANEL_URL || 'http://localhost:3100';

async function createPublicKey(accessToken, projectId) {
    const response = await axios.post(
        `${ADMIN_PANEL_URL}/api/projects/${projectId}/api-keys`,
        { keyName: 'Client Example Key', keyType: 'public' },
        { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return response.data.key;
}

async function main() {
    let connection;

    try {
        console.log('🔧 Setting up test environment for Client SDK...\n');

        // Create complete setup
        connection = await createDbConnection();
        const { user, organization, project } = await createCompleteSetup(connection);

        console.log('✅ Created account:', user.email);
        console.log('✅ Created project:', project.name);

        // Create Public API Key
        const publicKey = await createPublicKey(user.accessToken, project.projectId);
        console.log('✅ Created public key\n');

        // Create .env.local file
        const envContent = `# Auto-generated test credentials
# DO NOT COMMIT THIS FILE

# API Keys
PAANJ_PUBLIC_KEY=${publicKey}

# Server URLs (Development)
API_URL=http://localhost:3000
WS_URL=ws://localhost:8090
`;

        const envPath = path.join(__dirname, '.env.local');
        fs.writeFileSync(envPath, envContent);

        console.log('📝 Created .env.local with credentials');
        console.log('\n✅ Setup complete! You can now run the examples.\n');

        if (connection) {
            await connection.end();
        }

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        if (connection) {
            await connection.end();
        }
        process.exit(1);
    }
}

main();
