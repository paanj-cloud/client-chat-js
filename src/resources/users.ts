import { PaanjClient, Unsubscribe } from '@paanj/client';

/**
 * Users resource - manage user interactions
 */
export class UsersResource {
    private client: PaanjClient;

    constructor(client: PaanjClient) {
        this.client = client;
    }

    /**
     * Listen to token refresh events
     * @param callback - Function to call when token is refreshed
     */
    onTokenRefresh(callback: (data: { userId: string | null; accessToken: string; refreshToken: string }) => void): Unsubscribe {
        return this.client.on('token.updated', callback);
    }

    /**
     * Block a user
     * @param userId ID of the user to block
     */
    async block(userId: string): Promise<void> {
        const httpClient = this.client.getHttpClient();
        await httpClient.request<void>('POST', `/api/v1/users/${userId}/block`);
    }

    /**
     * Unblock a user
     * @param userId ID of the user to unblock
     */
    async unblock(userId: string): Promise<void> {
        const httpClient = this.client.getHttpClient();
        await httpClient.request<void>('POST', `/api/v1/users/${userId}/unblock`);
    }

    /**
     * Get list of blocked user IDs
     */
    async getBlocked(): Promise<string[]> {
        const httpClient = this.client.getHttpClient();
        const response = await httpClient.request<{ blockedUserIds: string[] }>('GET', '/api/v1/users/me/blocked');
        return response.blockedUserIds;
    }
}
