import { Controller } from '@nestjs/common';
import { USER_PATTERNS, CreatePersonalDataDto } from '@app/common';
import { UsersService } from './users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @MessagePattern(USER_PATTERNS.CREATE)
    createUser(
        @Payload()
        createPersonalDataDto: CreatePersonalDataDto,
    ) {
        return this.usersService.createUser(createPersonalDataDto);
    }

    @MessagePattern(USER_PATTERNS.DELETE)
    deleteUser(
        @Payload(ParseObjectIdPipe)
        ownerId: string,
    ) {
        return this.usersService.deleteUser(ownerId);
    }
}
