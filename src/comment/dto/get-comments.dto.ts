import { ObjectId } from 'mongodb';
import {
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

enum SORT_COMMENTS_ENUM {
  LAST = 'new',
  POPULAR = 'popular',
}
type SortCommetsType = 'new' | 'popular';

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

  @IsString()
  exclude: string;

  @IsEnum(SORT_COMMENTS_ENUM)
  sort: SortCommetsType;
}
