import {
    NestInterceptor,
    Injectable,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { omit } from 'lodash';

@Injectable()
export class SendProfileInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map((data) => {
                const userInfo = {
                    name: data.name,
                    preferences: data.preferences,
                    userCreatedAt: data.createdAt,
                    userUpdatedAt: data.updatedAt,
                };

                const rest = omit(data, [
                    'name',
                    'owner',
                    'preferences',
                    'createdAt',
                    'updatedAt',
                    'id',
                ]);

                return {
                    userInfo,
                    ...rest,
                };
            }),
        );
    }
}
