import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FormTemplateDocument = HydratedDocument<FormTemplate>;

@Schema()
export class FormTemplate {
  @Prop()
  name: string;
  @Prop()
  validations: Record<string, string>;
}

export const FormTemplateSchema = SchemaFactory.createForClass(FormTemplate);
