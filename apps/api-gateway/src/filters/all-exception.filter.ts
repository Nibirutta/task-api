import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

type ResponseObject = {
  statusCode: number;
  response: string | object;
};

type CustomErrorResponse = {
  response: {
    message: string;
    error: string;
    statusCode: number;
  };
  status: number;
  options: {};
  message: string;
  name: string;
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
      const rpcException = exception.getError() as CustomErrorResponse;
      responseObject.statusCode = rpcException.status;
      responseObject.response = rpcException.response;
    }

    console.log(exception);

    response.status(responseObject.statusCode).json(responseObject.response);

    super.catch(exception, host);
  }
}
