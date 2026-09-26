import { Body, Controller, Delete, Get, HttpCode, Logger, Param, Post, Put } from "@nestjs/common";
import { CurrentUser, JwtPayload } from "src/config/current-user.decorator";
import { StockCompanyDto } from "src/models/dto/stock-company.dto";
import { StockPrice } from "src/models/stock-market/stock-price.model";
import { MarketDataService } from "src/services/market-data.service";
import { SettlementSavingService } from "src/services/settlement-saving.service";
import { StockCompanyService } from "src/services/stock-company.service";

@Controller('/api/market-data')
export class MarketDataController {
public constructor(
    private readonly marketDataService: MarketDataService,
    private readonly stockCompanyService: StockCompanyService,
    private readonly settlementSavingService: SettlementSavingService
  ) {}

  @Get('/stock-company/all')
  public async getAllStockCompanies(@CurrentUser() user: JwtPayload): Promise<StockCompanyDto[]> {
    return (await this.stockCompanyService.getAllStockCompanies(user.sub)).map((company) => new StockCompanyDto().fromEntity(company));
  }

  @Post('/stock-company')
  @HttpCode(204)
  public async createStockCompany(@Body() stockCompanyDto: StockCompanyDto, @CurrentUser() user: JwtPayload): Promise<StockCompanyDto> {
    stockCompanyDto.userId = user.sub;
    return  new StockCompanyDto().fromEntity(await this.stockCompanyService.createStockCompany(stockCompanyDto));
  }

  @Put('/stock-company')
  @HttpCode(204)
  public async updateStockCompany(@Body() stockCompanyDto: StockCompanyDto, @CurrentUser() user: JwtPayload): Promise<StockCompanyDto> {
    stockCompanyDto.userId = user.sub;
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
  public async updateStockCompanyPrice(
    @CurrentUser() user: JwtPayload,
    @Param('symbol') symbol: string
  ): Promise<StockCompanyDto> {
    const stockPrice = await this.marketDataService.getPrice(symbol);
    const updatedStockCompany = await this.stockCompanyService.updateStockPrice(stockPrice);
    await this.settlementSavingService.updatePricesInSettlementSavingByStockSymbol(user.sub, updatedStockCompany);
    return new StockCompanyDto().fromEntity(updatedStockCompany);
  }
}