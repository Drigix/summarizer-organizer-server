export class StockSymbolUtils {

    static isStockSymbolForYahooFinance(symbol: string): boolean {
        return this.isGpwStockSymbol(symbol) || this.isDeStockSymbol(symbol);
    }

    static isGpwStockSymbol(symbol: string): boolean {
        return symbol.endsWith('.WA');
    }

    static isDeStockSymbol(symbol: string): boolean {
        return symbol.endsWith('.DE');
    }
}