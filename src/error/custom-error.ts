import { HttpException } from '@nestjs/common';
import { TYPE_ERROR } from './custom-error.interface';

export class ApiError extends HttpException {
  constructor(code: number, message: string[], name: TYPE_ERROR) {
    super(message, code);
  }
}
