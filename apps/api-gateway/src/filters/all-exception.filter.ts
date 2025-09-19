import {
    ArgumentsHost,
    Catch,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

type ResponseObject = {
    statusCode: number;
    response: string | object;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const responseObject: ResponseObject = {
            statusCode: 500,
            response: '',
        };

        console.log(exception);

        if (exception instanceof HttpException) {
            responseObject.statusCode = exception.getStatus();
            responseObject.response = exception.getResponse();
        } else {
            responseObject.statusCode =
                exception.error.status || HttpStatus.INTERNAL_SERVER_ERROR;
            responseObject.response = {
                message:
                    exception.error.response.message || 'Internal server error',
                error: exception.error.response.error || 'UnknownError',
                statusCode:
                    exception.error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            };
        }

        response
            .status(responseObject.statusCode)
            .json(responseObject.response);

        if (responseObject.statusCode >= 500) {
            super.catch(exception, host); // Perhaps I will build my own log
        }
    }
}
