export class FileExtractorUtils {
    public static readonly EXPORT_COLUMNS = [
        { header: 'date', key: 'date', width: 14 },
        { header: 'price_type', key: 'price_type', width: 16 },
        { header: 'description', key: 'description', width: 40 },
        { header: 'link_url', key: 'link_url', width: 40 },
        { header: 'price', key: 'price', width: 12 },
    ] as const;

    public static mapRow(item: any) {
        return {
            date: item.date,
            price_type: item.priceType,
            description: item.description,
            link_url: item.linkUrl,
            price: item.price,
        };
    }

    public static mapTextRow(item: any) {
        const row = FileExtractorUtils.mapRow(item);
        return {
            ...row,
            date: row.date ? new Date(row.date).toISOString().slice(0, 10) : '',
            price: row.price != null ? Number(row.price).toFixed(2) : '',
        };
    }

}