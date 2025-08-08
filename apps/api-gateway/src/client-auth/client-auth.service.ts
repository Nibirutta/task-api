import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
  AUTH_CLIENT,
  AUTH_PATTERNS,
  LoginRequestDto,
  RegisterRequestDto,
  UpdateRequestDto,
} from '@app/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ClientAuthService implements OnApplicationBootstrap {
  constructor(@Inject(AUTH_CLIENT) private readonly authClient: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.authClient.connect();
    console.log('Auth microservice connected');
  }

  create(registerRequestDto: RegisterRequestDto) {
    try {
      return lastValueFrom(
        this.authClient.send(AUTH_PATTERNS.CREATE, registerRequestDto),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  update(id: string, updateRequestDto: UpdateRequestDto) {
    try {
      return lastValueFrom(
        this.authClient.send(AUTH_PATTERNS.UPDATE, { id, updateRequestDto }),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  delete(id: string) {
    try {
      return lastValueFrom(this.authClient.send(AUTH_PATTERNS.DELETE, id));
    } catch (error) {
      throw new RpcException(error);
    }
  }

  login(loginRequestDto: LoginRequestDto) {
    try {
      return lastValueFrom(
        this.authClient.send(AUTH_PATTERNS.LOGIN, loginRequestDto),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
