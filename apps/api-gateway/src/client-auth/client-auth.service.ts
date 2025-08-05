import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import {
  AUTH_CLIENT,
  AUTH_PATTERNS,
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

  async create(registerRequestDto: RegisterRequestDto) {
    try {
      return await lastValueFrom(
        this.authClient.send(AUTH_PATTERNS.CREATE, registerRequestDto),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async update(updateRequestDto: UpdateRequestDto) {
    try {
      return await lastValueFrom(
        this.authClient.send(AUTH_PATTERNS.UPDATE, updateRequestDto)  
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
