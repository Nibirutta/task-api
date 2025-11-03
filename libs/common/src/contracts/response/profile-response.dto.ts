import { Languages, Themes } from '@app/common/enums/profile.enum';
import { Expose, Transform, Type } from 'class-transformer';

class NotificationPreferencesDto {
    @Expose()
    email: boolean;
}

class PreferencesDto {
    @Expose()
    theme: Themes;

    @Expose()
    language: Languages;

    @Expose()
    @Type(() => NotificationPreferencesDto)
    notification: NotificationPreferencesDto;
}

export class ProfileResponseDto {
    @Expose()
    name: string;

    @Expose()
    @Type(() => PreferencesDto)
    preferences: PreferencesDto;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}
