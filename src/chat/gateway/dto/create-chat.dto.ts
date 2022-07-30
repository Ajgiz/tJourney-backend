import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';
export class CreateChatDto {
  @IsMongoId()
  id: ObjectId;
}
