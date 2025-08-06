import { ArgumentsHost, Catch } from '@nestjs/common';
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
      console.log(exception.getError());
      responseObject.statusCode = error.status;
      responseObject.response = error.response;
    }

    response.status(responseObject.statusCode).json(responseObject.response);

    super.catch(exception, host);
  }
}
