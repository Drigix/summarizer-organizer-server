import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '../base.schema';

@Schema()
export class SoldInvestment extends BaseEntity {
  @Prop({ required: true })
  sellDate: Date;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: false })
  dateTo?: Date;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  linkUrl?: string;

  @Prop({ required: true })
  buyPrice: number;

  @Prop({ required: true })
  sellPrice: number;

  @Prop({ required: true })
  profit: number

  @Prop({ required: true })
  savingType: string;

  @Prop({ required: false })
  amount?: number;
}

export const SoldInvestmentSchema = SchemaFactory.createForClass(SoldInvestment);