import { Body, Controller, Delete, Get, HttpCode, HttpException, Logger, Param, Post, Put, Request, UsePipes, ValidationPipe } from "@nestjs/common";
import mongoose from "mongoose";
import { DoughnutChartModel } from "src/models/doughnut-chart.model";
import { SettlementSavingDto } from "src/models/dto/settlement-saving.dto";
import { ProfitLineChartModel } from "src/models/profit-line-chart.model";
import { SettlementSaving } from "src/models/schemas/settlement-saving.schema";
import { SummarizeSettlement } from "src/models/summarize-settlement.model";
import { SettlementSavingEnum } from "src/models/enums/settlement-saving.enum";
import { VerticalBarModel } from "src/models/vertical-bar.model";
import { SettlementSavingService } from "src/services/settlement-saving.service";
import { SettlementService } from "src/services/settlement.service";

@Controller('/api/settlement-saving')
export class SettlementSavingController {
  constructor(
    private readonly settlementSavingService: SettlementSavingService,
  ) {}

  @Post()
  @HttpCode(204)
  public createSettlementSaving(
    @Body() settlementSavingDto: SettlementSavingDto,
  ): Promise<SettlementSaving> {
    Logger.debug('Request to create new settlement-saving');
    return this.settlementSavingService.save(settlementSavingDto);
  }

  @Put(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe())
  public updateSettlementSaving(
    @Param('id') id?: string,
    @Body() settlementSavingDto?: SettlementSavingDto,
  ): Promise<SettlementSaving> {
    Logger.debug('Request to update settlement-saving: ', id);
    if (!id) {
      throw new HttpException('Id is required', 400);
    }
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new HttpException('Id is invalid', 400);
    }
    return this.settlementSavingService.update(id, settlementSavingDto);
  }

  @Put('/sell/:id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe())
  public sellSettlementSaving(
    @Param('id') id?: string,
    @Body() settlementSavingDto?: SettlementSavingDto,
  ): Promise<void> {
    Logger.debug('Request to sell settlement-saving: ', id);
    if (!id) {
      throw new HttpException('Id is required', 400);
    }
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      throw new HttpException('Id is invalid', 400);
    }
    return this.settlementSavingService.sell(id, settlementSavingDto);
  }

  @Put('/refresh-prices/gold-silver')
  @HttpCode(204)
  @UsePipes(new ValidationPipe())
  public refreshPrices(@Body() ids?: string[]): Promise<SettlementSaving[]> {
    Logger.debug('Request to refresh prices gold or silver: ', ids);
    if (!ids || ids.length === 0) {
      throw new HttpException('Ids is required', 400);
    }
    return this.settlementSavingService.refreshGoldAndSilverPrices(ids);
  }

  @Get('/:toDate')
  public getAllSettlementSavingToDate(
    @Param('toDate') toDate: string,
  ): Promise<SettlementSaving[]> {
    Logger.debug('Request get all settlement-saving till date: ' + toDate);
    return this.settlementSavingService.findAllToDate(toDate);
  }

  @Get('/summarize/:toDate')
  public getSummarizeSettlementsSavingToChart(
    @Param('toDate') toDate: string,
  ): Promise<DoughnutChartModel> {
    Logger.debug('Request to get all settlements-saving to: ' + toDate);
    return this.settlementSavingService.findSummarizeToChart(toDate);
  }

  @Get('/profit/bonds-and-deposit/:year')
  public getBondsAndDepositsWithProfit(
    @Param('year') year: string,
  ): Promise<ProfitLineChartModel> {
    Logger.debug('Request get all bonds and deposit with profit in: ' + year);
    return this.settlementSavingService.findBondsAndDepositsWithProfit(year);
  }

  @Get('/summarize-saving-type/chart/:savingType')
  public getSummarizePricesToChart(
    @Param('savingType') savingType: SettlementSavingEnum,
  ): Promise<VerticalBarModel> {
    Logger.debug('Request to get summarize' + savingType + ' prices to chart');
    return this.settlementSavingService.findSummarizePricesChartDataset(
      savingType
    );
  }

  @Get('/profit/saving-type/:savingType')
  public getProfitGoldPrices(
    @Param('savingType') savingType: SettlementSavingEnum,
  ): Promise<SummarizeSettlement[]> {
    Logger.debug('Request to get profit' + savingType + ' prices to chart');
    return this.settlementSavingService.findProfitPrices(savingType);
  }

  @Delete(':id')
  @HttpCode(204)
  public deleteSettlement(@Param('id') id: string): Promise<void> {
    Logger.debug('Request to delete settlement: ' + id);
    return this.settlementSavingService.deleteById(id);
  }
}