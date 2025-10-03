import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailDto {
    @IsNotEmpty()
    @IsEmail()
    receiver: string;

    @IsNotEmpty()
    @IsString()
    subject: string;

    @IsNotEmpty()
    @IsString()
    message: string;
}
