import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user.module';
import { SettlementModule } from './modules/settlement.module';
import { SettlementSavingModule } from './modules/settlement-saving.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/sum_org_db'),
    UserModule,
    SettlementModule,
    SettlementSavingModule
  ],
  exports: [
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
