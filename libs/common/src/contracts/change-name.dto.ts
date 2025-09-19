import { PickType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-account.dto';

export class ChangeNameDto extends PickType(CreateAccountDto, ['name']) {}
