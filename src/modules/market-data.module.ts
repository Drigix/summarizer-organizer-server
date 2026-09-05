import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MarketDataController } from 'src/controllers/market-data.controller';
import { MarketDataService } from 'src/services/market-data.service';

@Module({
      imports: [
        
      ],
    controllers: [MarketDataController],
    providers: [MarketDataService, ConfigService]
})
export class MarketDataModule { }
