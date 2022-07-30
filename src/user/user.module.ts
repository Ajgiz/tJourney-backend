import { UserModel, UserModelSchema } from './model/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { RatingScheduleModule } from 'src/rating-schedule/rating-schedule.module';
import { NAME_MODEL_ENUM } from 'src/mongoose.interface';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([
      { name: NAME_MODEL_ENUM.USER, schema: UserModelSchema },
    ]),
    RatingScheduleModule,
  ],
  exports: [UserService],
})
export class UserModule {}
