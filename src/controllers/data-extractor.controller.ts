import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { FileTypeEnum } from 'src/models/enums/file-type.enum';
import { FileExtractorService } from 'src/services/file-extractor.service';
import { SettlementService } from 'src/services/settlement.service';

@Controller('/api/data-extractor')
export class DataExtractorController {
public constructor(
    private readonly settlementService: SettlementService,
    private readonly fileExtractorService: FileExtractorService
  ) {}

  @Get('/settlement/:dateFrom/:dateTo/:fileType')
  async extractSettlementToFile(
    @Param('dateFrom') dateFrom: string, 
    @Param('dateTo') dateTo: string, 
    @Param('fileType') fileType: FileTypeEnum,
    @Res() res: Response): Promise<void> {
    Logger.debug('Request to extract settlement data to file from ' + dateFrom + ' to ' + dateTo + ' with file type: ' + fileType);
    if (!dateFrom || !dateTo || !fileType) {
      throw new BadRequestException('Invalid parameters for data extraction');
    }
    const settlements = await this.settlementService.findAllByDateBetween(dateFrom, dateTo);
    const buffer = await this.fileExtractorService.extractToFile(fileType, settlements);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="settlement_${dateFrom}_${dateTo}.xlsx"`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
}