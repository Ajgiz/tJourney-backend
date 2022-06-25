import { ObjectId } from 'mongoose';
import { IsString, IsMongoId } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  text: string;

  @IsMongoId()
  user: ObjectId;

  @IsMongoId()
  post: ObjectId;
}
