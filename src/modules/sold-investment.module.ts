import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Settlement,
  SettlementSchema,
} from '../models/schemas/settlement.schema';
import { SettlementController } from '../controllers/settlement.controller';
import { SettlementService } from '../services/settlement.service';
import {
  SoldInvestment,
  SoldInvestmentSchema,
} from '../models/schemas/sold-investment.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SoldInvestment.name,
        schema: SoldInvestmentSchema
      }
    ])
  ],
  controllers: [SettlementController],
  providers: [
    SettlementService,
  ],
})
export class SoldInvestmentModule {}