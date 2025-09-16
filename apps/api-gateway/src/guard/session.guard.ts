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
import { AUTH_PATTERNS, TokenType, TRANSPORTER_PROVIDER } from '@app/common';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable()
export class SessionGuard implements CanActivate, OnApplicationBootstrap {
    constructor(@Inject(TRANSPORTER_PROVIDER) private readonly transporter: ClientProxy) {}
    
    async onApplicationBootstrap() {
        await this.transporter.connect();
        console.log('Session Guard connected to transporter');        
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();

        const sessionToken = request.cookies?.sessionToken;

        if (!sessionToken) {
            throw new UnauthorizedException('Unauthorized Access - Session Token Missing');
        }

        try {
            const decodedToken = await lastValueFrom(
                this.transporter.send(AUTH_PATTERNS.VALIDATE_TOKEN, {
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