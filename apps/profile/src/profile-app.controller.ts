import {
    CreateProfileDto,
    PROFILE_PATTERNS,
    ChangeNameDto,
    ChangeLanguageDto,
    ChangeNotificationDto,
    ChangeThemeDto,
} from '@app/common';
import { Controller } from '@nestjs/common';
import { Payload, MessagePattern } from '@nestjs/microservices';
import { ProfileAppService } from './profile-app.service';

@Controller()
export class ProfileAppController {
    constructor(private readonly profileAppService: ProfileAppService) {}

    @MessagePattern(PROFILE_PATTERNS.CREATE)
    createProfile(@Payload() createProfileDto: CreateProfileDto) {
        return this.profileAppService.createProfile(createProfileDto);
    }

    @MessagePattern(PROFILE_PATTERNS.DELETE)
    deleteProfile(@Payload() ownerId: string) {
        return this.profileAppService.deleteProfile(ownerId);
    }

    @MessagePattern(PROFILE_PATTERNS.FIND)
    findProfile(@Payload() ownerId: string) {
        return this.profileAppService.findProfile(ownerId);
    }

    @MessagePattern(PROFILE_PATTERNS.CHANGE_NAME)
    changeName(
        @Payload('ownerId') ownerId,
        @Payload('changeNameDto') changeNameDto: ChangeNameDto,
    ) {
        return this.profileAppService.changeName(ownerId, changeNameDto);
    }

    @MessagePattern(PROFILE_PATTERNS.CHANGE_LANGUAGE)
    changeLanguage(
        @Payload('ownerId') ownerId,
        @Payload('changeLanguageDto') changeLanguageDto: ChangeLanguageDto,
    ) {
        return this.profileAppService.changeLanguage(
            ownerId,
            changeLanguageDto,
        );
    }

    @MessagePattern(PROFILE_PATTERNS.CHANGE_NOTIFICATION)
    changeNotification(
        @Payload('ownerId') ownerId,
        @Payload('changeNotificationDto')
        changeNotificationDto: ChangeNotificationDto,
    ) {
        return this.profileAppService.changeNotification(
            ownerId,
            changeNotificationDto,
        );
    }

    @MessagePattern(PROFILE_PATTERNS.CHANGE_THEME)
    changeTheme(
        @Payload('ownerId') ownerId,
        @Payload('changeThemeDto') changeThemeDto: ChangeThemeDto,
    ) {
        return this.profileAppService.changeTheme(ownerId, changeThemeDto);
    }

    @MessagePattern(PROFILE_PATTERNS.OWNER_UPDATED)
    ownerUpdated(@Payload() ownerId: string) {
        return this.profileAppService.ownerUpdated(ownerId);
    }
}
