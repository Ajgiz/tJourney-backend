import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { NAME_MODEL_ENUM } from 'src/mongoose.interface';
import { ObjectId } from 'mongodb';
import { IRatingStatistics } from './user.interface';

export type UserModelDocument = UserModel & Document;
@Schema({ collection: NAME_MODEL_ENUM.USER })
export class UserModel {
  @Prop({ required: true, unique: true })
  fullName: string;

  @Prop({ default: null })
  password?: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ default: '' })
  cover: string;

  @Prop({ default: '' })
  avatar: string;

  @Prop({ default: '' })
  description: string;

  @Prop({
    default: { allTime: 0, month: 0, threeMonth: 0 },
    type: {
      allTime: Number,
      month: Number,
      threeMonth: Number,
      _id: false,
    },
  })
  rating: IRatingStatistics;

  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: NAME_MODEL_ENUM.USER }],
  })
  subscribers: ObjectId[];

  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: NAME_MODEL_ENUM.USER }],
  })
  subscriptionBlogs: ObjectId[];

  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: NAME_MODEL_ENUM.COMMUNITY }],
  })
  subscriptionCommunities: ObjectId[];
}
export const UserModelSchema = SchemaFactory.createForClass(UserModel);
