import * as mongoose from 'mongoose';
import * as autoIncrement from 'mongoose-id-autoincrement';

export const SettlementSchema = new mongoose.Schema({
  date: Date,
  description: String,
  price: Number,
  priceType: String
});

// export function initSettlementSchemaIncrement() {

//   mongoose.plugin(autoIncrement.plugin, {
//     model: 'Settlement',
//     field: 'settlementId',
//     startAt: 26,
//     incrementBy: 1
//   });
  
//   SettlementSchema.plugin(autoIncrement.plugin, {
//     model: 'Settlement',
//     field: 'settlementId',
//     startAt: 26,
//     incrementBy: 1
//   });
// }
