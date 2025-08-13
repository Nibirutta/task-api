import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreatePersonalDataDto extends PickType(CreateUserDto, [
    'firstName',
    'lastName',
]) {
    @IsNotEmpty()
    @IsMongoId()
    owner: string;
}
