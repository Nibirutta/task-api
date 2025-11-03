import { PickType } from '@nestjs/mapped-types';
import { CreateAccountDto } from '@app/common';

export class CreateCredentialDto extends PickType(CreateAccountDto, [
    'username',
    'email',
    'password',
]) {}
