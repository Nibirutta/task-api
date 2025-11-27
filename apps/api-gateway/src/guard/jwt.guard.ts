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
import { InjectPinoLogger, Logger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class JwtGuard implements CanActivate, OnApplicationBootstrap {
    constructor(
        @Inject(TRANSPORTER_PROVIDER) private readonly transporter: ClientProxy,
        @InjectPinoLogger() private readonly logger: PinoLogger
    ) {}

    async onApplicationBootstrap() {
        await this.transporter.connect();
        this.logger.info('JWT Guard connected to transporter');
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest<Request>();
        const accessToken = this.extractTokenFromHeader(request);

        if (!accessToken) {
            throw new UnauthorizedException(
                'Unauthorized Access - Access Token Missing',
            );
        }

        try {
            const decodedToken = await lastValueFrom(
                this.transporter.send(ACCOUNT_PATTERNS.VALIDATE_TOKEN, {
                    token: accessToken,
                    tokenType: TokenType.ACCESS,
                }),
            );

            request['user'] = decodedToken;
        } catch (error) {
            throw error;
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
