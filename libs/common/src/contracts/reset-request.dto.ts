import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetRequestDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
