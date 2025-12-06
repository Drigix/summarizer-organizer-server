import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SettlementController } from '../controllers/settlement.controller';
import { SettlementService } from '../services/settlement.service';
import {
  SoldInvestment,
  SoldInvestmentSchema,
} from '../models/schemas/sold-investment.schema';
import { SoldInvestmentController } from '../controllers/sold-investment.controller';
import { SoldInvestmentService } from '../services/sold-investment.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SoldInvestment.name,
        schema: SoldInvestmentSchema
      }
    ])
  ],
  controllers: [SoldInvestmentController],
  providers: [
    SoldInvestmentService,
  ],
})
export class SoldInvestmentModule {}