import { PartialType, OmitType } from '@nestjs/mapped-types';
import { RegisterRequestDto } from '@app/common';

export class UpdateRequestDto extends PartialType(
  OmitType(RegisterRequestDto, ['username']),
) {}
