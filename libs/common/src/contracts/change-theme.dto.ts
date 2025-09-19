import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Themes } from '../enums/profile.enum';

export class ChangeThemeDto {
    @IsNotEmpty()
    @IsString()
    @IsEnum(Themes)
    theme: Themes;
}
