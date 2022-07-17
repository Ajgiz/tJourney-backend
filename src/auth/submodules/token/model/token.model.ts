import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NAME_MODEL_ENUM } from 'src/mongoose.interface';

export type TokenModelDocument = Document & TokenModel;
@Schema({ collection: NAME_MODEL_ENUM.TOKEN })
export class TokenModel {
  @Prop()
  refreshToken: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: NAME_MODEL_ENUM.USER })
  user: ObjectId;
}

export const TokenModelSchema = SchemaFactory.createForClass(TokenModel);
