import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { NAME_MODEL_ENUM } from 'src/mongoose.interface';
import { DataOutput } from '../dto/create-post.dto';

export type PostModelDocument = PostModel & Document;

@Schema({ collection: NAME_MODEL_ENUM.POST, timestamps: true })
export class PostModel {
  @Prop({ required: true })
  title: string;

  @Prop()
  body: DataOutput[];

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: NAME_MODEL_ENUM.COMMUNITY,
    default: null,
  })
  topic: ObjectId;

  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: NAME_MODEL_ENUM.USER }],
  })
  views: ObjectId[];

  @Prop({ type: mongoose.Types.ObjectId, ref: NAME_MODEL_ENUM.USER })
  author: ObjectId;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: NAME_MODEL_ENUM.USER }],
  })
  dislikes: ObjectId[];

  @Prop({
    type: [{ type: mongoose.Types.ObjectId }],
    ref: NAME_MODEL_ENUM.USER,
    default: [],
  })
  likes: ObjectId[];

  createdAt: string;
  updatedAt: string;
}

export const PostModelSchema = SchemaFactory.createForClass(PostModel);
