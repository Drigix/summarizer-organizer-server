import { Module } from '@nestjs/common';
import { DataExtractorController } from 'src/controllers/data-extractor.controller';
import { FileExtractorService } from 'src/services/file-extractor.service';
import { SettlementService } from 'src/services/settlement.service';

@Module({
    controllers: [DataExtractorController],
    providers: [SettlementService, FileExtractorService]
})
export class DataExtractorModule { }
