import {
  CommentModel,
  CommentModelSchema,
} from '../comment/model/comment.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { CommentService } from './service/comment.service';
import { CommentController } from './controller/comment.controller';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports: [
    MongooseModule.forFeature([
      { name: CommentModel.name, schema: CommentModelSchema },
    ]),
  ],
})
export class CommentModule {}
