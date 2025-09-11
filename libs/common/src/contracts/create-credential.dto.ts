import { PickType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-user.dto';

export class CreateCredentialDto extends PickType(CreateAccountDto, [
    'username',
    'email',
    'password',
]) {}
