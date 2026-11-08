import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as path from 'path';
import { FileExtractor } from './file-extractor.interface';
import { FileTypeEnum } from 'src/models/enums/file-type.enum';
import { FileExtractorUtils } from 'src/utils/file-extractor.utils';
import { buildReport, formatMoney, Totals } from 'src/models/reports/settlements-in-out.report';

@Injectable()
export class PdfExporter implements FileExtractor {
    readonly type = FileTypeEnum.PDF;

    private readonly margin = 40;
    private readonly padding = 4;
    private readonly fontSize = 9;
    private readonly widths = [80, 100, 220, 250, 100];

    private static readonly MONTH_BG = '#EEEEEE';
    private static readonly TOTAL_BG = '#D0D0D0';

    // export(data: any[]): Promise<Buffer> {
    //     return new Promise<Buffer>((resolve, reject) => {
    //         const { margin, padding, fontSize, widths } = this;
    //         const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin });

    //         const chunks: Buffer[] = [];
    //         doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    //         doc.on('end', () => resolve(Buffer.concat(chunks)));
    //         doc.on('error', reject);

    //         const fontsDir = path.join(process.cwd(), 'src', 'assets', 'fonts');
    //         doc.registerFont('regular', path.join(fontsDir, 'Roboto-Regular.ttf'));
    //         doc.registerFont('bold', path.join(fontsDir, 'Roboto-Bold.ttf'));

    //         const headers = FileExtractorUtils.EXPORT_COLUMNS.map(c => c.header as string);
    //         const keys = FileExtractorUtils.EXPORT_COLUMNS.map(c => c.key);
    //         const bottomLimit = doc.page.height - margin;
    //         const tableWidth = widths.reduce((a, b) => a + b, 0);

    //         const rowHeight = (cells: string[], font: string): number => {
    //             doc.font(font).fontSize(fontSize);
    //             const max = Math.max(
    //                 ...cells.map((text, i) =>
    //                     doc.heightOfString(text, { width: widths[i] - padding * 2 }),
    //                 ),
    //             );
    //             return max + padding * 2;
    //         };

    //         const drawRow = (cells: string[], y: number, height: number, font: string) => {
    //             doc.font(font).fontSize(fontSize);
    //             let x = margin;
    //             cells.forEach((text, i) => {
    //                 doc.text(text, x + padding, y + padding, { width: widths[i] - padding * 2 });
    //                 x += widths[i];
    //             });
    //             doc.moveTo(margin, y + height)
    //                 .lineTo(margin + tableWidth, y + height)
    //                 .lineWidth(0.5)
    //                 .strokeColor('#999999')
    //                 .stroke();
    //         };

    //         doc.font('bold').fontSize(14).text('Export', margin, margin);
    //         let y = doc.y + 10;

    //         const drawHeader = () => {
    //             const h = rowHeight(headers, 'bold');
    //             drawRow(headers, y, h, 'bold');
    //             y += h;
    //         };

    //         drawHeader();

    //         for (const item of data ?? []) {
    //             const row = FileExtractorUtils.mapTextRow(item);
    //             const cells = keys.map(k => String(row[k as keyof typeof row] ?? ''));
    //             const h = rowHeight(cells, 'regular');

    //             if (y + h > bottomLimit) {
    //                 doc.addPage();
    //                 y = margin;
    //                 drawHeader();
    //             }

    //             drawRow(cells, y, h, 'regular');
    //             y += h;
    //         }

    //         doc.end();
    //     });
    // }

    export(data: any[]): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            try {
                this.render(data, resolve, reject);
            } catch (e) {
                reject(e);
            }
        });
    }

    private render(
        data: any[],
        resolve: (b: Buffer) => void,
        reject: (e: unknown) => void,
    ): void {
        const { margin, padding, fontSize, widths } = this;
        const report = buildReport(data);

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
        const tableWidth = widths.reduce((a, b) => a + b, 0);
        const bottomLimit = doc.page.height - margin;
        let y = margin;

        // ---------- helpers ----------

        const line = (yPos: number) =>
            doc.moveTo(margin, yPos)
                .lineTo(margin + tableWidth, yPos)
                .lineWidth(0.5)
                .strokeColor('#999999')
                .stroke();

        const cellsHeight = (cells: string[], font: string): number => {
            doc.font(font).fontSize(fontSize);
            return (
                Math.max(
                    ...cells.map((t, i) =>
                        doc.heightOfString(t, { width: widths[i] - padding * 2 }),
                    ),
                ) +
                padding * 2
            );
        };

        const bandHeight = (text: string, font: string): number => {
            doc.font(font).fontSize(fontSize);
            return doc.heightOfString(text, { width: tableWidth - padding * 2 }) + padding * 2;
        };

        const drawRow = (cells: string[], h: number, font: string) => {
            doc.fillColor('#000000').font(font).fontSize(fontSize);
            let x = margin;
            cells.forEach((t, i) => {
                doc.text(t, x + padding, y + padding, { width: widths[i] - padding * 2 });
                x += widths[i];
            });
            line(y + h);
            y += h;
        };

        /** Wiersz na całą szerokość tabeli (nagłówek miesiąca / podsumowania). */
        const drawBand = (text: string, h: number, font: string, bg: string) => {
            doc.save().rect(margin, y, tableWidth, h).fill(bg).restore();
            doc.fillColor('#000000')
                .font(font)
                .fontSize(fontSize)
                .text(text, margin + padding, y + padding, { width: tableWidth - padding * 2 });
            line(y + h);
            y += h;
        };

        const drawHeader = () => drawRow(headers, cellsHeight(headers, 'bold'), 'bold');

        const ensureSpace = (h: number) => {
            if (y + h > bottomLimit) {
                doc.addPage();
                y = margin;
                drawHeader();
            }
        };

        const summaryText = (label: string, t: Totals) =>
            `${label}   |   in: ${formatMoney(t.in)}   |   out: ${formatMoney(t.out)}   |   balance: ${formatMoney(t.balance)}`;

        // ---------- render ----------

        doc.font('bold').fontSize(14).text('Export', margin, margin);
        y = doc.y + 10;
        drawHeader();

        for (const group of report.groups) {
            const monthText = group.month;
            const summary = summaryText(`Summary ${group.month}`, group.totals);
            const monthH = bandHeight(monthText, 'bold');
            const summaryH = bandHeight(summary, 'bold');

            const rows = group.rows.map(r => {
                const cells = keys.map(k => String(r[k as keyof typeof r] ?? ''));
                return { cells, h: cellsHeight(cells, 'regular') };
            });

            ensureSpace(monthH + (rows[0]?.h ?? 0));
            drawBand(monthText, monthH, 'bold', PdfExporter.MONTH_BG);

            rows.forEach((row, i) => {
                ensureSpace(row.h + (i === rows.length - 1 ? summaryH : 0));
                drawRow(row.cells, row.h, 'regular');
            });

            drawBand(summary, summaryH, 'bold', PdfExporter.MONTH_BG);
        }

        const total = summaryText('TOTAL', report.totals);
        const totalH = bandHeight(total, 'bold');
        ensureSpace(totalH);
        drawBand(total, totalH, 'bold', PdfExporter.TOTAL_BG);

        doc.end();
    }
}