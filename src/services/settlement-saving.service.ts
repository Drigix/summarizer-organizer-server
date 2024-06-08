import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MONTHS_CONST } from "src/models/const/month.const";
import { SETTLEMENT_SAVING_TYPES_CONST } from "src/models/const/settlement-saving-types.const";
import { DoughnutChartDataModel, DoughnutChartModel } from "src/models/doughnut-chart.model";
import { SettlementSavingDto } from "src/models/dto/settlement-saving.dto";
import { ProfitLineChartDataModel, ProfitLineChartModel } from "src/models/profit-line-chart.model";
import { SettlementSaving } from "src/models/schemas/settlement-saving.schema";
import { DateUtil } from "src/utils/date.util";

@Injectable()
export class SettlementSavingService {

    constructor(
        @InjectModel(SettlementSaving.name)
        private settlementSavingModel: Model<SettlementSaving>
    ) {}

    async save(settlementSavingDto: SettlementSavingDto): Promise<SettlementSaving> {
        const settlementSaving = new this.settlementSavingModel(settlementSavingDto);
        return this.settlementSavingModel.create(settlementSaving);
    }

    async update(id: string, settlementSavingDto: SettlementSavingDto): Promise<SettlementSaving> {
        return this.settlementSavingModel.findByIdAndUpdate(id, settlementSavingDto);
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
                    _id: {
                        savingType: "$savingType"
                    },
                    price: { $sum: "$price" }
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
          if(settlements.some(s => s._id.savingType === 'bonds')) {
            labels.push('Bonds');
          }
          if(settlements.some(s => s._id.savingType === 'deposit')) {
            labels.push('Deposit');
          }
          if(settlements.some(s => s._id.savingType === 'gold')) {
            labels.push('Gold');
          }
          if(settlements.some(s => s._id.savingType === 'none')) {
            labels.push('None');
          }
          if(settlements.some(s => s._id.savingType === 'stock')) {
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
                $lte: [{ $year: "$date" }, Number(year)]
            },
            savingType: { $in: ['bonds', 'deposit'] }
        }).exec();
        const monthBondsProfitMap = new Map<number, number>();
        const monthDepositsProfitMap = new Map<number, number>();
        const currentDate = new Date(); 
        const bonds = settlements.filter(s => s.savingType === 'bonds');
        const deposits = settlements.filter(s => s.savingType === 'deposit');
        bonds.forEach(b => {
            const monthsDiff = DateUtil.calculateMonthsBetween(b.date, currentDate);
            let index = 1;
            for(let i = monthsDiff; i >= 0; i--) {
                const searchElement = monthBondsProfitMap.get(i);
                Logger.debug('Szukany element: ' + searchElement);
                if(index > 1) {
                    const newProfit = b.price + ((b.price * index * (b.percent / 100)) / b.percentPeriod);
                    Logger.debug('Profit z konkretnego miesiąaca: ' + newProfit);
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
                Logger.debug('Szukany element: ' + searchElement);
                if(index > 1) {
                    const newProfit = b.price + ((b.price * index * (b.percent / 100)) / b.percentPeriod);
                    Logger.debug('Profit z konkretnego miesiąaca: ' + newProfit);
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
        Logger.debug('Miesiące: ' + labels);
        Logger.debug('Data: ' + bondsData);
        Logger.debug('Data: ' + depositsData);
        const profitLineChartDataModel: ProfitLineChartDataModel[] = [];
        profitLineChartDataModel.push(
            new ProfitLineChartDataModel('Obligacje PKO', null, bondsData, false, 0.4),
            new ProfitLineChartDataModel('Lokata PKO', null, depositsData, false, 0.4));
        const profitLineChartModel = new ProfitLineChartModel(labels, profitLineChartDataModel);
        return profitLineChartModel;
    }
}