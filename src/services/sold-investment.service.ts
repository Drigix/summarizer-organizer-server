import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SoldInvestment } from '../models/schemas/sold-investment.schema';
import { SettlementSavingDto } from '../models/dto/settlement-saving.dto';
import { PriceUtils } from '../utils/price.utils';
import { SettlementSavingEnum } from '../models/enums/settlement-saving.enum';
import {
  VerticalBarDataModel,
  VerticalBarModel,
} from '../models/vertical-bar.model';
import { ChartColorEnum } from '../models/enums/chart-color.enum';
import { TranslationLabelUtils } from '../utils/translation-label.utils';

@Injectable()
export class SoldInvestmentService {

  constructor(
    @InjectModel(SoldInvestment.name) private soldInvestmentModel: Model<SoldInvestment>
  ) {}

  async saveFromSettlementSaving(settlementSavingDto: SettlementSavingDto): Promise<SoldInvestment> {
    const soldInvestment = this.convertSavingSettlementToSoldInvestment(settlementSavingDto);
    return this.soldInvestmentModel.create(soldInvestment);
  }

  async findSummarizeSoldInvestmentChartDataset(savingType: SettlementSavingEnum, year: number): Promise<VerticalBarModel> {
    const yearNotEmpty = year ?? new Date().getFullYear();
    const soldInvestments = await this.soldInvestmentModel.aggregate([
      {
        $match: {
          savingType: { $in: ['stock'] },
          $expr: { $eq: [{ $year: '$sellDate' }, Number(yearNotEmpty)] },
        },
      },
    ]);
    const purchasesPricesToChart = soldInvestments.map(s => s.buyPrice * (s?.amount ?? 1));
    const currentPricesToChart = soldInvestments.map(s => s.sellPrice * (s?.amount ?? 1));
    const profitToChart = soldInvestments.map(s => s.profit * (s?.amount ?? 1));
    const verticalBarModel = new VerticalBarModel(
      soldInvestments.map((s) => s.description),
      [
        new VerticalBarDataModel(
          TranslationLabelUtils.SETTLEMENT_BUY_PRICE_LABEL,
          ChartColorEnum.BUY_PRICE_BLUE,
          ChartColorEnum.BUY_PRICE_BLUE,
          purchasesPricesToChart,
        ),
        new VerticalBarDataModel(
          TranslationLabelUtils.SETTLEMENT_SELL_PRICE_LABEL,
          ChartColorEnum.SELL_PRICE,
          ChartColorEnum.SELL_PRICE,
          currentPricesToChart,
        ),
        new VerticalBarDataModel(
          TranslationLabelUtils.SETTLEMENT_PROFIT_LABEL,
          ChartColorEnum.PROFIT_PRICE,
          ChartColorEnum.PROFIT_PRICE,
          profitToChart,
        ),
      ],
    );
    return verticalBarModel;
  }

  private convertSavingSettlementToSoldInvestment(settlementSavingDto: SettlementSavingDto): SoldInvestment {
    const soldInvestment = new SoldInvestment();
    soldInvestment.sellDate = settlementSavingDto.sellDate;
    soldInvestment.date = settlementSavingDto.date;
    soldInvestment.dateTo = settlementSavingDto.dateTo;
    soldInvestment.amount = settlementSavingDto.amount;
    soldInvestment.buyPrice = settlementSavingDto.price;
    soldInvestment.sellPrice = settlementSavingDto.currentPrice;
    soldInvestment.profit = PriceUtils.calculateSellPrice(settlementSavingDto.price, settlementSavingDto.currentPrice);
    soldInvestment.description = settlementSavingDto.description;
    soldInvestment.savingType = settlementSavingDto.savingType;
    soldInvestment.linkUrl = settlementSavingDto.linkUrl;
    return soldInvestment;
  }
}