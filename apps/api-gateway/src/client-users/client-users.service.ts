import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { USERS_CLIENT } from 'libs/common/src/constants/MS_PROVIDES.constants';

@Injectable()
export class ClientUsersService implements OnApplicationBootstrap {
  constructor(
    @Inject(USERS_CLIENT) private readonly usersClient: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    await this.usersClient.connect();
    console.log('Connected successfully!');
  }
}
