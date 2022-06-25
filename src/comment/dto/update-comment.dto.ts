import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';
import { CreateCommentDto } from './create-comment.dto';

export class UpdateCommentDto {
  @IsString()
  text: string;
}
