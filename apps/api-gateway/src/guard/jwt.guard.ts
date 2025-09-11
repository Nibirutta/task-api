import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    OnApplicationBootstrap,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { AUTH_PATTERNS, TokenType, TRANSPORTER_PROVIDER } from '@app/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class JwtGuard implements CanActivate, OnApplicationBootstrap {
    constructor(
        @Inject(TRANSPORTER_PROVIDER) private readonly transporter: ClientProxy,
    ) {}

    async onApplicationBootstrap() {
        await this.transporter.connect();
        console.log('Guard connected to transporter');
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const accessToken = this.extractTokenFromHeader(request);

        if (!accessToken) {
            throw new UnauthorizedException(
                'Unauthorized Access - Access Token Missing',
            );
        }

        try {
            const payload = await lastValueFrom(
                this.transporter.send(AUTH_PATTERNS.VALIDATE_TOKEN, {
                    token: accessToken,
                    tokenType: TokenType.ACCESS,
                }),
            );

            request['user'] = payload;
        } catch (error) {
            throw new RpcException(error);
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
