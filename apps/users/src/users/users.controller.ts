import { Controller } from '@nestjs/common';
import { USER_PATTERNS, CreatePersonalDataDto } from '@app/common';
import { UsersService } from './users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @MessagePattern(USER_PATTERNS.CREATE)
    create(
        @Payload('id') id,
        @Payload('createPersonalDataDto')
        createPersonalDataDto: CreatePersonalDataDto,
    ) {
        return this.usersService.createUser(id, createPersonalDataDto);
    }
}
