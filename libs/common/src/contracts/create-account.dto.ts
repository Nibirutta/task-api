import {
    IsString,
    IsNotEmpty,
    IsStrongPassword,
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
    @Length(1, 20)
    name: string;
}
