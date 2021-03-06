import { IJwtData } from './../strategies/jwt-strategy';
import { CustomValidationPipe } from '../../validation-pipe/custom-validation-pipe';
import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  UseFilters,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthLoginDto } from '../dto/login-auth.dto';
import { CustomExceptionFilter } from '../../exception/custom-exception';
import { Request, Response } from 'express';
import { AuthRegisterDto } from '../dto/register-auth.dto';
import { JwtAuthGuard } from '../guards/jwt-guards';
import { ApiError } from 'src/error/custom-error';
import { TYPE_ERROR } from 'src/error/custom-error.interface';
import { GetUser } from 'src/custom-decorators/get-user.decorator';

@UseFilters(CustomExceptionFilter)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(CustomValidationPipe)
  @Post('login')
  async login(@Body() data: AuthLoginDto) {
    return await this.authService.login(data);
  }

  @UsePipes(CustomValidationPipe)
  @Post('register')
  async register(@Body() data: AuthRegisterDto) {
    return await this.authService.register(data);
  }

  @Get('refresh')
  async refresh(@Req() req: Request) {
    if (req.cookies?.refreshToken) {
      const { refreshToken } = req.cookies;
      return await this.authService.refreshToken(refreshToken);
    } else throw new ApiError(401, ['not authorized'], TYPE_ERROR.UNAUTHORIZED);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@GetUser() user: IJwtData) {
    // cookies не работает, почему то cookie с клиента и с сервера разные
    const token = await this.authService.logout(user._id);
    return token;
  }
}
