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

  @Prop({ required: false })
  refreshPriceUrl?: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: false })
  currentPrice?: number;

  @Prop({ required: true })
  savingType: string;

  @Prop({ required: false })
  percent?: number;

  @Prop({ required: false })
  percentPeriod?: number;

  @Prop({ required: true })
  priceType: string;

  @Prop({ required: false })
  amount?: number;
}

export const SettlementSavingSchema = SchemaFactory.createForClass(SettlementSaving);
