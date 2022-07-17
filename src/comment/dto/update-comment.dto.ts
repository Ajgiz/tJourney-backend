import { ObjectId } from 'mongodb';
import { IsString } from 'class-validator';
import { UpdateLikesDto } from 'src/post/dto/update-post.dto';

export class UpdateCommentDto {
  @IsString()
  text: string;
}
