import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { FileTypeEnum } from 'src/models/enums/file-type.enum';
import { FileExtractor } from './file-extractor.interface';
import { flattenRows, ReportDocument } from 'src/models/reports/document.report';

@Injectable()
export class XlsxExporter implements FileExtractor {
    readonly type = FileTypeEnum.XLSX;

    async export(report: ReportDocument): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(report.title.slice(0, 31));
        worksheet.columns = report.columns.map(({ key, header, width }) => ({ key, header, width }));

        flattenRows(report).forEach(row => worksheet.addRow(row));

        return Buffer.from(await workbook.xlsx.writeBuffer());
    }
}