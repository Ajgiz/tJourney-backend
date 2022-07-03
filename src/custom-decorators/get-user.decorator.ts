import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtData } from 'src/auth/strategies/jwt-strategy';

export const GetUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().user;
  },
);
