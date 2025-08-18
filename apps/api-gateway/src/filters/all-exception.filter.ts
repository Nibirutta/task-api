import {
    ArgumentsHost,
    Catch,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { RpcException } from '@nestjs/microservices';
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

        if (exception instanceof RpcException) {
            const rpcException: any = exception.getError();
            responseObject.statusCode = rpcException.error.status;
            responseObject.response = rpcException.error.response;
        } else if (exception instanceof HttpException) {
            responseObject.statusCode = exception.getStatus();
            responseObject.response = exception.getResponse();
        } else {
            responseObject.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            responseObject.response = {
                message: exception.message || 'Internal server error',
                error: exception.name || 'UnknownError',
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
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
