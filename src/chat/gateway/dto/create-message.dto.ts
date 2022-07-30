import { IsMongoId, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

export class CreateMessageDto {
  @IsMongoId()
  to: ObjectId;

  @IsMongoId()
  chat: ObjectId;

  @IsString()
  body: string;
}
