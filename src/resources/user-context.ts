import { PaanjClient } from '@paanj/client';
import { UsersResource } from './users';

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
