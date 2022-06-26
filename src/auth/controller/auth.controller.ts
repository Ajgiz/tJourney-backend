import { CustomValidationPipe } from 'src/validation-pipe/custom-validation-pipe';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  UseFilters,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthLoginDto } from '../dto/login-auth.dto';
import { CustomExceptionFilter } from 'src/exception/custom-exception';
import { Request, Response } from 'express';
import { AuthRegisterDto } from '../dto/register-auth.dto';
import { JwtAuthGuard } from '../guards/jwt-guards';

@UseFilters(CustomExceptionFilter)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(CustomValidationPipe)
  @Post('login')
  async login(
    @Body() data: AuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userData = await this.authService.login(data);
    const { refreshToken, ...response } = userData;
    res.cookie('refreshToken', refreshToken);
    return response;
  }

  @UsePipes(CustomValidationPipe)
  @Post('register')
  async register(
    @Body() data: AuthRegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userData = await this.authService.register(data);
    const { refreshToken, ...response } = userData;
    res.cookie('refreshToken', refreshToken);
    return response;
  }

  @Post('refresh')
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const { refreshToken } = req.cookies;
    const userData = await this.authService.refreshToken(refreshToken);
    const { refreshToken: token, ...response } = userData;
    res.cookie('refreshToken', token);
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const { refreshToken } = req.cookies;
    const token = await this.authService.logout(refreshToken);
    res.clearCookie('refreshToken');
    return token;
  }
}
