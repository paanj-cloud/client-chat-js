/**
 * Configuration loader for examples
 * 
 * Loads configuration from .env.local (development) or environment variables (production)
 */

const fs = require('fs');
const path = require('path');

/**
 * Load environment configuration
 * Priority: .env.local (dev) > environment variables (prod)
 */
function loadConfig() {
    const envPath = path.join(__dirname, '.env.local');

    // Try to load .env.local for development
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const lines = envContent.split('\n');

        lines.forEach(line => {
            // Skip comments and empty lines
            if (line.trim().startsWith('#') || !line.trim()) return;

            const [key, ...valueParts] = line.split('=');
            const value = valueParts.join('=').trim();

            if (key && value && !process.env[key]) {
                process.env[key] = value;
            }
        });
    }

    // Return configuration object
    return {
        secretKey: process.env.PAANJ_SECRET_KEY || '',
        publicKey: process.env.PAANJ_PUBLIC_KEY || '',
        apiUrl: process.env.API_URL || 'https://api.paanj.com',
        wsUrl: process.env.WS_URL || 'wss://ws.paanj.com',
        isDev: !!process.env.PAANJ_SECRET_KEY && process.env.API_URL?.includes('localhost'),
    };
}

module.exports = { loadConfig };
