import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from "@nestjs/common";
import { StockCompanyDto } from "src/models/dto/stock-company.dto";
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
    return (await this.stockCompanyService.getAllStockCompanies()).map((company) => new StockCompanyDto().fromEntity(company));
  }

  @Post('/stock-company')
  @HttpCode(204)
  public async createStockCompany(@Body() stockCompanyDto: StockCompanyDto): Promise<StockCompanyDto> {
    return  new StockCompanyDto().fromEntity(await this.stockCompanyService.createStockCompany(stockCompanyDto));
  }

  @Put('/stock-company')
  @HttpCode(204)
  public async updateStockCompany(@Body() stockCompanyDto: StockCompanyDto): Promise<StockCompanyDto> {
    return new StockCompanyDto().fromEntity(await this.stockCompanyService.updateStockCompany(stockCompanyDto));
  }

  @Delete('/stock-company/:symbol')
  @HttpCode(204)
  public async deleteStockCompany(@Param('symbol') symbol: string): Promise<void> {
    return this.stockCompanyService.deleteStockCompany(symbol);
  }

  @Get('/stock-price/:symbol')
  public async getStockPrice(@Param('symbol') symbol: string): Promise<StockPrice> {
    return this.marketDataService.getPrice(symbol);
  }

  @Put('/stock-price/:symbol')
  public async updateStockCompanyPrice(@Param('symbol') symbol: string): Promise<StockCompanyDto> {
    const stockPrice = await this.marketDataService.getPrice(symbol);
    return new StockCompanyDto().fromEntity(await this.stockCompanyService.updateStockPrice(stockPrice));
  }
}