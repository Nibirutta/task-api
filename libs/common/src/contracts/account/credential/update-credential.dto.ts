import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateCredentialDto } from './create-credential.dto';

export class UpdateCredentialDto extends PartialType(
    OmitType(CreateCredentialDto, ['username']),
) {}
