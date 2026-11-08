import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { FileTypeEnum } from 'src/models/enums/file-type.enum';
import { FileExtractor } from './file-extractor.interface';
import { FileExtractorUtils } from 'src/utils/file-extractor.utils';

@Injectable()
export class XlsxExporter implements FileExtractor {
    readonly type = FileTypeEnum.XLSX;

    async export(data: any[]): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('TestExportXLS');
        worksheet.columns = [...FileExtractorUtils.EXPORT_COLUMNS];

        (data ?? []).forEach(item => worksheet.addRow(FileExtractorUtils.mapRow(item)));

        return Buffer.from(await workbook.xlsx.writeBuffer());
    }
}