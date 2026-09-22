import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  enabled: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
