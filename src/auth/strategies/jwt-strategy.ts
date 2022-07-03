import { MongoId } from './../../mongoose.interface';
import { TYPE_ERROR } from './../../error/custom-error.interface';
import { ApiError } from './../../error/custom-error';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { IPayloadJwt } from '../service/auth.interface';
import { UserService } from '../../user/service/user.service';
import { CONFIG_AUTH } from '../auth.config';

export interface IJwtData {
  _id: MongoId;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: CONFIG_AUTH.ACCESS_JWT_SECRET_KEY,
    });
  }

  async validate(payload: IPayloadJwt): Promise<IJwtData> {
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
