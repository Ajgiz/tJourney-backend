import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

enum SORT_ENUM {
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
  @IsEnum(SORT_ENUM)
  views?: 1 | -1;

  @IsOptional()
  @IsString()
  tags?: string;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  take?: number;

  @IsBoolean()
  @IsEnum(SORT_ENUM)
  new?: 1 | -1;
}
