import { PickType } from '@nestjs/mapped-types';
import { CreateAccountDto } from '@app/common';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateProfileDto extends PickType(CreateAccountDto, ['name']) {
    @IsNotEmpty()
    @IsMongoId()
    owner: string;
}
