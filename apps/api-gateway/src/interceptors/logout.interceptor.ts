import {
    ACCOUNT_PATTERNS,
    TokenConfigService,
    TRANSPORTER_PROVIDER,
    TokenType,
} from '@app/common';
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class LogoutInterceptor implements NestInterceptor {
    constructor(
        private readonly tokenConfigService: TokenConfigService,
        @Inject(TRANSPORTER_PROVIDER) private readonly transporter: ClientProxy,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request: Request = context.switchToHttp().getRequest();
        const response: Response = context.switchToHttp().getResponse();

        const sessionToken = request.cookies?.sessionToken;

        if (sessionToken) {
            this.transporter
                .send(ACCOUNT_PATTERNS.LOGOUT, sessionToken)
                .subscribe();
        }

        return next.handle().pipe(
            map((data) => {
                response.clearCookie('sessionToken', {
                    secure: true,
                    httpOnly: true,
                    maxAge: this.tokenConfigService.getTokenMaxAge(
                        TokenType.SESSION,
                    ),
                    sameSite: 'none',
                });

                return data;
            }),
        );
    }
}
