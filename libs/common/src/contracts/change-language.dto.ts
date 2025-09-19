import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Languages } from '../enums/profile.enum';

export class ChangeLanguageDto {
    @IsNotEmpty()
    @IsString()
    @IsEnum(Languages)
    language: Languages;
}
