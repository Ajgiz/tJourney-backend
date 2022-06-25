import { Model } from 'mongoose';
import { UserEntity } from '../entity/user.entity';
import { UserModelDocument } from './user.model';

export interface IUserModel extends Model<UserModelDocument> {
  cleanDocuments(): Promise<UserEntity[]>;
}
