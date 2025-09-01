import {
    Controller,
    Post,
    Body,
    Patch,
    Delete,
    Param,
    Res,
} from '@nestjs/common';
import {
    LoginRequestDto,
    UpdateCredentialDto,
    CreateUserDto,
    TokenConfigService,
    TokenType,
} from '@app/common';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { ClientAuthService } from './client-auth.service';
import { Response } from 'express';
import { lastValueFrom } from 'rxjs';

@Controller('auth')
export class ClientAuthController {
    constructor(
        private readonly clientAuthService: ClientAuthService,
        private readonly tokenConfigService: TokenConfigService,
    ) {}

    @Post('register')
    async create(
        @Body() createUserDto: CreateUserDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        const { userInfo, accessToken, sessionToken } =
            await this.clientAuthService.create(createUserDto);

        response.cookie('sessionToken', sessionToken, {
            secure: true,
            httpOnly: true,
            maxAge: this.tokenConfigService.getTokenMaxAge(TokenType.SESSION),
            sameSite: 'none',
        });

        return {
            userInfo,
            accessToken,
        };
    }

    @Post('login')
    async login(
        @Body() loginRequestDto: LoginRequestDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        const { userInfo, accessToken, sessionToken } =
            await this.clientAuthService.login(loginRequestDto);

        response.cookie('sessionToken', sessionToken, {
            secure: true,
            httpOnly: true,
            maxAge: this.tokenConfigService.getTokenMaxAge(TokenType.SESSION),
            sameSite: 'none',
        });

        return {
            userInfo,
            accessToken,
        };
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
