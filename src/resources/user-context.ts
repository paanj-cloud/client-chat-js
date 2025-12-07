import { PaanjClient, Unsubscribe } from '@paanj/client';
import { UsersResource } from './users.js';

export class UserContext {
    private client: PaanjClient;
    private userId: string;
    private usersResource: UsersResource;

    constructor(client: PaanjClient, userId: string, usersResource: UsersResource) {
        this.client = client;
        this.userId = userId;
        this.usersResource = usersResource;
    }

    /**
     * Listen to token refresh events for this user
     * @param callback - Function to call when token is refreshed
     */
    onTokenRefresh(callback: (data: { userId: string | null; accessToken: string; refreshToken: string }) => void): Unsubscribe {
        return this.usersResource.onTokenRefresh(callback);
    }

    /**
     * Block this user
     */
    async block(): Promise<void> {
        return this.usersResource.block(this.userId);
    }

    /**
     * Unblock this user
     */
    async unblock(): Promise<void> {
        return this.usersResource.unblock(this.userId);
    }
}
