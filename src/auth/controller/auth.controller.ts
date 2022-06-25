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
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthLoginDto } from '../dto/login-auth.dto';
import { CustomExceptionFilter } from 'src/exception/custom-exception';
import { LocalStrategy } from '../strategies/local.strategy';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
@UseFilters(CustomExceptionFilter)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @UsePipes(CustomValidationPipe)
  login(@Req() req: Request) {
    return req;
  }
}
