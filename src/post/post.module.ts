import { CommentModule } from './../comment/comment.module';
import { UserModule } from './../user/user.module';
import { CommunityModule } from './../community/community.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PostService } from './service/post.service';
import { PostController } from './controller/post.controller';
import { PostModel, PostModelSchema } from './model/post.model';
import { JwtModule } from '@nestjs/jwt';
import { NAME_MODEL_ENUM } from 'src/mongoose.interface';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [
    MongooseModule.forFeature([
      { name: NAME_MODEL_ENUM.POST, schema: PostModelSchema },
    ]),
    CommunityModule,
    UserModule,
    CommentModule,
    JwtModule.register({}),
  ],
})
export class PostModule {}
