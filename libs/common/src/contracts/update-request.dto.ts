import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsObjectId, RegisterRequestDto } from '@app/common';

export class UpdateRequestDto extends PartialType(
  OmitType(RegisterRequestDto, ['username']),
) {
  @IsObjectId()
  id: string;
}
