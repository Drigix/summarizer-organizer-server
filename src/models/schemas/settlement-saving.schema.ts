import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class SettlementSaving {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: false })
  dateTo?: Date;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  linkUrl?: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  savingType: string;

  @Prop({ required: false })
  percent?: number;

  @Prop({ required: false })
  percentPeriod?: number;

  @Prop({ required: true })
  priceType: string;
}

export const SettlementSavingSchema = SchemaFactory.createForClass(SettlementSaving);
