import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCredentialDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  hashedPassword: string;
}
