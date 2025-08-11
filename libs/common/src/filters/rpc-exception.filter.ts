import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { MongoError } from 'mongodb';

@Catch()
export class RcpExceptionFilter extends BaseRpcExceptionFilter {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    if (exception instanceof HttpException) {
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

    if (exception instanceof MongoError) {
      return throwError(
        () =>
          new RpcException({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            response: {
              error: exception.name,
              message: 'MongoServer operation failed',
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            },
          }),
      );
    }

    return throwError(
      () =>
        new RpcException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          response: {
            error: exception.name || 'UnknownError',
            message: exception.message || 'Internal server error',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          },
        }),
    );
  }
}
