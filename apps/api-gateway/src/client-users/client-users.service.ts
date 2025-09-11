import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
    CreatePersonalDataDto,
    IUserData,
    TRANSPORTER_PROVIDER,
    USER_PATTERNS,
} from '@app/common';
import { lastValueFrom, retry, timeout } from 'rxjs';

@Injectable()
export class ClientUsersService implements OnApplicationBootstrap {
    constructor(
        @Inject(TRANSPORTER_PROVIDER) private readonly transporter: ClientProxy,
    ) {}

    async onApplicationBootstrap() {
        await this.transporter.connect();
        console.log('Client users connected to transporter');
    }

    async createUser(
        createPersonalDataDto: CreatePersonalDataDto,
    ): Promise<IUserData> {
        try {
            return lastValueFrom<IUserData>(
                this.transporter
                    .send(USER_PATTERNS.CREATE, createPersonalDataDto)
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw error;
        }
    }

    async findUser(ownerId: string) {
        try {
            return lastValueFrom(
                this.transporter
                    .send(USER_PATTERNS.FIND, ownerId)
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(ownerId: string) {
        try {
            const userDeleted = await lastValueFrom(
                this.transporter
                    .send(USER_PATTERNS.DELETE, ownerId)
                    .pipe(retry(3), timeout(1000)),
            );

            return {
                userDeleted: userDeleted,
            };
        } catch (error) {
            throw error;
        }
    }
}
