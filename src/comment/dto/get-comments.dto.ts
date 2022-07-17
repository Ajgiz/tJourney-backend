import { ObjectId } from 'mongodb';
import {
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetCommentsDto {
  @IsMongoId()
  post: ObjectId;

  @IsMongoId()
  @IsOptional()
  parent: ObjectId | undefined;

  @IsNumber()
  limit: number;

  @IsNumber()
  skip: number;
}
