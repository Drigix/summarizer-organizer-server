import { Document } from 'mongoose';

export interface SettlementSaving extends Document {
    readonly date: Date,
    readonly dateTo: Date,
    readonly description: string,
    readonly price: number,
    readonly savingType: String,
    readonly percent: Number,
    readonly percentPeriod: Number,
    readonly priceType: string
}