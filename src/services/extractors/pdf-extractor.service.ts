import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as path from 'path';
import { FileExtractor } from './file-extractor.interface';
import { FileTypeEnum } from 'src/models/enums/file-type.enum';
import { FileExtractorUtils } from 'src/utils/file-extractor.utils';

@Injectable()
export class PdfExporter implements FileExtractor {
    readonly type = FileTypeEnum.PDF;

    private readonly margin = 40;
    private readonly padding = 4;
    private readonly fontSize = 9;
    private readonly widths = [80, 100, 220, 250, 100];

    export(data: any[]): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            const { margin, padding, fontSize, widths } = this;
            const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin });

            const chunks: Buffer[] = [];
            doc.on('data', (chunk: Buffer) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            const fontsDir = path.join(process.cwd(), 'src', 'assets', 'fonts');
            doc.registerFont('regular', path.join(fontsDir, 'Roboto-Regular.ttf'));
            doc.registerFont('bold', path.join(fontsDir, 'Roboto-Bold.ttf'));

            const headers = FileExtractorUtils.EXPORT_COLUMNS.map(c => c.header as string);
            const keys = FileExtractorUtils.EXPORT_COLUMNS.map(c => c.key);
            const bottomLimit = doc.page.height - margin;
            const tableWidth = widths.reduce((a, b) => a + b, 0);

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
                doc.moveTo(margin, y + height)
                    .lineTo(margin + tableWidth, y + height)
                    .lineWidth(0.5)
                    .strokeColor('#999999')
                    .stroke();
            };

            doc.font('bold').fontSize(14).text('Export', margin, margin);
            let y = doc.y + 10;

            const drawHeader = () => {
                const h = rowHeight(headers, 'bold');
                drawRow(headers, y, h, 'bold');
                y += h;
            };

            drawHeader();

            for (const item of data ?? []) {
                const row = FileExtractorUtils.mapTextRow(item);
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
}