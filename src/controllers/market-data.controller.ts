import { Body, Controller, Delete, Get, HttpCode, Logger, Param, Post, Put } from "@nestjs/common";
import { CurrentUser, JwtPayload } from "src/config/current-user.decorator";
import { StockCompanyDto } from "src/models/dto/stock-company.dto";
import { StockPrice } from "src/models/stock-market/stock-price.model";
import { MarketDataService } from "src/services/market-data.service";
import { SettlementSavingService } from "src/services/settlement-saving.service";
import { StockCompanyService } from "src/services/stock-company.service";
import { StockSymbolUtils } from "src/utils/stock-symbol.util";

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
    let updatedStockCompany = await this.stockCompanyService.updateStockCompany(stockCompanyDto);
    if (stockCompanyDto.updateSettlementSaving) {
      await this.settlementSavingService.updatePricesInSettlementSavingByStockSymbol(user.sub, updatedStockCompany);
    }
    return new StockCompanyDto().fromEntity(updatedStockCompany);
  }

  @Delete('/stock-company/:symbol')
  @HttpCode(204)
  public async deleteStockCompany(@Param('symbol') symbol: string): Promise<void> {
    await this.settlementSavingService.deleteStockSymbolInSavingSettlement(symbol);
    return this.stockCompanyService.deleteStockCompany(symbol);
  }

  @Get('/stock-price/:symbol')
  public async getStockPrice(@Param('symbol') symbol: string): Promise<StockPrice> {
    return this.marketDataService.getPrice(symbol, StockSymbolUtils.isStockSymbolForYahooFinance(symbol));
  }

  @Put('/stock-price/:symbol')
  public async updateStockCompanyPrice(
    @CurrentUser() user: JwtPayload,
    @Param('symbol') symbol: string
  ): Promise<StockCompanyDto> {
    return await this.processStockPrice(symbol, user);
  }

  @Put('/stock-prices/all')
  public async updateAllStockCompanyPrice(
    @CurrentUser() user: JwtPayload
  ): Promise<StockCompanyDto[]> {
    const savingSettlementsWithStockSymbol = await this.settlementSavingService.findAllWithStockSymbol(user.sub);
    const updatedStockCompanies: StockCompanyDto[] = [];
    for (const savingSettlement of savingSettlementsWithStockSymbol) {
      const updatedStockCompany = await this.processStockPrice(savingSettlement.stockSymbol, user);
      updatedStockCompanies.push(updatedStockCompany);
    }
    return updatedStockCompanies;
  }

  private async processStockPrice(symbol: string, user: JwtPayload): Promise<StockCompanyDto> {
    const stockPrice = await this.marketDataService.getPrice(symbol, StockSymbolUtils.isStockSymbolForYahooFinance(symbol));
    const updatedStockCompany = await this.stockCompanyService.updateStockPrice(stockPrice);
    await this.settlementSavingService.updatePricesInSettlementSavingByStockSymbol(user.sub, updatedStockCompany);
    return new StockCompanyDto().fromEntity(updatedStockCompany);
  }
}