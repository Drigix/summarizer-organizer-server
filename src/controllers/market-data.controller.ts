import { Controller, Get, Param } from "@nestjs/common";
import { StockPrice } from "src/models/stock-market/stock-price.model";
import { MarketDataService } from "src/services/market-data.service";

@Controller('/api/market-data')
export class MarketDataController {
public constructor(
    private readonly marketDataService: MarketDataService
  ) {}

  @Get('/stock-price/:symbol')
  public async getStockPrice(@Param('symbol') symbol: string): Promise<StockPrice> {
    return this.marketDataService.getPrice(symbol);
  }
}