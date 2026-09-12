import { Controller, Get, Param, Put } from "@nestjs/common";
import { StockCompanyDto } from "src/models/dto/stock-company.dto";
import { StockCompany } from "src/models/schemas/stock-company.schema";
import { StockPrice } from "src/models/stock-market/stock-price.model";
import { MarketDataService } from "src/services/market-data.service";
import { StockCompanyService } from "src/services/stock-company.service";

@Controller('/api/market-data')
export class MarketDataController {
public constructor(
    private readonly marketDataService: MarketDataService,
    private readonly stockCompanyService: StockCompanyService
  ) {}

  @Get('/stock-company/all')
  public async getAllStockCompanies(): Promise<StockCompanyDto[]> {
    return this.stockCompanyService.getAllStockCompanies();
  }

  @Get('/stock-price/:symbol')
  public async getStockPrice(@Param('symbol') symbol: string): Promise<StockPrice> {
    return this.marketDataService.getPrice(symbol);
  }

  @Put('/stock-price/:symbol')
  public async updateStockCompanyPrice(@Param('symbol') symbol: string): Promise<StockCompanyDto> {
    const stockPrice = await this.marketDataService.getPrice(symbol);
    return this.stockCompanyService.updateStockPrice(stockPrice);
  }
}