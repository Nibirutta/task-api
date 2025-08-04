import { IsUsernameOrEmail } from '@app/common';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @IsUsernameOrEmail()
  @IsString()
  username?: string;

  @IsString()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
