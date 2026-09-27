import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketDataController } from 'src/controllers/market-data.controller';
import { SettlementSaving, SettlementSavingSchema } from 'src/models/schemas/settlement-saving.schema';
import { Settlement, SettlementSchema } from 'src/models/schemas/settlement.schema';
import { SoldInvestment } from 'src/models/schemas/sold-investment.schema';
import { StockCompany, StockCompanySchema } from 'src/models/schemas/stock-company.schema';
import { MarketDataService } from 'src/services/market-data.service';
import { RefreshPriceService } from 'src/services/refresh-price.service';
import { SettlementSavingService } from 'src/services/settlement-saving.service';
import { SettlementService } from 'src/services/settlement.service';
import { SoldInvestmentService } from 'src/services/sold-investment.service';
import { StockCompanyService } from 'src/services/stock-company.service';

@Module({
      imports: [
            MongooseModule.forFeature([
              {
                name: StockCompany.name,
                schema: StockCompanySchema
              },
              {
                name: SettlementSaving.name,
                schema: SettlementSavingSchema
              },
              {
                name: Settlement.name,
                schema: SettlementSchema
              },
              {
                name: SoldInvestment.name,
                schema: SoldInvestment
              },
            ])
      ],
    controllers: [MarketDataController],
    providers: [
      MarketDataService, 
      StockCompanyService, 
      SettlementSavingService, 
      SettlementService, 
      SoldInvestmentService, 
      ConfigService,
      RefreshPriceService
    ]
})
export class MarketDataModule { }
