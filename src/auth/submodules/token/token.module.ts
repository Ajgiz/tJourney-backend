import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './service/token.service';
import { TokenModel, TokenModelSchema } from './model/token.model';
import { NAME_MODEL_ENUM } from 'src/mongoose.interface';

@Module({
  controllers: [],
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      {
        name: NAME_MODEL_ENUM.TOKEN,
        schema: TokenModelSchema,
      },
    ]),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
