import { IProfileData } from '@app/common';
import {
    NestInterceptor,
    Injectable,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { omit } from 'lodash';

@Injectable()
export class SendUserInfoInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map((data) => {
                if (data.profileData) {
                    const profileData: IProfileData = data.profileData;

                    const userInfo = {
                        firstName: profileData.firstName,
                        preferences: profileData.preferences,
                        userCreatedAt: profileData.createdAt,
                        userUpdatedAt: profileData.updatedAt,
                    };

                    const rest = omit(data, ['profileData']);

                    return {
                        userInfo,
                        ...rest,
                    };
                }

                return data;
            }),
        );
    }
}
