import { ConfigService } from '@nestjs/config';
import { TYPE_ERROR } from './../../error/custom-error.interface';
import { ApiError } from './../../error/custom-error';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { IPayloadJwt } from '../service/auth.interface';
import { UserService } from 'src/user/service/user.service';
import { configAuth } from '../auth.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configAuth.ACCESS_JWT_SECRET_KEY,
    });
  }

  async validate(payload: IPayloadJwt) {
    const user = await this.userService.findById(payload.id);
    if (!user)
      throw new ApiError(
        401,
        { response: 'user not exist' },
        TYPE_ERROR.UNAUTHORIZED,
      );

    return {
      _id: user._id,
      email: user.email,
    };
  }
}
