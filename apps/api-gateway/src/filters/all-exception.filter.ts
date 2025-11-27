import {
    ArgumentsHost,
    Catch,
    HttpException,
    HttpStatus,
    ExceptionFilter,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(
        @InjectPinoLogger() private readonly logger: PinoLogger,
        private readonly httpAdapterHost: HttpAdapterHost,
    ) {}

    catch(exception: any, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();

        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : exception.error.status || HttpStatus.INTERNAL_SERVER_ERROR;

        const responseBody = {
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            message:
                exception instanceof HttpException
                    ? exception.message
                    : exception.error.response.message ||
                      'An unpredictable error happened',
            error:
                exception instanceof HttpException
                    ? exception.name
                    : exception.error.response.error || 'Internal Server Error',
        };

        if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(
                { error: exception },
                'Not treated exception was captured!',
            );
        } else {
            this.logger.warn(
                { error: exception },
                'HTTP Exception successfully captured!',
            );
        }

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}
