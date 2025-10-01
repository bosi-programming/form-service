import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongoSchema } from 'mongoose';
import * as mongoose from 'mongoose';

export type FormTemplateDocument = HydratedDocument<FormTemplate>;

@Schema()
export class FormTemplate {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' })
  owner: string;
  @Prop()
  name: string;
  @Prop({ type: MongoSchema.Types.Map, of: MongoSchema.Types.String })
  validations: Map<string, string>;
}

export const FormTemplateSchema = SchemaFactory.createForClass(FormTemplate);
