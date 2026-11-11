import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { FileTypeEnum } from 'src/models/enums/file-type.enum';
import { FileExtractor } from './file-extractor.interface';
import { flattenRows, formatCell, ReportDocument } from 'src/models/reports/document.report';

@Injectable()
export class CsvExporter implements FileExtractor {
    readonly type = FileTypeEnum.CSV;

    async export(report: ReportDocument): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Export');
        worksheet.columns = report.columns.map(({ key, header, width }) => ({ key, header, width }));

        flattenRows(report).forEach(row =>
            worksheet.addRow(
                Object.fromEntries(report.columns.map(c => [c.key, formatCell(c, row[c.key])])),
            ),
        );

        const csv = await workbook.csv.writeBuffer({ formatterOptions: { delimiter: ';' } });

        return Buffer.concat([Buffer.from('\uFEFF', 'utf8'), Buffer.from(csv)]);
    }
}