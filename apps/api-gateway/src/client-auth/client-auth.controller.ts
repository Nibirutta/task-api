import { Controller, Body, Patch, Request, UseGuards } from '@nestjs/common';
import { UpdateCredentialDto } from '@app/common';
import { ClientAuthService } from './client-auth.service';
import { JwtGuard } from '../guard/jwt.guard';

@Controller('auth')
export class ClientAuthController {
    constructor(private readonly clientAuthService: ClientAuthService) {}

    @UseGuards(JwtGuard)
    @Patch()
    update(@Request() req, @Body() updateCredentialDto: UpdateCredentialDto) {
        return this.clientAuthService.updateCredential(
            req.user.sub,
            updateCredentialDto,
        );
    }
}
