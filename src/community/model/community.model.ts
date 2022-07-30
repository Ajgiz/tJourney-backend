import { ObjectId } from 'mongodb';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { NAME_MODEL_ENUM } from 'src/mongoose.interface';
import { IRatingStatistics } from 'src/user/model/user.interface';

export type CommunityModelDocument = Document & CommunityModel;

@Schema({ collection: NAME_MODEL_ENUM.COMMUNITY })
export class CommunityModel {
  @Prop({ unique: true, required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: '' })
  cover?: string;

  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: NAME_MODEL_ENUM.USER }],
  })
  subscribers: ObjectId[];

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

  @Prop({ default: '' })
  avatar?: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: NAME_MODEL_ENUM.USER })
  author: ObjectId;
}

export const CommunityModelSchema =
  SchemaFactory.createForClass(CommunityModel);
