import { PickType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-account.dto';

export class CreateCredentialDto extends PickType(CreateAccountDto, [
    'username',
    'email',
    'password',
]) {}
