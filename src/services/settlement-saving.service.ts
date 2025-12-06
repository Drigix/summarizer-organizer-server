import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MONTHS_CONST } from "src/models/const/month.const";
import { DoughnutChartDataModel, DoughnutChartModel } from "src/models/doughnut-chart.model";
import { SettlementSavingDto } from "src/models/dto/settlement-saving.dto";
import { ProfitLineChartDataModel, ProfitLineChartModel } from "src/models/profit-line-chart.model";
import { SettlementSaving } from "src/models/schemas/settlement-saving.schema";
import { SummarizeSettlement } from "src/models/summarize-settlement.model";
import { SettlementSavingEnum } from "src/models/enums/settlement-saving.enum";
import { VerticalBarDataModel, VerticalBarModel } from "src/models/vertical-bar.model";
import { DateUtil } from "src/utils/date.util";
import { SoldInvestmentService } from './sold-investment.service';
import { SettlementService } from './settlement.service';

@Injectable()
export class SettlementSavingService {

    constructor(
        @InjectModel(SettlementSaving.name)
        private settlementSavingModel: Model<SettlementSaving>,
        private settlementService: SettlementService,
        private soldInvestmentService: SoldInvestmentService
    ) {}

    async save(settlementSavingDto: SettlementSavingDto): Promise<SettlementSaving> {
        const settlementSaving = new this.settlementSavingModel(settlementSavingDto);
        return this.settlementSavingModel.create(settlementSaving);
    }

    async update(id: string, settlementSavingDto: SettlementSavingDto): Promise<SettlementSaving> {
        return this.settlementSavingModel.findByIdAndUpdate(id, settlementSavingDto);
    }

    async sell(id: string, settlementSavingDto: SettlementSavingDto): Promise<void> {
      await this.soldInvestmentService.saveFromSettlementSaving(settlementSavingDto);
      await this.settlementService.saveFromSavingSettlement(settlementSavingDto);
      this.deleteById(id);
    }

    async findAllToDate(toDate: string): Promise<SettlementSaving[]> {
        return this.settlementSavingModel.find({
            $or: [
                { dateTo: { $gte: new Date(toDate) } },
                { dateTo: null }
            ]
        }).exec();
    }

    async findSummarizeToChart(toDate: string): Promise<DoughnutChartModel> {
        const settlements = await this.settlementSavingModel.aggregate([
            {
                $match: {
                    $expr: {
                        $or: [
                            { $gte: ["$dateTo", new Date(toDate)] },
                            { $eq: ["$dateTo", null] }
                        ]
                    }
                }
            },
            {
              $group: {
                _id: { savingType: "$savingType" },
                price: {
                  $sum: {
                    $multiply: [
                      "$price",
                      { $ifNull: ["$amount", 1] }
                    ]
                  }
                }
              }
            },
            {
                $sort: {
                    "_id.savingType": 1
                }
            }
        ]).exec();
          const prices = settlements.map(s => s.price);
          const labels = [];
          if(settlements.some(s => s._id.savingType === SettlementSavingEnum.BONDS)) {
            labels.push('Bonds');
          }
          if(settlements.some(s => s._id.savingType === SettlementSavingEnum.CRYPTO)) {
            labels.push('Crypto');
          }
          if(settlements.some(s => s._id.savingType === SettlementSavingEnum.DEPOSIT)) {
            labels.push('Deposit');
          }
          if(settlements.some(s => s._id.savingType === SettlementSavingEnum.GOLD)) {
            labels.push('Gold');
          }
          if(settlements.some(s => s._id.savingType === SettlementSavingEnum.NONE)) {
            labels.push('None');
          }
          if(settlements.some(s => s._id.savingType === SettlementSavingEnum.SILVER)) {
            labels.push('Silver');
          }
          if(settlements.some(s => s._id.savingType === SettlementSavingEnum.STOCK)) {
            labels.push('Stock');
          }
          const verticalBarModel = new DoughnutChartModel(
                labels,
              [
                new DoughnutChartDataModel(undefined, undefined, undefined, prices),
              ]   
          );
        return verticalBarModel;
    }

