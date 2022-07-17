import { ObjectId } from 'mongodb';
import { NAME_MODEL_ENUM } from 'src/mongoose.interface';
import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CommentModelDocument = Document & CommentModel;
@Schema({ collection: NAME_MODEL_ENUM.COMMENT, timestamps: true })
export class CommentModel {
  @Prop()
  text: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: NAME_MODEL_ENUM.USER })
  user: ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: NAME_MODEL_ENUM.POST,
    index: true,
  })
  post: ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: NAME_MODEL_ENUM.COMMENT,
  })
  parent: ObjectId;

  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: NAME_MODEL_ENUM.USER }],
  })
  likes: ObjectId[];

  @Prop({
    type: [{ type: mongoose.Types.ObjectId, ref: NAME_MODEL_ENUM.USER }],
  })
  dislikes: ObjectId[];

  createdAt: string;
  updatedAt: string;
}

export const CommentModelSchema = SchemaFactory.createForClass(CommentModel);
