import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-account.dto';
import {
    Languages,
    NotificationsTypes,
    Themes,
} from '@app/common/enums/profile.enum';
import {
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

class Notification {
    @IsNotEmpty()
    @IsString()
    @IsEnum(NotificationsTypes)
    notificationType: NotificationsTypes;

    @IsNotEmpty()
    @IsBoolean()
    isActivated: boolean;
}

export class UpdateAccountDto extends PartialType(
    OmitType(CreateAccountDto, ['username']),
) {
    @IsOptional()
    @IsString()
    @IsEnum(Languages)
    language?: Languages;

    @IsOptional()
    @IsString()
    @IsEnum(Themes)
    theme?: Themes;

    @IsOptional()
    @Type(() => Notification)
    notification?: Notification;
}
