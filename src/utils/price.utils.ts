import { PriceType } from '../models/types/price.type';

export class PriceUtils {
  static convertPriceToSettlementPriceType(
    buyPrice: number,
    sellPrice: number,
  ): PriceType {
    const profit = PriceUtils.calculateSellPrice(buyPrice, sellPrice);
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

  static calculateNotSellProfitPercentToLabelChart(
    buyPrice: number,
    currentPrice: number,
  ): string {
    const currentProfitPercent = Number(
      ((currentPrice * 100) / buyPrice) - 100,
    ).toFixed(2);
    return `${currentProfitPercent}%`;
  }

  static calculateProfitPercentToLabelChart(
    buyPrice: number,
    profit: number,
  ): string {
    return `${Number((profit * 100) / buyPrice).toFixed(2)}%`;
  }
}