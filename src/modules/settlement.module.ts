import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { settlementProviders } from 'src/providers/settlement.providers';
import { SettlementController } from 'src/controllers/settlement.controller';
import { SettlementService } from 'src/services/settlement.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SettlementController],
  providers: [
    SettlementService,
    ...settlementProviders,
  ],
})
export class SettlementModule {}