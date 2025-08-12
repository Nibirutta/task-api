import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
    AUTH_CLIENT,
    AUTH_PATTERNS,
    LoginRequestDto,
    CreateCredentialDto,
    UpdateCredentialDto,
} from '@app/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ClientAuthService implements OnApplicationBootstrap {
    constructor(
        @Inject(AUTH_CLIENT) private readonly authClient: ClientProxy,
    ) {}

    async onApplicationBootstrap() {
        await this.authClient.connect();
        console.log('Auth microservice connected');
    }

    async create(createCredentialDto: CreateCredentialDto) {
        try {
            return await lastValueFrom(
                this.authClient.send(AUTH_PATTERNS.CREATE, createCredentialDto),
            );
        } catch (error) {
            throw new RpcException(error);
        }
    }

    async update(id: string, updateCredentialDto: UpdateCredentialDto) {
        try {
            return await lastValueFrom(
                this.authClient.send(AUTH_PATTERNS.UPDATE, {
                    id,
                    updateRequestDto: updateCredentialDto,
                }),
            );
        } catch (error) {
            throw new RpcException(error);
        }
    }

    async delete(id: string) {
        try {
            return await lastValueFrom(
                this.authClient.send(AUTH_PATTERNS.DELETE, id),
            );
        } catch (error) {
            throw new RpcException(error);
        }
    }

    async login(loginRequestDto: LoginRequestDto) {
        try {
            return await lastValueFrom(
                this.authClient.send(AUTH_PATTERNS.LOGIN, loginRequestDto),
            );
        } catch (error) {
            throw new RpcException(error);
        }
    }
}
