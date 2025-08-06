import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import {
  AUTH_CLIENT,
  AUTH_PATTERNS,
  LoginRequestDto,
  RegisterRequestDto,
  UpdateRequestDto,
} from '@app/common';

@Injectable()
export class ClientAuthService implements OnApplicationBootstrap {
  constructor(@Inject(AUTH_CLIENT) private readonly authClient: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.authClient.connect();
    console.log('Auth microservice connected');
  }

  create(registerRequestDto: RegisterRequestDto) {
    return this.authClient.send(AUTH_PATTERNS.CREATE, registerRequestDto);
  }

  update(updateRequestDto: UpdateRequestDto) {
    return this.authClient.send(AUTH_PATTERNS.UPDATE, updateRequestDto);
  }

  login(loginRequestDto: LoginRequestDto) {
    return this.authClient.send(AUTH_PATTERNS.LOGIN, loginRequestDto);
  }

  delete(id: string) {
    return this.authClient.send(AUTH_PATTERNS.DELETE, id);
  }
}
