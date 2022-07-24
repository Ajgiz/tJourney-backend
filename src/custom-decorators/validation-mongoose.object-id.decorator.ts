import { ObjectId } from 'mongodb';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import mongoose from 'mongoose';
import { ApiError } from '../error/custom-error';
import { TYPE_ERROR } from '../error/custom-error.interface';
import { Request } from 'express';

export const IsObjectIdParam = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const id = request.params.id;
    if (!mongoose.isValidObjectId(id))
      throw new ApiError(
        400,
        ['id must be type ObjectId'],
        TYPE_ERROR.BAD_REQUEST,
      );
    return typeof id === 'string' ? new ObjectId(id) : id;
  },
);
