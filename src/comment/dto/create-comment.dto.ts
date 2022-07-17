import { ObjectId } from 'mongodb';
import { IsString, IsMongoId, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  text: string;

  @IsMongoId()
  post: ObjectId;

  @IsMongoId()
  @IsOptional()
  parent: ObjectId;
}
