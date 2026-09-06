import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { StockPrice } from "src/models/stock-market/stock-price.model";
import { StockQuote } from "src/models/stock-market/stock-quote.model";

@Injectable()
export class MarketDataService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl =
      this.configService.get<string>('TWELVE_DATA_BASE_URL') ??
      'https://api.twelvedata.com';
    this.apiKey =
      this.configService.get<string>('TWELVE_DATA_API_KEY') ?? '';

    if (!this.apiKey) {
      throw new Error('TWELVE_DATA_API_KEY is not configured');
    }
  }

  async getPrice(symbol: string): Promise<StockPrice> {
    const data = await this.request('/price', {
      symbol,
    });
    Logger.debug(`MarketDataService getPrice data: ${JSON.stringify(data)}`);

    if (!data?.price) {
      throw new NotFoundException(
        `Price not found for symbol ${symbol}`,
      );
    }

    return {
      symbol,
      price: Number(data.price),
      currency: null,
      exchange: null,
      datetime: null,
      timestamp: null,
    };
  }

  async getQuote(symbol: string): Promise<StockQuote> {
    const data = await this.request('/quote', {
      symbol,
    });

    if (!data || data.status === 'error') {
      throw new NotFoundException(
        `Quote not found for symbol ${symbol}`,
      );
    }

    return {
      symbol: data.symbol,
      price: Number(data.close),
      currency: data.currency ?? null,
      exchange: data.exchange ?? null,
      datetime: data.datetime ?? null,
      timestamp: data.timestamp
        ? Number(data.timestamp)
        : null,

      open: this.toNumber(data.open),
      high: this.toNumber(data.high),
      low: this.toNumber(data.low),
      previousClose: this.toNumber(data.previous_close),
      change: this.toNumber(data.change),
      percentChange: this.toNumber(data.percent_change),
      volume: this.toNumber(data.volume),

      isMarketOpen:
        typeof data.is_market_open === 'boolean'
          ? data.is_market_open
          : null,
    };
  }

  async getPrices(symbols: string[]): Promise<StockPrice[]> {
    return Promise.all(
      symbols.map((symbol) => this.getPrice(symbol)),
    );
  }

  async getQuotes(symbols: string[]): Promise<StockQuote[]> {
    return Promise.all(
      symbols.map((symbol) => this.getQuote(symbol)),
    );
  }

  async searchSymbol(query: string) {
    const data = await this.request('/symbol_search', {
      symbol: query,
    });

    return data;
  }

  private async request(
    endpoint: string,
    params: Record<string, string>,
  ): Promise<any> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    Object.entries({
      ...params,
      apikey: this.apiKey,
    }).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    Logger.debug(`MarketDataService request URL: ${url.toString()}`);
    const response = await fetch(url);
    Logger.debug(`MarketDataService request response status: ${response}`);
    if (!response.ok) {
      throw new InternalServerErrorException(
        `Market data provider returned ${response.status}`,
      );
    }

    const data = await response.json();

    if (data?.status === 'error') {
      throw new InternalServerErrorException(
        data.message ?? 'Market data provider error',
      );
    }

    return data;
  }

  private toNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const number = Number(value);

    return Number.isFinite(number) ? number : null;
  }
}