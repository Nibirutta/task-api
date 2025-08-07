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
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const responseObject: ResponseObject = {
      statusCode: 500,
      response: '',
    };

    if (exception instanceof RpcException) {
      const error: any = exception.getError();
      responseObject.statusCode = error.status;
      responseObject.response = error.response;
    } else if (exception instanceof HttpException) {
      responseObject.statusCode = exception.getStatus();
      responseObject.response = exception.getResponse();
    } else {
      responseObject.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      responseObject.response = 'Internal Server Error';
    }

    if (responseObject.statusCode >= 500) {
      super.catch(exception, host); // Perhaps I will build my own log
    }

    response.status(responseObject.statusCode).json(responseObject.response);
  }
}
