import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { AUTH_CLIENT } from 'libs/common/src/constants/MS_PROVIDES.constants';

@Injectable()
export class ClientAuthService implements OnApplicationBootstrap {
  constructor(@Inject(AUTH_CLIENT) private readonly authClient: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.authClient.connect();
    console.log('Auth microservice connected');
  }
}
