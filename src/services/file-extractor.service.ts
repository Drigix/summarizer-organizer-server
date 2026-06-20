import { Injectable } from "@nestjs/common";
import { FileTypeEnum } from "src/models/enums/file-type.enum";
import * as ExcelJS from 'exceljs';

@Injectable()
export class FileExtractorService {

    public async extractToFile(fileType: FileTypeEnum, data: any[]): Promise<Buffer> {
        if (fileType === FileTypeEnum.XLSX) {
            return this.exportToXlsx(data);
        }
        throw new Error(`File type ${fileType} is not supported for export.`);
    }

    private async exportToXlsx(data: any[]): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('TestExportXLS');

        worksheet.columns = [
            { header: 'date', key: 'date' },
            { header: 'price_type', key: 'price_type' },
            { header: 'description', key: 'description' },
            { header: 'link_url', key: 'link_url' },
            { header: 'price', key: 'price' }
        ];
        if (!data || data.length === 0) {
            return Buffer.from(await workbook.xlsx.writeBuffer());
        }

        data.forEach(item => {
            worksheet.addRow({
                date: item.date,
                price_type: item.price_type,
                description: item.description,
                link_url: item.link_url,
                price: item.price
            });
        });

        return Buffer.from(await workbook.xlsx.writeBuffer());
    } 
}