import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SoldInvestment } from '../models/schemas/sold-investment.schema';
import { SettlementSavingDto } from '../models/dto/settlement-saving.dto';
import { PriceUtils } from '../utils/prive.utils';

@Injectable()
export class SoldInvestmentService {

  constructor(
    @InjectModel(SoldInvestment.name) private soldInvestmentModel: Model<SoldInvestment>
  ) {}

  async saveFromSettlementSaving(settlementSavingDto: SettlementSavingDto): Promise<SoldInvestment> {
    const soldInvestment = this.convertSavingSettlementToSoldInvestment(settlementSavingDto);
    return this.soldInvestmentModel.create(soldInvestment);
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