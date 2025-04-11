import yahooFinance from "yahoo-finance2";
import type { CompanyQuote, HistoricalData, KeyStats } from "@shared/types";

/**
 * Fetches the stock quote data for a given symbol
 */
export async function fetchQuote(symbol: string): Promise<CompanyQuote> {
  try {
    const quote = await yahooFinance.quote(symbol);
    
    // Map to our CompanyQuote interface
    return {
      symbol: quote.symbol,
      shortName: quote.shortName || quote.longName || quote.symbol,
      longName: quote.longName,
      longBusinessSummary: quote.longBusinessSummary,
      exchange: quote.fullExchangeName || quote.exchange,
      quoteType: quote.quoteType,
      regularMarketPrice: quote.regularMarketPrice,
      regularMarketChange: quote.regularMarketChange,
      regularMarketChangePercent: quote.regularMarketChangePercent,
      regularMarketOpen: quote.regularMarketOpen,
      regularMarketDayHigh: quote.regularMarketDayHigh,
      regularMarketDayLow: quote.regularMarketDayLow,
      regularMarketVolume: quote.regularMarketVolume,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
      marketCap: quote.marketCap,
      trailingPE: quote.trailingPE,
      forwardPE: quote.forwardPE
    };
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    throw new Error(`Failed to fetch quote data for ${symbol}`);
  }
}

/**
 * Maps period string to Yahoo Finance period and interval parameters
 */
function getPeriodParams(period: string): { period1: Date, period2: Date, interval: string } {
  const now = new Date();
  let startDate = new Date();
  let interval = "1d"; // Default interval
  
  switch (period) {
    case "1m":
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case "3m":
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case "6m":
      startDate.setMonth(startDate.getMonth() - 6);
      break;
    case "1y":
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    case "5y":
      startDate.setFullYear(startDate.getFullYear() - 5);
      interval = "1wk"; // Weekly interval for longer periods
      break;
    default:
      startDate.setMonth(startDate.getMonth() - 1); // Default to 1 month
  }
  
  return {
    period1: startDate,
    period2: now,
    interval
  };
}

/**
 * Fetches historical data for a given symbol and time period
 */
export async function fetchHistoricalData(symbol: string, period: string = "1m"): Promise<HistoricalData> {
  try {
    const { period1, period2, interval } = getPeriodParams(period);
    
    const result = await yahooFinance.historical(symbol, {
      period1,
      period2,
      interval
    });
    
    // Transform the data to match our HistoricalData interface
    const timestamps: number[] = [];
    const opens: number[] = [];
    const highs: number[] = [];
    const lows: number[] = [];
    const closes: number[] = [];
    const volumes: number[] = [];
    
    result.forEach(day => {
      timestamps.push(day.date.getTime() / 1000);
      opens.push(day.open);
      highs.push(day.high);
      lows.push(day.low);
      closes.push(day.close);
      volumes.push(day.volume);
    });
    
    return {
      symbol,
      timestamps,
      opens,
      highs,
      lows,
      closes,
      volumes
    };
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    throw new Error(`Failed to fetch historical data for ${symbol}`);
  }
}

/**
 * Fetches key statistics for a given symbol
 */
export async function fetchKeyStats(symbol: string): Promise<KeyStats> {
  try {
    const [quote, keyStats, defaultKeyStatistics] = await Promise.all([
      yahooFinance.quote(symbol),
      yahooFinance.quoteSummary(symbol, { modules: ["defaultKeyStatistics"] })
        .then(res => res.defaultKeyStatistics),
      yahooFinance.quoteSummary(symbol, { modules: ["financialData"] })
        .then(res => res.financialData)
    ]);
    
    // Calculate EPS growth if possible
    let epsGrowth;
    if (keyStats?.trailingEps?.raw && keyStats?.lastFiscalYearEPS?.raw) {
      const currentEPS = keyStats.trailingEps.raw;
      const lastYearEPS = keyStats.lastFiscalYearEPS.raw;
      epsGrowth = (currentEPS - lastYearEPS) / Math.abs(lastYearEPS);
    }
    
    return {
      symbol,
      beta: quote.beta,
      trailingPE: quote.trailingPE,
      forwardPE: quote.forwardPE,
      marketCap: quote.marketCap,
      trailingEps: keyStats?.trailingEps?.raw,
      epsTrailingTwelveMonthsGrowth: epsGrowth,
      dividendYield: quote.dividendYield,
      fiveYearAvgDividendYield: keyStats?.fiveYearAvgDividendYield?.raw,
      averageVolume: quote.averageVolume,
      averageVolume10days: quote.averageDailyVolume10Day
    };
  } catch (error) {
    console.error(`Error fetching key stats for ${symbol}:`, error);
    throw new Error(`Failed to fetch key statistics for ${symbol}`);
  }
}
