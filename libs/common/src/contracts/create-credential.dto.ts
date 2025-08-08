import {
  IsStrongPassword,
  IsString,
  Length,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class CreateCredentialDto {
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
}
