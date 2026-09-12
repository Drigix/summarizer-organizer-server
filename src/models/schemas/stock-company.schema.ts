import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class StockCompany {

    @Prop({ required: true })
    stockSymbol: string;

    @Prop({ required: true })
    companyName: string;

    // @Prop({ required: false })
    // icon?: string;

    @Prop({ required: true })
    currentPrice: number;

    @Prop({ required: true })
    currency: string;

    @Prop({ required: true })
    updatedAt: Date;
}

export const StockCompanySchema = SchemaFactory.createForClass(StockCompany);