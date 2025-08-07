import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import {
  AUTH_CLIENT,
  AUTH_PATTERNS,
  LoginRequestDto,
  RegisterRequestDto,
  UpdateRequestDto,
} from '@app/common';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable()
export class ClientAuthService implements OnApplicationBootstrap {
  constructor(@Inject(AUTH_CLIENT) private readonly authClient: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.authClient.connect();
    console.log('Auth microservice connected');
  }

  async handleMicroserviceCall<T>(observable: Observable<T>): Promise<T> {
    try {
      return await lastValueFrom(observable);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  create(registerRequestDto: RegisterRequestDto) {
    return this.handleMicroserviceCall(
      this.authClient.send(AUTH_PATTERNS.CREATE, registerRequestDto),
    );
  }

  update(id: string, updateRequestDto: UpdateRequestDto) {
    return this.handleMicroserviceCall(
      this.authClient.send(AUTH_PATTERNS.UPDATE, { id, updateRequestDto }),
    );
  }

  delete(id: string) {
    return this.handleMicroserviceCall(
      this.authClient.send(AUTH_PATTERNS.DELETE, id),
    );
  }

  login(loginRequestDto: LoginRequestDto) {
    return this.handleMicroserviceCall(
      this.authClient.send(AUTH_PATTERNS.LOGIN, loginRequestDto),
    );
  }
}
