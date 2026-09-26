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
import { CurrentUser, JwtPayload } from "src/config/current-user.decorator";

@Controller('/api/settlement-saving')
export class SettlementSavingController {
  constructor(
    private readonly settlementSavingService: SettlementSavingService,
  ) {}

  @Post()
  @HttpCode(204)
  public createSettlementSaving(
    @Body() settlementSavingDto: SettlementSavingDto,
    @CurrentUser() user: JwtPayload
  ): Promise<SettlementSaving> {
    Logger.debug('Request to create new settlement-saving');
    settlementSavingDto.userId = user.sub;
    return this.settlementSavingService.save(settlementSavingDto);
  }

  @Put(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe())
  public updateSettlementSaving(
    @CurrentUser() user: JwtPayload,
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
    settlementSavingDto.userId = user.sub;
    return this.settlementSavingService.update(id, settlementSavingDto);
  }

  @Put('/sell/:id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe())
  public sellSettlementSaving(
    @CurrentUser() user: JwtPayload,
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
    return this.settlementSavingService.sell(id, settlementSavingDto, user.sub);
  }

  @Put('/refresh-prices/gold-silver')
  @HttpCode(204)
  @UsePipes(new ValidationPipe())
  public refreshPrices(@CurrentUser() user: JwtPayload, @Body() ids?: string[]): Promise<SettlementSaving[]> {
    Logger.debug('Request to refresh prices gold or silver: ', ids);
    if (!ids || ids.length === 0) {
      throw new HttpException('Ids is required', 400);
    }
    return this.settlementSavingService.refreshGoldAndSilverPrices(ids, user.sub);
  }

  @Get('/:toDate')
  public getAllSettlementSavingToDate(
    @CurrentUser() user: JwtPayload,
    @Param('toDate') toDate: string,
  ): Promise<SettlementSaving[]> {
    Logger.debug('Request get all settlement-saving till date: ' + toDate);
    return this.settlementSavingService.findAllToDate(toDate, user.sub);
  }

  @Get('/summarize/:toDate')
  public getSummarizeSettlementsSavingToChart(
    @CurrentUser() user: JwtPayload,
    @Param('toDate') toDate: string,
  ): Promise<DoughnutChartModel> {
    Logger.debug('Request to get all settlements-saving to: ' + toDate);
    return this.settlementSavingService.findSummarizeToChart(toDate, user.sub);
  }

  @Get('/profit/bonds-and-deposit/:year')
  public getBondsAndDepositsWithProfit(
    @CurrentUser() user: JwtPayload,
    @Param('year') year: string,
  ): Promise<ProfitLineChartModel> {
    Logger.debug('Request get all bonds and deposit with profit in: ' + year);
    return this.settlementSavingService.findBondsAndDepositsWithProfit(year, user.sub);
  }

  @Get('/summarize-saving-type/chart/:savingType')
  public getSummarizePricesToChart(
    @CurrentUser() user: JwtPayload,
    @Param('savingType') savingType: SettlementSavingEnum,
  ): Promise<VerticalBarModel> {
    Logger.debug('Request to get summarize' + savingType + ' prices to chart');
    return this.settlementSavingService.findSummarizePricesChartDataset(
      savingType,
      user.sub
    );
  }

  @Get('/profit/saving-type/:savingType')
  public getProfitGoldPrices(
    @CurrentUser() user: JwtPayload,
    @Param('savingType') savingType: SettlementSavingEnum,
  ): Promise<SummarizeSettlement[]> {
    Logger.debug('Request to get profit' + savingType + ' prices to chart');
    return this.settlementSavingService.findProfitPrices(savingType, user.sub);
  }

  @Delete(':id')
  @HttpCode(204)
  public deleteSettlement(@Param('id') id: string): Promise<void> {
    Logger.debug('Request to delete settlement: ' + id);
    return this.settlementSavingService.deleteById(id);
  }
}