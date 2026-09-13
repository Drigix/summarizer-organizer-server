import { Injectable } from "@nestjs/common";
import { StockCompany } from "src/models/schemas/stock-company.schema";
import { Model } from "mongoose";
import { StockPrice } from "src/models/stock-market/stock-price.model";
import { InjectModel } from "@nestjs/mongoose";
import { StockCompanyDto } from "src/models/dto/stock-company.dto";

@Injectable()
export class StockCompanyService {

      constructor(
        @InjectModel(StockCompany.name)
        private stockCompanyModel: Model<StockCompany>
      ) { }

    async createStockCompany(stockCompanyDto: StockCompanyDto): Promise<StockCompany> {
        stockCompanyDto.updatedAt = new Date();
        const createdStockCompany = new this.stockCompanyModel(stockCompanyDto);
        return await createdStockCompany.save();
    }

    async updateStockCompany(stockCompanyDto: StockCompanyDto): Promise<StockCompany> {
        const stockCompany = await this.stockCompanyModel.findOne({ stockSymbol: stockCompanyDto.stockSymbol });
        if (!stockCompany) {
            throw new Error(`Stock company with symbol ${stockCompanyDto.stockSymbol} not found`);
        }
        stockCompany.companyName = stockCompanyDto.companyName;
        stockCompany.currentPrice = stockCompanyDto.currentPrice;
        stockCompany.currency = stockCompanyDto.currency;
        stockCompany.updatedAt = new Date();
        return await stockCompany.save();
    }

    async deleteStockCompany(symbol: string): Promise<void> {
        const stockCompany = await this.stockCompanyModel.findOne({ stockSymbol: symbol });
        if (!stockCompany) {
            throw new Error(`Stock company with symbol ${symbol} not found`);
        }
        await await stockCompany.deleteOne();
    }

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
        stockCompany.currency = stockPrice.currency || stockCompany.currency;
        stockCompany.updatedAt = new Date();
        return await stockCompany.save();
    }

    async getAllStockCompanies(): Promise<StockCompany[]> {
        return await this.stockCompanyModel.find().exec();
    }
}