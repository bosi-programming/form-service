import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongoSchema } from 'mongoose';

export type FormTemplateDocument = HydratedDocument<FormTemplate>;

@Schema()
export class FormTemplate {
  @Prop()
  name: string;
  @Prop({ type: MongoSchema.Types.Map, of: MongoSchema.Types.String })
  validations: Record<string, string>;
}

export const FormTemplateSchema = SchemaFactory.createForClass(FormTemplate);
