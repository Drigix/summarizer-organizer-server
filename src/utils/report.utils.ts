export const toTime = (value: unknown): number =>
    value ? new Date(value as any).getTime() : NaN;

export const formatDate = (value: unknown): string => {
    const t = toTime(value);
    return Number.isNaN(t) ? String(value ?? '') : new Date(t).toISOString().slice(0, 10);
};

export const formatPrice = (value: unknown): string =>
    value != null ? Number(value).toFixed(2) : '';

export const monthKey = (value: unknown): string =>
    new Date(toTime(value)).toISOString().slice(0, 7);

export const toMinor = (value: unknown): number => {
    const n = Number(value);
    return Number.isFinite(n) ? Math.round(Math.abs(n) * 100) : 0;
};

export const formatMoney = (minor: number): string => (minor / 100).toFixed(2);

export function sortByDate<T>(
    items: T[],
    getDate: (item: T) => unknown,
): { dated: T[]; undated: T[] } {
    const dated: { t: number; item: T }[] = [];
    const undated: T[] = [];
    for (const item of items) {
        const t = toTime(getDate(item));
        Number.isNaN(t) ? undated.push(item) : dated.push({ t, item });
    }
    dated.sort((a, b) => a.t - b.t);
    return { dated: dated.map(d => d.item), undated };
}

export function groupBy<T>(items: T[], getKey: (item: T) => string): Map<string, T[]> {
    const map = new Map<string, T[]>();
    for (const item of items) {
        const key = getKey(item);
        const bucket = map.get(key);
        bucket ? bucket.push(item) : map.set(key, [item]);
    }
    return map;
}
