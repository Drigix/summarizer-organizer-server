import { Controller, Get, Logger, Param } from '@nestjs/common';
import { SettlementSavingEnum } from '../models/enums/settlement-saving.enum';
import { VerticalBarModel } from '../models/vertical-bar.model';
import { SoldInvestmentService } from '../services/sold-investment.service';

@Controller('/api/sold-investment')
export class SoldInvestmentController {
  public constructor(
    private readonly soldInvestmentService: SoldInvestmentService,
  ) {}

  @Get('/summarize-sold-investment/chart/:savingType')
  public getSummarizeSoldInvestmentToChart(@Param('savingType') savingType: SettlementSavingEnum): Promise<VerticalBarModel> {
    Logger.debug('Request to get summarize' + savingType + ' profit to chart');
    return this.soldInvestmentService.findSummarizeSoldInvestmentChartDataset(savingType);
  }
}