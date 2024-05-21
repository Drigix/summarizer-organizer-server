import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseProviders } from './providers/database.providers';
import { UserModule } from './modules/user.module';
import { SettlementModule } from './modules/settlement.module';
import { SettlementSavingModule } from './modules/settlement-saving.module';

@Module({
  imports: [
    UserModule,
    SettlementModule,
    SettlementSavingModule
  ],
  exports: [
    ...databaseProviders
  ],
  controllers: [AppController],
  providers: [AppService, ...databaseProviders],
})
export class AppModule {}
