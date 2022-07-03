import { IsString, IsMongoId } from 'class-validator';
import { MongoId } from '../../mongoose.interface';

export class CreateCommentDto {
  @IsString()
  text: string;

  @IsMongoId()
  user: MongoId;

  @IsMongoId()
  post: MongoId;
}
