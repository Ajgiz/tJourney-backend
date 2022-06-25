import { TYPE_ERROR } from 'src/error/custom-error.interface';
import { ApiError } from './../../error/custom-error';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../service/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ name: 'email', pass: 'password' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new ApiError(
        401,
        { response: 'not authorized' },
        TYPE_ERROR.UNAUTHORIZED,
      );
    }
    return user;
  }
}
