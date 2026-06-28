import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataExtractorController } from 'src/controllers/data-extractor.controller';
import { Settlement, SettlementSchema } from 'src/models/schemas/settlement.schema';
import { FileExtractorService } from 'src/services/file-extractor.service';
import { SettlementService } from 'src/services/settlement.service';

@Module({
      imports: [
        MongooseModule.forFeature([
          {
            name: Settlement.name,
            schema: SettlementSchema
          }
        ])
      ],
    controllers: [DataExtractorController],
    providers: [SettlementService, FileExtractorService]
})
export class DataExtractorModule { }
