import { Injectable } from "@nestjs/common";
import { StockCompany } from "src/models/schemas/stock-company.schema";
import { Model } from "mongoose";
import { StockPrice } from "src/models/stock-market/stock-price.model";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class StockCompanyService {

      constructor(
        @InjectModel(StockCompany.name)
        private stockCompanyModel: Model<StockCompany>
      ) { }


    async updateStockListPrices(stockPrices: StockPrice[]): Promise<StockCompany[]> {
        const updatedCompanies: StockCompany[] = [];
        for (const stockPrice of stockPrices) {
            const stoctkCompany = await this.updateStockPrice(stockPrice);
            updatedCompanies.push(stoctkCompany);
        }
        return updatedCompanies;
    }

    async updateStockPrice(stockPrice: StockPrice): Promise<StockCompany> {
        const stockCompany = await this.stockCompanyModel.findOne({ stockSymbol: stockPrice.symbol });
        if (!stockCompany) {
            throw new Error(`Stock company with symbol ${stockPrice.symbol} not found`);
        }
        stockCompany.currentPrice = stockPrice.price;
        stockCompany.updatedAt = new Date();
        return await stockCompany.save();
    }

    async getAllStockCompanies(): Promise<StockCompany[]> {
        return await this.stockCompanyModel.find().exec();
    }
}