// Historical price data
export interface HistoricalData {
  symbol: string;
  timestamps: number[];  // Unix timestamps
  opens: number[];
  highs: number[];
  lows: number[];
  closes: number[];
  volumes: number[];
}

// Company quote data
export interface CompanyQuote {
  symbol: string;
  shortName: string;
  longName?: string;
  longBusinessSummary?: string;
  exchange: string;
  quoteType: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketOpen: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketVolume: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  marketCap: number;
  trailingPE?: number;
  forwardPE?: number;
}

// Key statistics
export interface KeyStats {
  symbol: string;
  beta?: number;
  trailingPE?: number;
  forwardPE?: number;
  marketCap?: number;
  trailingEps?: number;
  epsTrailingTwelveMonthsGrowth?: number;
  dividendYield?: number;
  fiveYearAvgDividendYield?: number;
  averageVolume?: number;
  averageVolume10days?: number;
}

// Error response
export interface ErrorResponse {
  message: string;
}
