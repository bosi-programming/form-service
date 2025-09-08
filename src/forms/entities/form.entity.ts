import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type FormDocument = mongoose.HydratedDocument<Form>;

@Schema()
export class Form {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'FormTemplate' })
  formTemplate: mongoose.Types.ObjectId;
  @Prop()
  formAnswers: Record<string, string>;
}

export const FormSchema = SchemaFactory.createForClass(Form);
