import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Languages } from '@app/common/enums/profile.enum';

export class ChangeLanguageDto {
    @IsNotEmpty()
    @IsString()
    @IsEnum(Languages)
    language: Languages;
}
