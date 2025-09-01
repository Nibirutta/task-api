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
        console.log('Connected to transporter');
    }

    createUser(createPersonalDataDto: CreatePersonalDataDto) {
        return lastValueFrom<IUserData>(
            this.transporter
                .send(USER_PATTERNS.CREATE, createPersonalDataDto)
                .pipe(retry(3), timeout(1000)),
        );
    }

    deleteUser(ownerId: string) {
        return lastValueFrom(
            this.transporter
                .send(USER_PATTERNS.DELETE, ownerId)
                .pipe(retry(3), timeout(1000)),
        );
    }
}
