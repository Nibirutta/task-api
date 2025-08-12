import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateCredentialDto } from '@app/common';

export class UpdateCredentialDto extends PartialType(
    OmitType(CreateCredentialDto, ['username']),
) {}
