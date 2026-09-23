import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '../base.schema';

@Schema()
export class Settlement extends BaseEntity {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: false })
  dateTo?: Date;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  linkUrl: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  priceType: string;
}

export const SettlementSchema = SchemaFactory.createForClass(Settlement);
