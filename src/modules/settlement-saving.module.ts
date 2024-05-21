import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { SettlementSavingService } from 'src/services/settlement-saving.service';
import { settlementSavingProviders } from 'src/providers/settlement-saving.providers';
import { SettlementSavingController } from 'src/controllers/settlement-saving.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [SettlementSavingController],
  providers: [
    SettlementSavingService,
    ...settlementSavingProviders,
  ],
})
export class SettlementSavingModule {}