import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt-strategy';
import { TokenModule } from './submodules/token/token.module';
@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [UserModule, PassportModule, TokenModule],
})
export class AuthModule {}
