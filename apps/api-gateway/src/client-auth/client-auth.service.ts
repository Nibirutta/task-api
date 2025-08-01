import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import {
  AUTH_CLIENT,
  AUTH_PATTERNS,
  CredentialDto,
  CreateCredentialDto,
  UpdateCredentialDto,
} from '@app/common';

@Injectable()
export class ClientAuthService implements OnApplicationBootstrap {
  constructor(@Inject(AUTH_CLIENT) private readonly authClient: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.authClient.connect();
    console.log('Auth microservice connected');
  }

  create(createCredentialDto: CreateCredentialDto) {
    return this.authClient.send(AUTH_PATTERNS.CREATE, createCredentialDto);
  }
}
