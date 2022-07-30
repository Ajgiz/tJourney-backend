import { IsMongoId, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';
export class AddOnlineUserDto {
  @IsString()
  socketId: string;
}
