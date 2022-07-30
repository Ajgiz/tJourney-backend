import { ObjectId } from 'mongodb';
import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsMongoId } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {}

export class UpdateLikesDto {
  @IsMongoId()
  id: ObjectId;
}
