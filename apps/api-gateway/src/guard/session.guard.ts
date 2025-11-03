import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    OnApplicationBootstrap,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import { ACCOUNT_PATTERNS, TokenType, TRANSPORTER_PROVIDER } from '@app/common';
import { lastValueFrom } from 'rxjs';

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
        const request = context.switchToHttp().getRequest<Request>();

        const sessionToken = request.cookies?.sessionToken;

        if (!sessionToken) {
            throw new UnauthorizedException(
                'Unauthorized Access - Session Token Missing',
            );
        }

        try {
            const decodedToken = await lastValueFrom(
                this.transporter.send(ACCOUNT_PATTERNS.VALIDATE_TOKEN, {
                    token: sessionToken,
                    tokenType: TokenType.SESSION,
                }),
            );

            request['user'] = decodedToken;
        } catch (error) {
            throw error;
        }

        return true;
    }
}
