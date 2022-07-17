import { ObjectId } from 'mongodb';
import { IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';
import { MongoId } from 'src/mongoose.interface';

export class DataOutput {
  id: string;
  data: any[];
  type: string;
}

export class CreatePostDto {
  @IsString()
  title: string;

  @IsArray()
  body: DataOutput[];

  @IsOptional()
  @IsMongoId()
  topic?: ObjectId;
}
