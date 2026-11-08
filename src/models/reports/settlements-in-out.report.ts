import { FileExtractorUtils } from "src/utils/file-extractor.utils";


export type ReportRow = ReturnType<typeof FileExtractorUtils.mapTextRow>;

/** Wszystkie kwoty w groszach (liczby całkowite) - brak błędów zmiennoprzecinkowych. */
export interface Totals {
    in: number;
    out: number;
    balance: number;
}

export interface MonthGroup {
    /** 'YYYY-MM' or NO_DATE_LABEL */
    month: string;
    rows: ReportRow[];
    totals: Totals;
}

export interface Report {
    groups: MonthGroup[];
    totals: Totals;
}

export const NO_DATE_LABEL = 'no date';

const emptyTotals = (): Totals => ({ in: 0, out: 0, balance: 0 });

/** Kwota w groszach; Math.abs - kierunek wyznacza price_type, nie znak. */
const toMinor = (value: unknown): number => {
    const n = Number(value);
    return Number.isFinite(n) ? Math.round(Math.abs(n) * 100) : 0;
};

export const formatMoney = (minor: number): string => (minor / 100).toFixed(2);

/**
 * Sortuje po dacie, grupuje po miesiącu (UTC) i liczy sumy in / out / bilans
 * dla każdego miesiąca oraz dla całości. Rekordy bez poprawnej daty trafiają na koniec.
 * Wiersze o nieznanym price_type są pokazane, ale nie wchodzą do sum.
 */
export function buildReport(data: any[]): Report {
    const dated: { time: number; item: any }[] = [];
    const undated: any[] = [];

    for (const item of data ?? []) {
        const time = item.date ? new Date(item.date).getTime() : NaN;
        Number.isNaN(time) ? undated.push(item) : dated.push({ time, item });
    }
    dated.sort((a, b) => a.time - b.time); // sort stabilny (Node >= 11)

    const groups = new Map<string, MonthGroup>();
    const grand = emptyTotals();

    const add = (month: string, item: any) => {
        let group = groups.get(month);
        if (!group) {
            group = { month, rows: [], totals: emptyTotals() };
            groups.set(month, group);
        }
        group.rows.push(FileExtractorUtils.mapTextRow(item));

        const type = String(item.priceType ?? '').toLowerCase();
        if (type === 'in' || type === 'out') {
            const minor = toMinor(item.price);
            group.totals[type] += minor;
            grand[type] += minor;
        }
    };

    for (const { time, item } of dated) {
        add(new Date(time).toISOString().slice(0, 7), item);
    }
    for (const item of undated) {
        add(NO_DATE_LABEL, item);
    }

    const result = [...groups.values()];
    for (const g of result) g.totals.balance = g.totals.in - g.totals.out;
    grand.balance = grand.in - grand.out;

    return { groups: result, totals: grand };
}