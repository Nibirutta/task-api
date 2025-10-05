import { PickType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-account.dto';

export class ResetPasswordDto extends PickType(CreateAccountDto, [
    'password',
]) {}
