import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, set } from "mongoose";
import { MONTHS_CONST } from "src/models/const/month.const";
import { SettlementDto } from "src/models/dto/settlement.dto";
import { Settlement } from "src/models/schemas/settlement.schema";
import { SummarizeSettlement } from "src/models/summarize-settlement.model";
import { GroupVerticalBarModel, VerticalBarDataModel, VerticalBarModel } from "src/models/vertical-bar.model";
import { DateUtil } from "src/utils/date.util";
import { SettlementSavingDto } from '../models/dto/settlement-saving.dto';
import { PriceUtils } from '../utils/prive.utils';

@Injectable()
export class SettlementService {

    constructor(
        @InjectModel(Settlement.name) private settlementModel: Model<Settlement>
    ) {
    }

    async save(settlementDto: SettlementDto): Promise<Settlement> {
        let result;
        settlementDto.date = new Date(DateUtil.getFirstDayOfMonth(settlementDto.date));
        settlementDto.toDate = new Date(DateUtil.getFirstDayOfMonth(settlementDto.toDate));
        if(settlementDto.date.getMonth() === settlementDto.toDate.getMonth()) {
            const settlement = new this.settlementModel(settlementDto);
            result = this.settlementModel.create(settlement);
        } else {
            const dateDiff = DateUtil.calculateMonthDifference(settlementDto.date, settlementDto.toDate);
            let dateHandler = new Date(settlementDto.date);
            for(let i = 0; i <= dateDiff; i++) {
                dateHandler.setMonth(dateHandler.getMonth() + (i === 0 ? 0 : 1)); 
                settlementDto.date = new Date(DateUtil.getFirstDayOfMonth(dateHandler));
                const settlement = new this.settlementModel(settlementDto);
                result = this.settlementModel.create(settlement);
            }
        }
        return result;
    }

    async saveFromSavingSettlement(settlementSavingDto: SettlementSavingDto): Promise<Settlement> {
      const settlement = this.convertSavingSettlementToSoldInvestment(settlementSavingDto);
      if (settlement == null) {
        return null;
      }
      return this.settlementModel.create(settlement);
    }

    async update(id: string, settlementDto: SettlementDto): Promise<Settlement> {
        settlementDto.date = new Date(DateUtil.getFirstDayOfMonth(settlementDto.date));
        return this.settlementModel.findByIdAndUpdate(id, settlementDto);
    }

    async findAll(): Promise<Settlement[]> {
        return this.settlementModel.find().exec();
    }

    async findAllByDescription(description: string): Promise<Settlement[]> {
        return this.settlementModel.find({
            description: new RegExp(`.*${description}.*`, 'i')
        }).exec();
    }

    async findAllByUserIdAndDateBetween(id: number, fromDate: string, toDate: string): Promise<Settlement[]> {
        return this.settlementModel.find({
            userId: id,
            date: { $gte: new Date(fromDate), $lte: new Date(toDate) }
          }).exec();
    }
    
    
    async findAllByDateBetween(fromDate: string, toDate: string): Promise<Settlement[]> {
        return this.settlementModel.find({
            date: { $gte: new Date(fromDate), $lte: new Date(toDate) }
          }).exec();
    }

    async findSummarizeSettlementsByDateBetween(fromDate: string, toDate: string): Promise<SummarizeSettlement[]> {
        const settlements = await this.settlementModel.find({
            priceType: { $in: ['in', 'out'] },
            date: { $gte: new Date(fromDate), $lte: new Date(toDate) }
          }).exec();
        let sumPriceIn = 0;
        let sumPriceOut = 0;
        settlements.forEach(s => {
            if(s.priceType === 'in') {
                sumPriceIn += s.price;
            } else {
                sumPriceOut += s.price;
            }
        });
        const priceOnPlusSide = sumPriceIn - sumPriceOut;
        const summarizeSettlements = [
            new SummarizeSettlement('Przychodzące', '#67ab90', Math.round((priceOnPlusSide / sumPriceIn) * 100), 0, 'pi pi-plus', 'in'),
            new SummarizeSettlement('Wychodzące', '#fd876d', Math.round((sumPriceOut / sumPriceIn) * 100), 0, 'pi pi-minus', 'out'),
            new SummarizeSettlement('Bilans', priceOnPlusSide < 0 ? '#fd876d' : '#67ab90', 0, priceOnPlusSide, 'pi pi-dollar', 'save')   
        ]
        return summarizeSettlements;
    }

    async findChartDatasetInYear(year: number): Promise<VerticalBarModel> {
        const settlements = await this.settlementModel.aggregate([
          {
              $match: {
                  $expr: {
                      $eq: [{ $year: "$date" }, Number(year)]
                  }
              }
          },
          {
              $group: {
                  _id: {
                      month: { $month: "$date" },
                      priceType: "$priceType"
                  },
                  price: { $sum: "$price" }
              }
          },
          {
              $sort: {
                  "_id.month": 1,
                  "_id.priceType": 1
              }
          }
        ]).exec();
        const pricesInToChart = [];
        const pricesOutToChart = [];
        settlements.forEach(s => {
            if(s._id.priceType === 'in') {
                pricesInToChart.push(s.price);
            } else if(s._id.priceType === 'out') {
                pricesOutToChart.push(s.price);
            }
        });
        const verticalBarModel = new VerticalBarModel(
            MONTHS_CONST,
            [
              new VerticalBarDataModel('Przychodzące', '#67ab90', '#67ab90', pricesInToChart),
              new VerticalBarDataModel('Wychodzące', '#fd876d', '#fd876d', pricesOutToChart)
            ]   
        );
      return verticalBarModel;
    }

    async deleteById(id: string): Promise<void> {
        this.settlementModel.findByIdAndDelete(id).exec();
    }

    private convertSavingSettlementToSoldInvestment(settlementSavingDto: SettlementSavingDto): Settlement {
      const priceType = PriceUtils.convertPriceToSettlementPriceType(settlementSavingDto.price, settlementSavingDto.currentPrice);
      if (priceType === null) {
        return null;
      }
      const settlement = new Settlement();
      settlement.date = new Date(DateUtil.getFirstDayOfMonth(settlementSavingDto.sellDate));
      settlement.description = settlementSavingDto.description;
      settlement.linkUrl = settlementSavingDto.linkUrl;
      settlement.price = PriceUtils.calculateSellPrice(settlementSavingDto.price, settlementSavingDto.currentPrice);
      settlement.priceType = priceType;
      return settlement;
    }
}