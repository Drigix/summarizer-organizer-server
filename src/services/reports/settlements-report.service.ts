import { Injectable } from '@nestjs/common';
import {
    formatDate, formatMoney, formatPrice, groupBy, monthKey, sortByDate, toMinor,
} from '../../utils/report.utils';
import { ReportColumn, ReportDocument, ReportSection } from 'src/models/reports/document.report';
import { ReportDefinition } from 'src/models/reports/definition-interface.report';
import { ReportTypeEnum } from 'src/models/enums/report-type.enum';

const NO_DATE_LABEL = 'no date';

interface Totals { in: number; out: number }

const COLUMNS: ReportColumn[] = [
    { key: 'date', header: 'date', width: 14, format: formatDate },
    { key: 'price_type', header: 'price_type', width: 16 },
    { key: 'description', header: 'description', width: 40 },
    { key: 'link_url', header: 'link_url', width: 40 },
    { key: 'price', header: 'price', width: 12, align: 'right', format: formatPrice },
];

const toRow = (item: any) => ({
    date: item.date,
    price_type: item.priceType,
    description: item.description,
    link_url: item.linkUrl,
    price: item.price,
});

const describe = (label: string, t: Totals): string =>
    `${label}   |   in: ${formatMoney(t.in)}   |   out: ${formatMoney(t.out)}   |   balance: ${formatMoney(t.in - t.out)}`;

@Injectable()
export class SettlementReport implements ReportDefinition {
    readonly type = ReportTypeEnum.SETTLEMENT;

    build(data: any[]): ReportDocument {
        const { dated, undated } = sortByDate(data ?? [], i => i.date);

        const groups = groupBy(dated, i => monthKey(i.date));
        if (undated.length) groups.set(NO_DATE_LABEL, undated);

        const grand: Totals = { in: 0, out: 0 };
        const sections: ReportSection[] = [];

        for (const [month, items] of groups) {
            const totals: Totals = { in: 0, out: 0 };
            for (const item of items) {
                const kind = String(item.priceType ?? '').toLowerCase();
                if (kind === 'in' || kind === 'out') {
                    const minor = toMinor(item.price);
                    totals[kind] += minor;
                    grand[kind] += minor;
                }
            }
            sections.push({
                heading: month,
                rows: items.map(toRow),
                summary: describe(`Summary ${month}`, totals),
            });
        }

        return { title: 'Export', columns: COLUMNS, sections, footer: describe('TOTAL', grand) };
    }
}