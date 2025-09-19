import { PickType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-account.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateProfileDto extends PickType(CreateAccountDto, ['name']) {
    @IsNotEmpty()
    @IsMongoId()
    owner: string;
}
