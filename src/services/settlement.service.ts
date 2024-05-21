import { Inject, Injectable, Logger } from "@nestjs/common";
import { Model } from "mongoose";
import { SETTLEMENT_MODEL_PROVIDER } from "src/config/model-providers.config";
import { MONTHS_CONST } from "src/models/const/month.const";
import { Settlement } from "src/models/settlement.model";
import { SummarizeSettlement } from "src/models/summarize-settlement.model";
import { GroupVerticalBarModel, VerticalBarDataModel, VerticalBarModel } from "src/models/vertical-bar.model";

@Injectable()
export class SettlementService {

    constructor(
        @Inject(SETTLEMENT_MODEL_PROVIDER)
        private settlementModel: Model<Settlement>
    ) {
    }

    async save(settlement: Settlement): Promise<Settlement> {
        return this.settlementModel.create(settlement);
    }

    async findAll(): Promise<Settlement[]> {
        return this.settlementModel.find().exec();
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
            new SummarizeSettlement('Przychodzące', '#67ab90', Math.round((priceOnPlusSide / sumPriceIn) * 100), 'pi pi-plus'),
            new SummarizeSettlement('Wychodzące', '#fd876d', Math.round((sumPriceOut / sumPriceIn) * 100), 'pi pi-minus'),
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
              new VerticalBarDataModel('Przychodzące', undefined, undefined, pricesInToChart),
              new VerticalBarDataModel('Wychodzące', undefined, undefined, pricesOutToChart)
            ]   
        );
      return verticalBarModel;
    }

    async deleteById(id: string): Promise<void> {
        this.settlementModel.findByIdAndDelete(id).exec();
    }
}