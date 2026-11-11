export interface ReportColumn {
    key: string;
    header: string;
    width: number;
    align?: 'left' | 'right';
    format?: (value: unknown) => string;
}

export type ReportRow = Record<string, unknown>;

export interface ReportSection {
    heading?: string;
    rows: ReportRow[];
    summary?: string;
}

export interface ReportDocument {
    title: string;
    columns: ReportColumn[];
    sections: ReportSection[];
    footer?: string;
}

export const formatCell = (column: ReportColumn, value: unknown): string =>
    column.format ? column.format(value) : String(value ?? '');

export const flattenRows = (report: ReportDocument): ReportRow[] =>
    report.sections.flatMap(s => s.rows);
