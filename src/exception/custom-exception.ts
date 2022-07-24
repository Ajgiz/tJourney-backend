import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { getTime } from '../common/time';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    console.log(exception);
    const responseClient = {
      enterData: request.body,
      statusCode: status,
      message: exception.response,
      timestamp: getTime(),
      path: request.url,
    };
    console.log(responseClient);
    response.status(status).send(responseClient);
  }
}
