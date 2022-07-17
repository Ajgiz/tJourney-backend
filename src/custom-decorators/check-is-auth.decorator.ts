import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CheckIsAuth = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const auth = request.headers.authorization;
    return auth ? auth.split(' ')[1] : null;
  },
);
