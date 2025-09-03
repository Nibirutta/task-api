import {
    Controller,
    Post,
    Body,
    Patch,
    Delete,
    Param,
    UseInterceptors,
    Request,
    Get,
    UseGuards,
} from '@nestjs/common';
import {
    LoginRequestDto,
    UpdateCredentialDto,
    CreateUserDto,
} from '@app/common';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { ClientAuthService } from './client-auth.service';
import { SendCookieInterceptor } from '../interceptors/send-cookie.interceptor';
import { AuthGuard } from '../guard/auth.guard';

@Controller('auth')
export class ClientAuthController {
    constructor(private readonly clientAuthService: ClientAuthService) {}

    // For testing purposes
    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @UseInterceptors(SendCookieInterceptor)
    @Post('register')
    async create(@Body() createUserDto: CreateUserDto) {
        return this.clientAuthService.create(createUserDto);
    }

    @UseInterceptors(SendCookieInterceptor)
    @Post('login')
    async login(@Body() loginRequestDto: LoginRequestDto) {
        return this.clientAuthService.login(loginRequestDto);
    }

    @Patch(':id')
    update(
        @Param('id', ParseObjectIdPipe) id: string,
        @Body() updateCredentialDto: UpdateCredentialDto,
    ) {
        return this.clientAuthService.update(id, updateCredentialDto);
    }

    @Delete(':id')
    delete(@Param('id', ParseObjectIdPipe) id: string) {
        return this.clientAuthService.delete(id);
    }
}
