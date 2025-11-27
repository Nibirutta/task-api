import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class GuestGuard implements CanActivate {

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>();
        const accessToken = this.extractTokenFromHeader(request);
        const sessionToken = request.cookies?.sessionToken;

        if (accessToken || sessionToken) {
            throw new ForbiddenException(
                'Already authenticated users cannot access this route',
            );
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
