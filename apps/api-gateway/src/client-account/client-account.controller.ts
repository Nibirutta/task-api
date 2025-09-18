import { CreateAccountDto, LoginRequestDto } from '@app/common';
import {
    Body,
    Controller,
    Post,
    UseInterceptors,
    Request,
    Delete,
    UseGuards,
    Get,
} from '@nestjs/common';
import { ClientAccountService } from './client-account.service';
import { SendCookieInterceptor } from '../interceptors/send-cookie.interceptor';
import { JwtGuard } from '../guard/jwt.guard';
import { SessionGuard } from '../guard/session.guard';
import { SendUserInfoInterceptor } from '../interceptors/send-user-info.interceptor';

@Controller('account')
export class ClientAccountController {
    constructor(private readonly clientAccount: ClientAccountService) {}

    @UseGuards(SessionGuard)
    @UseInterceptors(SendCookieInterceptor, SendUserInfoInterceptor)
    @Get('refresh')
    refreshSession(@Request() req) {
        return this.clientAccount.refreshSession(req.user.sub);
    }

    @UseInterceptors(SendCookieInterceptor, SendUserInfoInterceptor)
    @Post('register')
    registerAccount(@Body() createUserDto: CreateAccountDto) {
        return this.clientAccount.createAccount(createUserDto);
    }

    @UseInterceptors(SendCookieInterceptor, SendUserInfoInterceptor)
    @Post('login')
    login(@Body() loginRequestDto: LoginRequestDto) {
        return this.clientAccount.login(loginRequestDto);
    }

    @UseGuards(JwtGuard)
    @Delete()
    deleteAccount(@Request() req) {
        return this.clientAccount.deleteAccount(req.user.sub);
    }
}
