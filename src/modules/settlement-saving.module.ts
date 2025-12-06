import { Module } from '@nestjs/common';
import { SettlementSavingService } from 'src/services/settlement-saving.service';
import { SettlementSavingController } from 'src/controllers/settlement-saving.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SettlementSaving, SettlementSavingSchema } from 'src/models/schemas/settlement-saving.schema';
import { SettlementService } from '../services/settlement.service';
import { SoldInvestmentService } from '../services/sold-investment.service';
import {
  Settlement,
  SettlementSchema,
} from '../models/schemas/settlement.schema';
import {
  SoldInvestment,
  SoldInvestmentSchema,
} from '../models/schemas/sold-investment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
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
        schema: SoldInvestmentSchema
      },
    ])
  ],
  controllers: [SettlementSavingController],
  providers: [
    SettlementSavingService,
    SettlementService,
    SoldInvestmentService
  ],
})
export class SettlementSavingModule {}