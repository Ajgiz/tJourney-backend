import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserModelDocument = UserModel & Document;
@Schema({ collection: 'users' })
export class UserModel {
  @Prop({ required: true, unique: true })
  fullName: string;

  @Prop({ default: null })
  password?: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ default: './path/random' })
  avatar: string;
}
export const UserModelSchema = SchemaFactory.createForClass(UserModel);
