import { Module } from '@nestjs/common';
import { SettlementSavingService } from 'src/services/settlement-saving.service';
import { SettlementSavingController } from 'src/controllers/settlement-saving.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SettlementSaving, SettlementSavingSchema } from 'src/models/schemas/settlement-saving.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SettlementSaving.name,
        schema: SettlementSavingSchema
      }
    ])
  ],
  controllers: [SettlementSavingController],
  providers: [
    SettlementSavingService,
  ],
})
export class SettlementSavingModule {}