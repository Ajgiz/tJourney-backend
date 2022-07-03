/* eslint-disable @typescript-eslint/ban-types */
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ApiError } from '../error/custom-error';
import { TYPE_ERROR } from '../error/custom-error.interface';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    if (Array.isArray(value) || typeof value !== 'object') {
      throw new ApiError(
        400,
        { response: 'Validation failed' },
        TYPE_ERROR.BAD_REQUEST,
      );
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object, {
      forbidUnknownValues: true,
      whitelist: true,
    });
    const messages: { [key: string]: any } = errors.reduce((acc, err) => {
      acc[err.property] =
        Object.values(err.constraints).length === 1
          ? Object.values(err.constraints)[0]
          : Object.values(err.constraints);
      return acc;
    }, {});
    if (errors.length > 0) {
      throw new ApiError(400, messages, TYPE_ERROR.BAD_REQUEST);
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
