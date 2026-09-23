import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '../base.schema';

@Schema()
export class User extends BaseEntity {

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  enabled: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
