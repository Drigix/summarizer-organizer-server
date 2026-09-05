export interface StockPrice {
  symbol: string;
  price: number;
  currency: string | null;
  exchange: string | null;
  datetime: string | null;
  timestamp: number | null;
}