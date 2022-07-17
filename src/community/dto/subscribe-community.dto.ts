import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';

export class SubscribeCommunityDto {
  @IsMongoId()
  id: ObjectId;
}
