import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Themes } from '@app/common/enums/profile.enum';

export class ChangeThemeDto {
    @IsNotEmpty()
    @IsString()
    @IsEnum(Themes)
    theme: Themes;
}
