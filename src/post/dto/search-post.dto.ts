import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum SORT_POSTS_ENUM {
  DESC = 1,
  ASC = -1,
}
export class SearchPostDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsEnum(SORT_POSTS_ENUM)
  views?: 1 | -1;

  @IsOptional()
  @IsString()
  tags?: string;

  @IsNumber()
  limit: number;

  @IsNumber()
  skip: number;

  @IsBoolean()
  @IsEnum(SORT_POSTS_ENUM)
  new?: 1 | -1;
}
