import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { NotificationsTypes } from '@app/common/enums/profile.enum';

export class ChangeNotificationDto {
    @IsNotEmpty()
    @IsString()
    @IsEnum(NotificationsTypes)
    notificationType: NotificationsTypes;

    @IsNotEmpty()
    @IsBoolean()
    activate: boolean;
}
