import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './service/token.service';
import { TokenModel, TokenModelSchema } from './model/token.model';

@Module({
  controllers: [],
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      {
        name: TokenModel.name,
        schema: TokenModelSchema,
      },
    ]),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
