import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as path from 'path';
import { FileTypeEnum } from 'src/models/enums/file-type.enum';
import { formatCell, ReportDocument } from 'src/models/reports/document.report';
import { FileExtractor } from './file-extractor.interface';

@Injectable()
export class PdfExporter implements FileExtractor {
    readonly type = FileTypeEnum.PDF;

    private readonly margin = 40;
    private readonly padding = 4;
    private readonly fontSize = 9;

    private static readonly SECTION_BG = '#EEEEEE';
    private static readonly FOOTER_BG = '#D0D0D0';

    export(report: ReportDocument): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            try {
                this.render(report, resolve, reject);
            } catch (e) {
                reject(e);
            }
        });
    }

    private render(
        report: ReportDocument,
        resolve: (b: Buffer) => void,
        reject: (e: unknown) => void,
    ): void {
        const { margin, padding, fontSize } = this;
        const { columns } = report;

        const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin });
        const chunks: Buffer[] = [];
        doc.on('data', (chunk: Buffer) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        const fontsDir = path.join(__dirname, '..', '..', 'assets', 'fonts');
        doc.registerFont('regular', path.join(fontsDir, 'Roboto-Regular.ttf'));
        doc.registerFont('bold', path.join(fontsDir, 'Roboto-Bold.ttf'));

        // --------- layout ----------
        const tableWidth = doc.page.width - margin * 2;
        const totalWeight = columns.reduce((s, c) => s + c.width, 0);
        const widths = columns.map(c => (c.width / totalWeight) * tableWidth);
        const headers = columns.map(c => c.header);
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
                    ...cells.map((t, i) => doc.heightOfString(t, { width: widths[i] - padding * 2 })),
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
                doc.text(t, x + padding, y + padding, {
                    width: widths[i] - padding * 2,
                    align: columns[i].align ?? 'left',
                });
                x += widths[i];
            });
            line(y + h);
            y += h;
        };

        /** Row spanning the entire table width (group header / summary). */
        const drawBand = (text: string, h: number, bg: string) => {
            doc.save().rect(margin, y, tableWidth, h).fill(bg).restore();
            doc.fillColor('#000000')
                .font('bold')
                .fontSize(fontSize)
                .text(text, margin + padding, y + padding, { width: tableWidth - padding * 2 });
            line(y + h);
            y += h;
        };

        const drawHeader = () => drawRow(headers, cellsHeight(headers, 'bold'), 'bold');

        /** Block to another page if it doesn't fit. */
        const ensureSpace = (h: number) => {
            if (y + h > bottomLimit) {
                doc.addPage();
                y = margin;
                drawHeader();
            }
        };

        // ---------- render ----------

        doc.font('bold').fontSize(14).text(report.title, margin, margin);
        y = doc.y + 10;
        drawHeader();

        for (const section of report.sections) {
            const headingH = section.heading ? bandHeight(section.heading, 'bold') : 0;
            const summaryH = section.summary ? bandHeight(section.summary, 'bold') : 0;

            const rows = section.rows.map(r => {
                const cells = columns.map(c => formatCell(c, r[c.key]));
                return { cells, h: cellsHeight(cells, 'regular') };
            });

            ensureSpace(headingH + (rows[0]?.h ?? summaryH));
            if (section.heading) drawBand(section.heading, headingH, PdfExporter.SECTION_BG);

            rows.forEach((row, i) => {
                ensureSpace(row.h + (i === rows.length - 1 ? summaryH : 0));
                drawRow(row.cells, row.h, 'regular');
            });

            if (section.summary) drawBand(section.summary, summaryH, PdfExporter.SECTION_BG);
        }

        if (report.footer) {
            const footerH = bandHeight(report.footer, 'bold');
            ensureSpace(footerH);
            drawBand(report.footer, footerH, PdfExporter.FOOTER_BG);
        }

        doc.end();
    }
}