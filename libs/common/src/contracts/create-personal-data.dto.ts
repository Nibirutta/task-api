import { PickType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-user.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreatePersonalDataDto extends PickType(CreateAccountDto, [
    'firstName',
    'lastName',
]) {
    @IsNotEmpty()
    @IsMongoId()
    owner: string;
}
