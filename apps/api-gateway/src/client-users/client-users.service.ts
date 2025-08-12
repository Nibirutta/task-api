import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { USERS_CLIENT } from '@app/common';

@Injectable()
export class ClientUsersService implements OnApplicationBootstrap {
    constructor(
        @Inject(USERS_CLIENT) private readonly usersClient: ClientProxy,
    ) {}

    async onApplicationBootstrap() {
        await this.usersClient.connect();
        console.log('Users microservice connected');
    }
}
