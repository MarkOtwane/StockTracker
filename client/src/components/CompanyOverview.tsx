import { Card, CardContent } from "@/components/ui/card";
import { CompanyQuote } from "@shared/types";
import { Skeleton } from "@/components/ui/skeleton";

type CompanyOverviewProps = {
  data: CompanyQuote;
};

export default function CompanyOverview({ data }: CompanyOverviewProps) {
  const { 
    symbol, 
    shortName, 
    regularMarketPrice,
    regularMarketChange,
    regularMarketChangePercent,
    longBusinessSummary,
    regularMarketOpen,
    regularMarketDayHigh,
    regularMarketDayLow,
    regularMarketVolume,
    fiftyTwoWeekHigh,
    fiftyTwoWeekLow,
    marketCap,
    exchange
  } = data;

  const logoUrl = `https://logo.clearbit.com/${shortName?.split(' ')[0]?.toLowerCase()}.com`;
  
  // Format price change with sign and color
  const priceChangeIsPositive = regularMarketChange >= 0;
  const formattedPriceChange = `${priceChangeIsPositive ? '+' : ''}${regularMarketChange.toFixed(2)} (${regularMarketChangePercent.toFixed(2)}%)`;
  
  // Format large numbers (market cap, etc.)
  const formatLargeNumber = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <section className="mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="md:w-1/4 flex justify-center">
              <div className="h-24 w-24 rounded-lg bg-white p-2 border border-gray-200 flex items-center justify-center overflow-hidden">
                <img
                  src={logoUrl}
                  alt={`${shortName} logo`}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=' + symbol;
                  }}
                />
              </div>
            </div>
            <div className="md:w-3/4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{shortName}</h2>
                  <p className="text-sm text-muted-foreground mb-1">{symbol} - {exchange}</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className="text-2xl font-mono font-medium">${regularMarketPrice.toFixed(2)}</span>
                  <span className={`ml-2 px-2 py-1 text-sm font-medium rounded text-white ${priceChangeIsPositive ? 'bg-emerald-600' : 'bg-red-600'}`}>
                    {formattedPriceChange}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Market Cap</p>
                  <p className="font-mono font-medium">{formatLargeNumber(marketCap)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">52 Week Range</p>
                  <p className="font-mono">${fiftyTwoWeekLow.toFixed(2)} - ${fiftyTwoWeekHigh.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Day Range</p>
                  <p className="font-mono">${regularMarketDayLow.toFixed(2)} - ${regularMarketDayHigh.toFixed(2)}</p>
                </div>
              </div>

              <p className="text-sm line-clamp-3 md:line-clamp-none">{longBusinessSummary}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
