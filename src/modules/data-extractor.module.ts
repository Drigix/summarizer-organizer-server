import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataExtractorController } from 'src/controllers/data-extractor.controller';
import { Settlement, SettlementSchema } from 'src/models/schemas/settlement.schema';
import { CsvExporter } from 'src/services/extractors/csv-extractor.service';
import { FILE_EXTRACTORS } from 'src/services/extractors/file-extractor.interface';
import { PdfExporter } from 'src/services/extractors/pdf-extractor.service';
import { XlsxExporter } from 'src/services/extractors/xlsx-extractor.service';
import { FileExtractorService } from 'src/services/extractors/file-extractor.service';
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
  providers: [
    SettlementService,
    XlsxExporter,
    CsvExporter,
    PdfExporter,
    {
      provide: FILE_EXTRACTORS,
      useFactory: (...exporters) => exporters,
      inject: [XlsxExporter, CsvExporter, PdfExporter],
    },
    FileExtractorService
  ]
})
export class DataExtractorModule { }
