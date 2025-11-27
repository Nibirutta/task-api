import {
    CreateAccountDto,
    LoginRequestDto,
    ResetPasswordDto,
    ResetRequestDto,
    UpdateAccountDto,
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
    Query,
    HttpStatus,
    HttpCode,
} from '@nestjs/common';
import { ClientAccountService } from './client-account.service';
import { SendCookieInterceptor } from '../interceptors/send-cookie.interceptor';
import { JwtGuard } from '../guard/jwt.guard';
import { SessionGuard } from '../guard/session.guard';
import { LogoutInterceptor } from '../interceptors/logout.interceptor';
import { GuestGuard } from '../guard/guest.guard';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('account')
export class ClientAccountController {
    constructor(private readonly clientAccount: ClientAccountService) {}

    @Throttle({
        default: {
            limit: 20,
        },
    })
    @UseGuards(GuestGuard)
    @UseInterceptors(SendCookieInterceptor)
    @Post('register')
    register(@Body() createAccountDto: CreateAccountDto) {
        return this.clientAccount.register(createAccountDto);
    }

    @SkipThrottle()
    @UseGuards(JwtGuard)
    @UseInterceptors(SendCookieInterceptor)
    @Patch()
    update(@Request() req, @Body() updateAccountDto: UpdateAccountDto) {
        return this.clientAccount.updateAccount(req.user.sub, updateAccountDto);
    }

    @SkipThrottle()
    @UseGuards(JwtGuard)
    @UseInterceptors(LogoutInterceptor)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete()
    delete(@Request() req) {
        return this.clientAccount.deleteAccount(req.user.sub);
    }

    @Throttle({
        default: {
            limit: 15,
        },
    })
    @UseGuards(GuestGuard)
    @UseInterceptors(SendCookieInterceptor)
    @Post('login')
    login(@Body() loginRequestDto: LoginRequestDto) {
        return this.clientAccount.login(loginRequestDto);
    }

    @SkipThrottle()
    @UseInterceptors(LogoutInterceptor)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Get('logout')
    logout() {}

    @SkipThrottle()
    @UseGuards(SessionGuard)
    @UseInterceptors(SendCookieInterceptor)
    @Get('refresh')
    refreshSession(@Request() req) {
        return this.clientAccount.refreshSession(req.user.sub);
    }

    @Throttle({
        default: {
            limit: 10,
        },
    })
    @UseGuards(GuestGuard)
    @Post('request-reset')
    requestResetPassword(@Body() resetRequestDto: ResetRequestDto) {
        return this.clientAccount.requestPasswordReset(resetRequestDto);
    }

    @SkipThrottle()
    @UseGuards(GuestGuard)
    @Post('reset-password')
    resetPassword(
        @Query('token') token: string,
        @Body() resetPasswordDto: ResetPasswordDto,
    ) {
        return this.clientAccount.resetPassword(token, resetPasswordDto);
    }
}
