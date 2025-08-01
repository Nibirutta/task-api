import { Controller, Post, Body } from '@nestjs/common';
import { CreateCredentialDto } from '@app/common';

import { ClientAuthService } from './client-auth.service';

@Controller('auth')
export class ClientAuthController {
    constructor(private readonly authClient: ClientAuthService) {}

    @Post('register')
    create(@Body() createCredentialDto: CreateCredentialDto) {
        return this.authClient.create(createCredentialDto);
    }
}
