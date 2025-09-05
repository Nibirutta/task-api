import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Inject
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Observable, map, lastValueFrom, timeout } from 'rxjs';
import { AUTH_PATTERNS, TokenConfigService, TokenType, TRANSPORTER_PROVIDER } from '@app/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

@Injectable()
export class SendCookieInterceptor implements NestInterceptor {
    constructor(
        private readonly tokenConfigService: TokenConfigService,
        @Inject(TRANSPORTER_PROVIDER) private readonly transporter: ClientProxy
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const response: Response = context.switchToHttp().getResponse();
        const request: Request = context.switchToHttp().getRequest();

        const [type, cookie] = request.headers.cookie?.split('=') ?? [];

        if (type === "sessionToken") {
            this.transporter.send(AUTH_PATTERNS.DELETE_TOKEN, cookie).subscribe();
        }

        return next.handle().pipe(
            map((data) => {
                if (data?.sessionToken) {
                    response.clearCookie('sessionToken', {
                        secure: true,
                        httpOnly: true,
                        maxAge: this.tokenConfigService.getTokenMaxAge(
                            TokenType.SESSION,
                        ),
                        sameSite: 'none',
                    });

                    response.cookie('sessionToken', data.sessionToken, {
                        secure: true,
                        httpOnly: true,
                        maxAge: this.tokenConfigService.getTokenMaxAge(
                            TokenType.SESSION,
                        ),
                        sameSite: 'none',
                    });

                    const { sessionToken, ...rest } = data;
                    return rest;
                }

                return data;
            }),
        );
    }
}
