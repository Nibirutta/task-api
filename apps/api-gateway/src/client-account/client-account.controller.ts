import {
    CreateAccountDto,
    LoginRequestDto,
    ResetRequestDto,
    UpdateCredentialDto,
} from '@app/common';
import {
    Body,
    Controller,
    Post,
    UseInterceptors,
    Request,
    Delete,
    UseGuards,
    Get,
    Patch,
} from '@nestjs/common';
import { ClientAccountService } from './client-account.service';
import { SendCookieInterceptor } from '../interceptors/send-cookie.interceptor';
import { JwtGuard } from '../guard/jwt.guard';
import { SessionGuard } from '../guard/session.guard';
import { SendProfileInterceptor } from '../interceptors/send-profile.interceptor';
import { LogoutInterceptor } from '../interceptors/logout.interceptor';

@Controller('account')
export class ClientAccountController {
    constructor(private readonly clientAccount: ClientAccountService) {}

    @UseGuards(SessionGuard)
    @UseInterceptors(SendCookieInterceptor, SendProfileInterceptor)
    @Get('refresh')
    refreshSession(@Request() req) {
        return this.clientAccount.refreshSession(req.user.sub);
    }

    @UseInterceptors(LogoutInterceptor)
    @Get('logout')
    logout() {
        return { message: 'Logout successful' };
    }

    @UseInterceptors(SendCookieInterceptor, SendProfileInterceptor)
    @Post('register')
    registerAccount(@Body() createUserDto: CreateAccountDto) {
        return this.clientAccount.createAccount(createUserDto);
    }

    @UseGuards(JwtGuard)
    @UseInterceptors(SendCookieInterceptor, SendProfileInterceptor)
    @Patch('credential')
    updateAccount(
        @Request() req,
        @Body() updateCredentialDto: UpdateCredentialDto,
    ) {
        return this.clientAccount.updateAccount(
            req.user.sub,
            updateCredentialDto,
        );
    }

    @UseInterceptors(SendCookieInterceptor, SendProfileInterceptor)
    @Post('login')
    login(@Body() loginRequestDto: LoginRequestDto) {
        return this.clientAccount.login(loginRequestDto);
    }

    @Post('request-reset')
    requestPasswordReset(@Body() resetRequestDto: ResetRequestDto) {
        return this.clientAccount.requestPasswordReset(resetRequestDto);
    }

    @UseGuards(JwtGuard)
    @UseInterceptors(LogoutInterceptor)
    @Delete()
    deleteAccount(@Request() req) {
        return this.clientAccount.deleteAccount(req.user.sub);
    }
}
