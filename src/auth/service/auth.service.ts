import { ObjectId } from 'mongodb';
import { TokenService } from './../submodules/token/service/token.service';
import { TYPE_ERROR } from './../../error/custom-error.interface';
import { ApiError } from './../../error/custom-error';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/service/user.service';
import * as bcrypt from 'bcrypt';
import { AuthLoginDto } from '../dto/login-auth.dto';
import { IPayloadJwt } from './auth.interface';
import { AuthRegisterDto } from '../dto/register-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  async validatePassword(password: string, originalPassword: string) {
    return await bcrypt.compare(originalPassword, password);
  }

  async extraditionResponse(data: IPayloadJwt) {
    const tokens = await this.tokenService.createTokens(data);
    const refreshToken = await this.tokenService.createRefreshToken(
      tokens.refreshToken,
      data.id,
    );

    return {
      refreshToken: refreshToken.refreshToken,
      accessToken: tokens.accessToken,
      fullName: data.fullName,
      email: data.email,
    };
  }

  async logout(id: ObjectId) {
    return await this.tokenService.deleteToken(id);
  }

  async login(data: AuthLoginDto) {
    const user = await this.userService.findOne({ email: data.email });
    if (!user) {
      throw new ApiError(401, ['user not found'], TYPE_ERROR.UNAUTHORIZED);
    }
    const isPasswordEqual = await this.validatePassword(
      user.password,
      data.password,
    );
    if (!isPasswordEqual)
      throw new ApiError(401, ['user not found'], TYPE_ERROR.UNAUTHORIZED);

    const payload: IPayloadJwt = {
      email: user.email,
      id: user._id,
      fullName: user.fullName,
    };

    return this.extraditionResponse(payload);
  }

  async refreshToken(token: string) {
    if (!token)
      throw new ApiError(401, ['not authorized'], TYPE_ERROR.UNAUTHORIZED);

    const isValidToken = this.tokenService.validateRefreshToken(token);
    if (!isValidToken)
      throw new ApiError(401, ['not authorized'], TYPE_ERROR.UNAUTHORIZED);
    const user = await this.userService.findById(isValidToken.id);
    if (!user)
      throw new ApiError(401, ['usernot exist'], TYPE_ERROR.UNAUTHORIZED);
    return await this.extraditionResponse({
      email: user.email,
      fullName: user.fullName,
      id: user._id,
    });
  }

  async register(data: AuthRegisterDto) {
    const isEmailExist = await this.userService.findOne({ email: data.email });
    if (isEmailExist) {
      throw new ApiError(
        400,
        ['Пользователь с такой почтой уже есть'],
        TYPE_ERROR.BAD_REQUEST,
      );
    }
    const isFullNameExist = await this.userService.findOne({
      fullName: data.fullName,
    });
    if (isFullNameExist) {
      throw new ApiError(
        400,
        ['Пользователь с таким именем уже есть'],
        TYPE_ERROR.BAD_REQUEST,
      );
    }
    const salt = data.password ? await bcrypt.genSalt(5) : 0;
    const hash = data.password ? await bcrypt.hash(data.password, salt) : null;

    const newUser = await this.userService.create({
      //контролируем какие данные надо для создания пользователя
      email: data.email,
      fullName: data.fullName,
      password: hash,
    });

    const payload: IPayloadJwt = {
      email: newUser.email,
      id: newUser._id,
      fullName: newUser.fullName,
    };

    return this.extraditionResponse(payload);
  }
}
