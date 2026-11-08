import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { FileTypeEnum } from 'src/models/enums/file-type.enum';
import { FileExtractorUtils } from 'src/utils/file-extractor.utils';
import { FileExtractor } from './file-extractor.interface';

@Injectable()
export class CsvExporter implements FileExtractor {
    readonly type = FileTypeEnum.CSV;

    async export(data: any[]): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Export');
        worksheet.columns = [...FileExtractorUtils.EXPORT_COLUMNS];

        (data ?? []).forEach(item => worksheet.addRow(FileExtractorUtils.mapTextRow(item)));

        const csv = await workbook.csv.writeBuffer({
            formatterOptions: { delimiter: ';' },
        });

        return Buffer.concat([Buffer.from('\uFEFF', 'utf8'), Buffer.from(csv)]);
    }
}