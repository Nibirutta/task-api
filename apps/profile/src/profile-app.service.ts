import { Injectable, Inject } from '@nestjs/common';
import {
    AUTH_PATTERNS,
    ChangeLanguageDto,
    ChangeNameDto,
    ChangeNotificationDto,
    ChangeThemeDto,
    CreateProfileDto,
    TRANSPORTER_PROVIDER,
} from '@app/common';
import { ProfileService } from './profile/profile.service';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, retry, timeout } from 'rxjs';

@Injectable()
export class ProfileAppService {
    constructor(
        private readonly profileService: ProfileService,
        @Inject(TRANSPORTER_PROVIDER) private readonly transporter: ClientProxy,
    ) {}

    async createProfile(createProfileDto: CreateProfileDto) {
        try {
            await lastValueFrom(
                this.transporter
                    .send(AUTH_PATTERNS.FIND, createProfileDto.owner)
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw error;
        }

        const createdProfile =
            await this.profileService.createProfile(createProfileDto);

        return createdProfile.toObject();
    }

    async deleteProfile(ownerId: string) {
        const deletedProfile = await this.profileService.deleteProfile(ownerId);

        return deletedProfile.toObject();
    }

    async findProfile(ownerId: string) {
        const foundProfile = await this.profileService.findProfile(ownerId);

        return foundProfile.toObject();
    }

    async changeName(ownerId: string, changeNameDto: ChangeNameDto) {
        const changedProfile = await this.profileService.changeName(
            ownerId,
            changeNameDto,
        );

        return changedProfile.toObject();
    }

    async changeLanguage(
        ownerId: string,
        changeLanguageDto: ChangeLanguageDto,
    ) {
        const changedProfile = await this.profileService.changeLanguage(
            ownerId,
            changeLanguageDto,
        );

        return changedProfile.toObject();
    }

    async changeNotification(
        ownerId: string,
        changeNotificationDto: ChangeNotificationDto,
    ) {
        const changedProfile = await this.profileService.changeNotification(
            ownerId,
            changeNotificationDto,
        );

        return changedProfile.toObject();
    }

    async changeTheme(ownerId: string, changeThemeDto: ChangeThemeDto) {
        const changedProfile = await this.profileService.changeTheme(
            ownerId,
            changeThemeDto,
        );

        return changedProfile.toObject();
    }

    async ownerUpdated(ownerId: string) {
        const changedProfile = await this.profileService.ownerUpdated(ownerId);

        return changedProfile.toObject();
    }
}
