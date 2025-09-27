import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type FormResponseDocument = mongoose.HydratedDocument<FormResponse>;

@Schema()
export class FormResponse {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' })
  owner: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'FormResponseTemplate' })
  formTemplate: string;
  @Prop({ type: mongoose.Schema.Types.Map, of: mongoose.Schema.Types.String })
  formAnswers: Record<string, string>;
}

export const FormResponseSchema = SchemaFactory.createForClass(FormResponse);
