import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Settlement {
  @Prop({ required: true })
  date: Date;

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
