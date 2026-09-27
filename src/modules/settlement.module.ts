import { Module } from '@nestjs/common';
import { SettlementController } from 'src/controllers/settlement.controller';
import { SettlementService } from 'src/services/settlement.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Settlement, SettlementSchema } from 'src/models/schemas/settlement.schema';
import { SettlementSaving, SettlementSavingSchema } from 'src/models/schemas/settlement-saving.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Settlement.name,
        schema: SettlementSchema
      }
    ])
  ],
  controllers: [SettlementController],
  providers: [
    SettlementService,
  ],
})
export class SettlementModule {}