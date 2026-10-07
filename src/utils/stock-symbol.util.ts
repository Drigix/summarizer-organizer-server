export class StockSymbolUtils {

    static isStockSymbolForYahooFinance(symbol: string): boolean {
        return this.isGpwStockSymbol(symbol) ||
    }

    static isGpwStockSymbol(symbol: string): boolean {
        return symbol.endsWith('.WA');
    }
}