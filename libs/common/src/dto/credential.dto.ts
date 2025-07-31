import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

import { IsObjectId } from '../decorators/is-object-id.decorator';

export class CredentialDto {
  @IsNotEmpty()
  @IsObjectId()
  id: string;

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
