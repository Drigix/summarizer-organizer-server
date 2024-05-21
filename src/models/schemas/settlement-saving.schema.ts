import * as mongoose from 'mongoose';

export const SettlementSavingSchema = new mongoose.Schema({
    date: Date,
    dateTo: Date,
    description: String,
    price: Number,
    savingType: String,
    percent: Number,
    percentPeriod: Number,
    priceType: String
  });
  