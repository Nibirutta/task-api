import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateIf,
} from 'class-validator';

export class LoginRequestDto {
    @IsOptional()
    @IsString()
    username?: string;

    @ValidateIf((obj) => obj.username === undefined)
    @IsString()
    @IsEmail()
    email?: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
