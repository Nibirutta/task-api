import { Controller } from '@nestjs/common';
import {
    PROFILE_PATTERNS,
    CreateProfileDto,
    ChangeThemeDto,
    ChangeNameDto,
    ChangeLanguageDto,
    ChangeNotificationDto,
} from '@app/common';
import { ProfileService } from './profile.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller()
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @MessagePattern(PROFILE_PATTERNS.CREATE)
    createUser(
        @Payload()
        createProfileDto: CreateProfileDto,
    ) {
        return this.profileService.createProfile(createProfileDto);
    }

    @MessagePattern(PROFILE_PATTERNS.DELETE)
    deleteUser(
        @Payload(ParseObjectIdPipe)
        ownerId: string,
    ) {
        return this.profileService.deleteProfile(ownerId);
    }

    @MessagePattern(PROFILE_PATTERNS.FIND)
    findUser(@Payload(ParseObjectIdPipe) ownerId: string) {
        return this.profileService.findProfile(ownerId);
    }

    @MessagePattern(PROFILE_PATTERNS.OWNER_UPDATED)
    ownerUpdated(@Payload(ParseObjectIdPipe) ownerId: string) {
        return this.profileService.ownerUpdated(ownerId);
    }

    @MessagePattern(PROFILE_PATTERNS.CHANGE_NAME)
    changeName(
        @Payload('ownerId', ParseObjectIdPipe) ownerId,
        @Payload('changeNameDto') changeNameDto: ChangeNameDto,
    ) {
        return this.profileService.changeName(ownerId, changeNameDto);
    }

    @MessagePattern(PROFILE_PATTERNS.CHANGE_LANGUAGE)
    changeLanguage(
        @Payload('ownerId', ParseObjectIdPipe) ownerId,
        @Payload('changeLanguageDto') changeLanguageDto: ChangeLanguageDto,
    ) {
        return this.profileService.changeLanguage(ownerId, changeLanguageDto);
    }

    @MessagePattern(PROFILE_PATTERNS.CHANGE_NOTIFICATION)
    changeNotification(
        @Payload('ownerId', ParseObjectIdPipe) ownerId,
        @Payload('changeNotificationDto')
        changeNotificationDto: ChangeNotificationDto,
    ) {
        return this.profileService.changeNotification(
            ownerId,
            changeNotificationDto,
        );
    }

    @MessagePattern(PROFILE_PATTERNS.CHANGE_THEME)
    changeTheme(
        @Payload('ownerId', ParseObjectIdPipe) ownerId,
        @Payload('changeThemeDto') changeThemeDto: ChangeThemeDto,
    ) {
        return this.profileService.changeTheme(ownerId, changeThemeDto);
    }
}
