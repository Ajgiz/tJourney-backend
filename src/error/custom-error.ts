import { HttpException } from '@nestjs/common';
import { IErrorMessage, TYPE_ERROR } from './custom-error.interface';

export class ApiError extends HttpException {
  constructor(code: number, message: IErrorMessage, name: TYPE_ERROR) {
    super(message, code);
  }
}
