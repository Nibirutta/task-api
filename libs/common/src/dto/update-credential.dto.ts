import { PartialType, OmitType } from '@nestjs/mapped-types';

import { CreateCredentialDto } from './create-credential.dto';
import { IsObjectId } from '../decorators/is-object-id.decorator';

export class UpdateCredentialDto extends PartialType(
  OmitType(CreateCredentialDto, ['username']),
) {
  @IsObjectId()
  id: string;
}
