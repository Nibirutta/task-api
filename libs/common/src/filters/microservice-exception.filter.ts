import {
    ArgumentsHost,
    Catch,
    HttpException,
    HttpStatus,
    RpcExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { InjectPinoLogger, Logger } from 'nestjs-pino';

@Catch()
export class MicroserviceExceptionFilter implements RpcExceptionFilter {
    constructor(@InjectPinoLogger() private readonly logger: Logger) {}

    catch(exception: any, host: ArgumentsHost): Observable<any> {
        if (exception instanceof HttpException) {
            this.logger.warn(
                { error: exception },
                'HTTP Exception successfully captured!',
            );

            return throwError(
                () =>
                    new RpcException({
                        status: exception.getStatus(),
                        message: exception.message,
                        error: exception.name,
                        response: exception.getResponse(),
                    }),
            );
        }

        this.logger.error(
            { error: exception },
            'Not treated exception was captured!',
        );

        return throwError(
            () =>
                new RpcException({
                    status:
                        exception.error.status ||
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    response: {
                        error: exception.error.error || 'Unknown Error',
                        message:
                            exception.error.message || 'Internal server error',
                        statusCode:
                            exception.error.status ||
                            HttpStatus.INTERNAL_SERVER_ERROR,
                    },
                }),
        );
    }
}
