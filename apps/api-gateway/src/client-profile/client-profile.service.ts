import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
    CreateProfileDto,
    IProfileData,
    TRANSPORTER_PROVIDER,
    PROFILE_PATTERNS,
} from '@app/common';
import { lastValueFrom, retry, timeout } from 'rxjs';

@Injectable()
export class ClientProfileService implements OnApplicationBootstrap {
    constructor(
        @Inject(TRANSPORTER_PROVIDER) private readonly transporter: ClientProxy,
    ) {}

    async onApplicationBootstrap() {
        await this.transporter.connect();
        console.log('Client profile connected to transporter');
    }

    async createProfile(
        createProfileDto: CreateProfileDto,
    ): Promise<IProfileData> {
        try {
            return lastValueFrom<IProfileData>(
                this.transporter
                    .send(PROFILE_PATTERNS.CREATE, createProfileDto)
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw error;
        }
    }

    async findProfile(ownerId: string) {
        try {
            return lastValueFrom<IProfileData>(
                this.transporter
                    .send(PROFILE_PATTERNS.FIND, ownerId)
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw error;
        }
    }

    async deleteProfile(ownerId: string) {
        try {
            return lastValueFrom<IProfileData>(
                this.transporter
                    .send(PROFILE_PATTERNS.DELETE, ownerId)
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw error;
        }
    }
}
