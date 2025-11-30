import { PriceType } from '../models/types/price.type';

export class PriceUtils {

  static convertPriceToSettlementPriceType(buyPrice: number, sellPrice: number): PriceType {
    const profit = PriceUtils.calculateSellPrice(sellPrice, sellPrice);
    if (profit < 0) {
      return 'out';
    } else if (profit > 0) {
      return 'in';
    }
    return null;
  }

  static calculateSellPrice(buyPrice: number, sellPrice: number): number {
    return sellPrice - buyPrice;
  }
}