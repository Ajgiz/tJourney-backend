import { IsArray, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString({ each: true })
  @IsArray()
  body: string[];

  @IsString({ each: true })
  @IsArray()
  tags: string[];
}
