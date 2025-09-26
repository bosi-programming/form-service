import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OwnerDocument = HydratedDocument<Owner>;

@Schema()
export class Owner {
  @Prop()
  responderToken: string;
  @Prop()
  name: string;
  @Prop()
  password: string;
}

export const OwnerSchema = SchemaFactory.createForClass(Owner);
