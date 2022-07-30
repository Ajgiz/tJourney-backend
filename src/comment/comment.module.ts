import { CommunityModule } from './../community/community.module';
import { UserModule } from './../user/user.module';
import {
  CommentModel,
  CommentModelSchema,
} from '../comment/model/comment.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { CommentService } from './service/comment.service';
import { CommentController } from './controller/comment.controller';
import { NAME_MODEL_ENUM } from 'src/mongoose.interface';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports: [
    MongooseModule.forFeature([
      { name: NAME_MODEL_ENUM.COMMENT, schema: CommentModelSchema },
    ]),
    UserModule,
    CommunityModule,
  ],
  exports: [CommentService],
})
export class CommentModule {}
