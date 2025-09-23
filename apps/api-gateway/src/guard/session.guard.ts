import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Inject,
    Injectable,
    OnApplicationBootstrap,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_PATTERNS, TokenType, TRANSPORTER_PROVIDER } from '@app/common';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable()
export class SessionGuard implements CanActivate, OnApplicationBootstrap {
    constructor(
        @Inject(TRANSPORTER_PROVIDER) private readonly transporter: ClientProxy,
    ) {}

    async onApplicationBootstrap() {
        await this.transporter.connect();
        console.log('Session Guard connected to transporter');
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();

        const sessionToken = request.cookies?.sessionToken;

        if (!sessionToken) {
            throw new UnauthorizedException(
                'Unauthorized Access - Session Token Missing',
            );
        }

        try {
            const tokenData = await lastValueFrom(
                this.transporter.send(AUTH_PATTERNS.VALIDATE_TOKEN, {
                    token: sessionToken,
                    tokenType: TokenType.SESSION,
                }),
            );

            if (!tokenData.isSecure) {
                const hackedUser = await lastValueFrom(
                    this.transporter.send(AUTH_PATTERNS.FIND, tokenData.decodedToken.sub)
                );

                if (hackedUser) {
                    this.transporter.send(AUTH_PATTERNS.DELETE_USER_TOKENS, tokenData.decodedToken.sub).subscribe();

                    // Sends an email to the user requesting a password change
                }

                throw new ForbiddenException('Not allowed - invalid token');
            }

            request['user'] = tokenData.decodedToken;
        } catch (error) {
            throw error;
        }

        return true;
    }
}
