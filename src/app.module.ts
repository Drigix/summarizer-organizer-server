import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SettlementModule } from './modules/settlement.module';
import { SettlementSavingModule } from './modules/settlement-saving.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SoldInvestmentModule } from './modules/sold-investment.module';
import { DataExtractorModule } from './modules/data-extractor.module';
import { MarketDataModule } from './modules/market-data.module';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserModule } from './modules/auth/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('MONGO_HOST');
        const port = configService.get<string>('MONGO_PORT');
        const db = configService.get<string>('MONGODB_NAME');
        const username = configService.get<string>('MONGO_USERNAME');
        const password = configService.get<string>('MONGO_PASSWORD');
        return {
          uri: `mongodb://${username}:${password}@${host}:${port}/${db}?authSource=admin`,
        }
      }
    }),
    SettlementModule,
    SettlementSavingModule,
    SoldInvestmentModule,
    DataExtractorModule,
    MarketDataModule,
    UserModule
  ],
  exports: [
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
