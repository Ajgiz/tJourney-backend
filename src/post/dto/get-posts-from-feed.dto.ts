import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { SORT_POSTS_ENUM } from './search-post.dto';

export class GetPostsFromFeedDto {
  @IsEnum(SORT_POSTS_ENUM)
  @IsOptional()
  new?: 1 | -1;

  @IsEnum(SORT_POSTS_ENUM)
  @IsOptional()
  popular?: -1 | 1;

  @IsNumber()
  limit: number;

  @IsNumber()
  skip: number;
}
