import { IsOptional, IsString } from 'class-validator';

export class CreateCommunityDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  cover?: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}
