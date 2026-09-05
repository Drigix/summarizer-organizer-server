import { StockPrice } from "./stock-price.model";

export interface StockQuote extends StockPrice {
  open: number | null;
  high: number | null;
  low: number | null;
  previousClose: number | null;
  change: number | null;
  percentChange: number | null;
  volume: number | null;
  isMarketOpen: boolean | null;
}
