import { Document } from 'mongoose';

export interface Settlement extends Document {
    readonly date: Date,
    readonly description: string,
    readonly price: number,
    readonly priceType: string
}
