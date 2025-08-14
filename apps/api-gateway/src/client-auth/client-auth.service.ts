import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
    AUTH_CLIENT,
    AUTH_PATTERNS,
    LoginRequestDto,
    CreateCredentialDto,
    UpdateCredentialDto,
    CreateUserDto,
    CreatePersonalDataDto,
    USER_PATTERNS,
    USERS_CLIENT,
} from '@app/common';
import { pick } from 'lodash';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ClientAuthService implements OnApplicationBootstrap {
    constructor(
        @Inject(AUTH_CLIENT) private readonly authClient: ClientProxy,
        @Inject(USERS_CLIENT) private readonly usersClient: ClientProxy,
    ) {}

    async onApplicationBootstrap() {
        await this.authClient.connect();
        await this.usersClient.connect();
        console.log('Auth and Users microservice connected');
    }

    async create(createUserDto: CreateUserDto) {
        const createCredentialDto: CreateCredentialDto = pick(createUserDto, [
            'username',
            'email',
            'password',
        ]);
        let id: string;
        let userData;

        try {
            id = await lastValueFrom(
                this.authClient.send(AUTH_PATTERNS.CREATE, createCredentialDto),
            );
        } catch (error) {
            throw new RpcException(error);
        }

        const createPersonalDataDto: CreatePersonalDataDto = {
            owner: id,
            ...pick(createUserDto, ['firstName', 'lastName']),
        };

        try {
            userData = await lastValueFrom(
                this.usersClient.send(
                    USER_PATTERNS.CREATE,
                    createPersonalDataDto,
                ),
            );
        } catch (error) {
            throw new RpcException(error);
        }

        try {
            return this.authClient.send(AUTH_PATTERNS.SIGN_IN, userData);
        } catch (error) {
            throw new RpcException(error);
        }
    }

    async update(id: string, updateCredentialDto: UpdateCredentialDto) {
        try {
            return await lastValueFrom(
                this.authClient.send(AUTH_PATTERNS.UPDATE, {
                    id,
                    updateCredentialDto: updateCredentialDto,
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
