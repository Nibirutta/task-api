import {
    IsString,
    IsNotEmpty,
    IsStrongPassword,
    IsOptional,
    IsEmail,
    Length,
} from 'class-validator';

export class CreateAccountDto {
    @IsNotEmpty()
    @IsString()
    @Length(3, 20)
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    password: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    lastName: string;
}
