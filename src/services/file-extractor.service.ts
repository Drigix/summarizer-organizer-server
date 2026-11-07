import { Injectable } from "@nestjs/common";
import { FileTypeEnum } from "src/models/enums/file-type.enum";
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import * as path from 'path';

@Injectable()
export class FileExtractorService {

    private readonly exportColumns = [
        { header: 'date', key: 'date', width: 14 },
        { header: 'price_type', key: 'price_type', width: 16 },
        { header: 'description', key: 'description', width: 40 },
        { header: 'link_url', key: 'link_url', width: 40 },
        { header: 'price', key: 'price', width: 12 },
    ];

    public async extractToFile(fileType: FileTypeEnum, data: any[]): Promise<Buffer> {
        switch (fileType) {
            case FileTypeEnum.XLSX:
                return this.exportToXlsx(data);
            case FileTypeEnum.CSV:
                return this.exportToCsv(data);
            case FileTypeEnum.PDF:
                return this.exportToPdf(data);
            default:
                throw new Error(`File type ${fileType} is not supported for export.`);
        }
    }

    private async exportToXlsx(data: any[]): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('TestExportXLS');
        worksheet.columns = this.exportColumns;

        (data ?? []).forEach(item => worksheet.addRow(this.mapRow(item)));

        return Buffer.from(await workbook.xlsx.writeBuffer());
    }

    private async exportToCsv(data: any[]): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Export');
        worksheet.columns = this.exportColumns;

        (data ?? []).forEach(item => worksheet.addRow(this.mapTextRow(item)));

        const csv = await workbook.csv.writeBuffer({
            formatterOptions: { delimiter: ';' },
        });

        return Buffer.concat([Buffer.from('\uFEFF', 'utf8'), Buffer.from(csv)]);
    }

    // ---------- PDF ----------

    private exportToPdf(data: any[]): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            const margin = 40;
            const padding = 4;
            const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin });

            const chunks: Buffer[] = [];
            doc.on('data', (chunk: Buffer) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            const fontsDir = path.join(process.cwd(), 'src', 'assets', 'fonts');
            doc.registerFont('regular', path.join(fontsDir, 'Roboto-Regular.ttf'));
            doc.registerFont('bold', path.join(fontsDir, 'Roboto-Bold.ttf'));

            const headers = this.exportColumns.map(c => c.header);
            const keys = this.exportColumns.map(c => c.key);
            const widths = [80, 100, 220, 250, 100];
            const fontSize = 9;
            const bottomLimit = doc.page.height - margin;

            const rowHeight = (cells: string[], font: string): number => {
                doc.font(font).fontSize(fontSize);
                const max = Math.max(
                    ...cells.map((text, i) =>
                        doc.heightOfString(text, { width: widths[i] - padding * 2 }),
                    ),
                );
                return max + padding * 2;
            };

            const drawRow = (cells: string[], y: number, height: number, font: string) => {
                doc.font(font).fontSize(fontSize);
                let x = margin;
                cells.forEach((text, i) => {
                    doc.text(text, x + padding, y + padding, { width: widths[i] - padding * 2 });
                    x += widths[i];
                });
                // line below
                doc.moveTo(margin, y + height)
                    .lineTo(margin + widths.reduce((a, b) => a + b, 0), y + height)
                    .lineWidth(0.5)
                    .strokeColor('#999999')
                    .stroke();
            };

            // title
            doc.font('bold').fontSize(14).text('Export', margin, margin);
            let y = doc.y + 10;

            const drawHeader = () => {
                const h = rowHeight(headers, 'bold');
                drawRow(headers, y, h, 'bold');
                y += h;
            };

            drawHeader();

            for (const item of data ?? []) {
                const row = this.mapTextRow(item);
                const cells = keys.map(k => String(row[k as keyof typeof row] ?? ''));
                const h = rowHeight(cells, 'regular');

                if (y + h > bottomLimit) {
                    doc.addPage();
                    y = margin;
                    drawHeader();
                }

                drawRow(cells, y, h, 'regular');
                y += h;
            }

            doc.end();
        });
    }

    private mapRow(item: any) {
        return {
            date: item.date,
            price_type: item.priceType,
            description: item.description,
            link_url: item.linkUrl,
            price: item.price,
        };
    }

    private mapTextRow(item: any) {
        const row = this.mapRow(item);
        return {
            ...row,
            date: row.date ? new Date(row.date).toISOString().slice(0, 10) : '',
            price: row.price != null ? Number(row.price).toFixed(2) : '',
        };
    }
}