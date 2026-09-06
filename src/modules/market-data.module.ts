import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketDataController } from 'src/controllers/market-data.controller';
import { StockCompany, StockCompanySchema } from 'src/models/schemas/stock-company.schema';
import { MarketDataService } from 'src/services/market-data.service';
import { StockCompanyService } from 'src/services/stock-company.service';

@Module({
      imports: [
            MongooseModule.forFeature([
              {
                name: StockCompany.name,
                schema: StockCompanySchema
              }
            ])
      ],
    controllers: [MarketDataController],
    providers: [MarketDataService, StockCompanyService, ConfigService]
})
export class MarketDataModule { }
