import { Request } from 'express';
import { IJwtData } from '../../../auth/strategies/jwt-strategy';

declare module 'express' {
  export interface Request {
    user?: IJwtData;
  }
}
