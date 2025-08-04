import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsObjectId, CreateCredentialDto } from '@app/common';

export class UpdateCredentialDto extends PartialType(
  OmitType(CreateCredentialDto, ['username']),
) {
  @IsObjectId()
  id: string;
}
