import { Controller, Post, Body, Patch, Delete, Param } from '@nestjs/common';
import {
    LoginRequestDto,
    UpdateCredentialDto,
    CreateUserDto,
} from '@app/common';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { ClientAuthService } from './client-auth.service';

@Controller('auth')
export class ClientAuthController {
    constructor(private readonly authClient: ClientAuthService) {}

    @Post('register')
    create(@Body() createUserDto: CreateUserDto) {
        return this.authClient.create(createUserDto);
    }

    @Post('login')
    login(@Body() loginRequestDto: LoginRequestDto) {
        return this.authClient.login(loginRequestDto);
    }

    @Patch(':id')
    update(
        @Param('id', ParseObjectIdPipe) id: string,
        @Body() updateCredentialDto: UpdateCredentialDto,
    ) {
        return this.authClient.update(id, updateCredentialDto);
    }

    @Delete(':id')
    delete(@Param('id', ParseObjectIdPipe) id: string) {
        return this.authClient.delete(id);
    }
}
