import { PickType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-account.dto';

export class ResetRequestDto extends PickType(CreateAccountDto, ['email']) {}
