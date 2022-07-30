import { UserModule } from './../user/user.module';
import { CommunityModel, CommunityModelSchema } from './model/community.model';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommunityService } from './service/community.service';
import { CommunityController } from './controller/community.controller';
import { NAME_MODEL_ENUM } from 'src/mongoose.interface';

@Module({
  controllers: [CommunityController],
  providers: [CommunityService],
  exports: [CommunityService],
  imports: [
    MongooseModule.forFeature([
      { name: NAME_MODEL_ENUM.COMMUNITY, schema: CommunityModelSchema },
    ]),
    UserModule,
  ],
})
export class CommunityModule {}
