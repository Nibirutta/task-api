import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';
import { TokenConfigService, TokenType } from '@app/common';

@Injectable()
export class SendCookieInterceptor implements NestInterceptor {
    constructor(
        private readonly tokenConfigService: TokenConfigService,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const response: Response = context.switchToHttp().getResponse();

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