    async findBondsAndDepositsWithProfit(year: string): Promise<ProfitLineChartModel> {
        const settlements = await this.settlementSavingModel.find({
            $expr: {
                $and: [
                    { $lte: [{ $year: "$date" }, Number(year)] },
                    { $gte: ["$dateTo", new Date()] }
                ]
            },
            savingType: { $in: [SettlementSavingEnum.BONDS, SettlementSavingEnum.DEPOSIT] }
        }).exec();
        const monthBondsProfitMap = new Map<number, number>();
        const monthDepositsProfitMap = new Map<number, number>();
        const currentDate = new Date(); 
        const bonds = settlements.filter(s => s.savingType === SettlementSavingEnum.BONDS);
        const deposits = settlements.filter(s => s.savingType === SettlementSavingEnum.DEPOSIT);
        bonds.forEach(b => {
            const monthsDiff = DateUtil.calculateMonthsBetween(b.date, currentDate);
            let index = 1;
            for(let i = monthsDiff; i >= 0; i--) {
                const searchElement = monthBondsProfitMap.get(i);
                if(index > 1) {
                    const newProfit = b.price + ((b.price * index * (b.percent / 100)) / b.percentPeriod);
                    if(searchElement) {
                        monthBondsProfitMap.set(i,  newProfit + searchElement);
                    } else {
                        monthBondsProfitMap.set(i,  newProfit);
                    }
                } else {
                    if(searchElement) {
                        monthBondsProfitMap.set(i, b.price + searchElement);
                    } else {
                        monthBondsProfitMap.set(i, b.price);
                    }
                }
                index++;
            }
        });
        deposits.forEach(b => {
            const monthsDiff = DateUtil.calculateMonthsBetween(b.date, currentDate);
            let index = 1;
            for(let i = monthsDiff; i >= 0; i--) {
                const searchElement = monthDepositsProfitMap.get(i);
                if(index > 1) {
                    const newProfit = b.price + ((b.price * index * (b.percent / 100)) / b.percentPeriod);
                    if(searchElement) {
                        monthDepositsProfitMap.set(i,  newProfit + searchElement);
                    } else {
                        monthDepositsProfitMap.set(i,  newProfit);
                    }
                } else {
                    if(searchElement) {
                        monthDepositsProfitMap.set(i, b.price + searchElement);
                    } else {
                        monthDepositsProfitMap.set(i, b.price);
                    }
                }
                index++;
            }
        });
        const labels = [];
        const bondsData = [];
        const depositsData = [];
        for(let i = 0; i <= currentDate.getMonth(); i++) {
            labels.push(MONTHS_CONST[i]);
        }
        for(let i = currentDate.getMonth(); i >= 0; i--) {
            bondsData.push(monthBondsProfitMap.get(i));
        }
        for(let i = currentDate.getMonth(); i >= 0; i--) {
            depositsData.push(monthDepositsProfitMap.get(i));
        }
        const profitLineChartDataModel: ProfitLineChartDataModel[] = [];
        profitLineChartDataModel.push(
            new ProfitLineChartDataModel('Bonds', null, bondsData, false, 0.4),
            new ProfitLineChartDataModel('Deposits', null, depositsData, false, 0.4));
        const profitLineChartModel = new ProfitLineChartModel(labels, profitLineChartDataModel);
        return profitLineChartModel;
    }

    async findSummarizePricesChartDataset(savingType: SettlementSavingEnum): Promise<VerticalBarModel> {
        const settlements = await this.settlementSavingModel.find({
            savingType: { $in: [savingType] }
        }).exec();
        settlements.forEach(s => {
            if(!s.currentPrice) {
                s.currentPrice = s.price;
            }
        });
        const purchasesPricesToChart = settlements.map(s => s.price * (s?.amount ?? 1));
        const currentPricesToChart = settlements.map(s => s.currentPrice * (s?.amount ?? 1));
        const verticalBarModel = new VerticalBarModel(
            settlements.map(s => s.description),
            [
              new VerticalBarDataModel('Cena kupna', '#577bb1', '#577bb1', purchasesPricesToChart),
              new VerticalBarDataModel('Aktualna cena', '#67ab90', '#67ab90', currentPricesToChart)
            ]   
        );
      return verticalBarModel;
    }

    async findProfitPrices(settlementSavingType: SettlementSavingEnum): Promise<SummarizeSettlement[]> {
        const settlements1 = await this.settlementSavingModel.aggregate([
            {
              $match: {
                savingType: settlementSavingType
              }
            },
            {
              $group: {
                _id: "$savingType",
                price: { $sum: "$price" },
                currentPrice: { $sum: "$currentPrice" }
              }
            }
          ]).exec();
        let sumPriceIn = settlements1[0].currentPrice;
        let sumPriceOut = settlements1[0].price;
        const priceOnPlusSide = sumPriceIn - sumPriceOut;
        const summarizeSettlements = [
            new SummarizeSettlement('Aktualna cena', '#67ab90', Math.round((priceOnPlusSide / sumPriceIn) * 100), 0, 'pi pi-plus', 'in'),
            new SummarizeSettlement('Cena zakupu', '#fd876d', Math.round((sumPriceOut / sumPriceIn) * 100), 0, 'pi pi-minus', 'out'),
            new SummarizeSettlement('Bilans', priceOnPlusSide < 0 ? '#fd876d' : '#67ab90', 0, priceOnPlusSide, 'pi pi-dollar', 'save')   
        ]
        return summarizeSettlements;
    }

    async deleteById(id: string): Promise<void> {
        this.settlementSavingModel.findByIdAndDelete(id).exec();
    }
}