import { IFindOneRefreshToken, IPayloadRefreshToken } from './token.interface';
import { MongoId } from './../../../../mongoose.interface';
import { TokenModel, TokenModelDocument } from './../model/token.model';
import { CONFIG_AUTH } from './../../../auth.config';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IPayloadJwt } from 'src/auth/service/auth.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenEntity } from '../entity/token.entity';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(TokenModel.name) private tokenModel: Model<TokenModelDocument>,
  ) {}
  async createTokens(dto: IPayloadJwt) {
    const accessToken = this.jwtService.sign(dto, {
      expiresIn: '60m',
      secret: CONFIG_AUTH.ACCESS_JWT_SECRET_KEY,
    });
    const refreshToken = this.jwtService.sign(
      { email: dto.email, id: dto.id },
      { expiresIn: '7d', secret: CONFIG_AUTH.REFRESH_JWT_SECRET_KEY },
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async deleteToken(token: string) {
    const deletedToken = await this.tokenModel.findOneAndRemove({
      refreshToken: token,
    });
    return new TokenEntity(deletedToken);
  }

  validateRefreshToken(token: string): null | IPayloadRefreshToken {
    try {
      const validateResult = this.jwtService.verify(token, {
        secret: CONFIG_AUTH.REFRESH_JWT_SECRET_KEY,
      });
      return validateResult;
    } catch (e) {
      return null;
    }
  }

  async createRefreshToken(token: string, id: MongoId) {
    let refreshToken = await this.findOne({ _id: id });
    if (refreshToken) {
      refreshToken = await this.tokenModel.findByIdAndUpdate(refreshToken._id, {
        refreshToken: token,
      });
    } else {
      refreshToken = await this.tokenModel.create({
        user: id,
        refreshToken: token,
      });
    }
    return new TokenEntity(refreshToken);
  }

  async findOne(dto: IFindOneRefreshToken) {
    return await this.tokenModel.findOne(dto);
  }
}
