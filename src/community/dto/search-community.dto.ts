import {
  IsBoolean,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
export class SearchCommunityDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumberString()
  skip: number;

  @IsNumberString()
  limit: number;

  @IsOptional()
  @IsString()
  email?: string;
}
