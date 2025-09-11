import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Inject,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Observable, map } from 'rxjs';
import {
    AUTH_PATTERNS,
    ICredentialData,
    IUserData,
    TokenConfigService,
    TokenType,
    TRANSPORTER_PROVIDER,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class SendCookieInterceptor implements NestInterceptor {
    constructor(
        private readonly tokenConfigService: TokenConfigService,
        @Inject(TRANSPORTER_PROVIDER) private readonly transporter: ClientProxy,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const response: Response = context.switchToHttp().getResponse();
        const request: Request = context.switchToHttp().getRequest();

        const sessionToken = request.cookies?.sessionToken;

        if (sessionToken) {
            this.transporter
                .send(AUTH_PATTERNS.DELETE_TOKEN, sessionToken)
                .subscribe();
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

                    const credentialData: ICredentialData = data.credentialData;
                    const userData: IUserData = data.userData;
                    const accessToken = data.accessToken;

                    const userInfo = {
                        username: credentialData.username,
                        firstName: userData.firstName,
                        preferences: userData.preferences,
                        userCreatedAt:
                            credentialData.createdAt < userData.createdAt
                                ? credentialData.createdAt
                                : userData.createdAt,
                        userUpdatedAt:
                            credentialData.updatedAt > userData.updatedAt
                                ? credentialData.updatedAt
                                : userData.updatedAt,
                    };

                    return {
                        userInfo,
                        accessToken,
                    };
                }

                return data;
            }),
        );
    }
}
