import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { KeyStats } from "@shared/types";

type KeyMetricsProps = {
  data: KeyStats | undefined;
  isLoading: boolean;
};

export default function KeyMetrics({ data, isLoading }: KeyMetricsProps) {
  if (isLoading) {
    return (
      <section className="mb-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-medium mb-6">Key Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="h-32" />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }
  
  if (!data) {
    return null;
  }
  
  // Format metrics
  const formatMetric = (value: number | undefined, type: 'percent' | 'number' | 'currency') => {
    if (value === undefined || value === null) return 'N/A';
    
    if (type === 'percent') {
      return `${value.toFixed(2)}%`;
    } else if (type === 'currency') {
      return `$${value.toFixed(2)}`;
    } else {
      return value.toFixed(2);
    }
  };
  
  // Format large numbers (volume)
  const formatLargeNumber = (num: number | undefined): string => {
    if (num === undefined || num === null) return 'N/A';
    
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toString();
  };

  return (
    <section className="mb-8">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-medium mb-6">Key Metrics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-muted/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Earnings Per Share (EPS)</p>
              <p className="text-xl font-mono font-medium">
                {formatMetric(data.trailingEps, 'currency')}
              </p>
              <div className="mt-2 flex items-center text-sm">
                {data.epsTrailingTwelveMonthsGrowth > 0 ? (
                  <>
                    <ArrowUpIcon className="text-emerald-600 mr-1 h-4 w-4" />
                    <span className="text-emerald-600">
                      +{formatMetric(data.epsTrailingTwelveMonthsGrowth * 100, 'percent')} YoY
                    </span>
                  </>
                ) : (
                  <>
                    <ArrowDownIcon className="text-red-600 mr-1 h-4 w-4" />
                    <span className="text-red-600">
                      {formatMetric(data.epsTrailingTwelveMonthsGrowth * 100, 'percent')} YoY
                    </span>
                  </>
                )}
              </div>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Dividend Yield</p>
              <p className="text-xl font-mono font-medium">
                {formatMetric(data.dividendYield * 100, 'percent')}
              </p>
              {data.fiveYearAvgDividendYield && (
                <div className="mt-2 flex items-center text-sm">
                  {data.dividendYield > data.fiveYearAvgDividendYield / 100 ? (
                    <>
                      <ArrowUpIcon className="text-emerald-600 mr-1 h-4 w-4" />
                      <span className="text-emerald-600">
                        Above 5-year avg
                      </span>
                    </>
                  ) : (
                    <>
                      <ArrowDownIcon className="text-red-600 mr-1 h-4 w-4" />
                      <span className="text-red-600">
                        Below 5-year avg
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="bg-muted/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Beta</p>
              <p className="text-xl font-mono font-medium">{formatMetric(data.beta, 'number')}</p>
              <p className="mt-2 text-xs text-muted-foreground">Volatility vs S&P 500</p>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Average Volume</p>
              <p className="text-xl font-mono font-medium">
                {formatLargeNumber(data.averageVolume)}
              </p>
              {data.averageVolume && data.averageVolume10days && (
                <div className="mt-2 flex items-center text-sm">
                  {data.averageVolume > data.averageVolume10days ? (
                    <>
                      <ArrowUpIcon className="text-emerald-600 mr-1 h-4 w-4" />
                      <span className="text-emerald-600">
                        +{((data.averageVolume / data.averageVolume10days - 1) * 100).toFixed(1)}% vs 10-day
                      </span>
                    </>
                  ) : (
                    <>
                      <ArrowDownIcon className="text-red-600 mr-1 h-4 w-4" />
                      <span className="text-red-600">
                        {((data.averageVolume / data.averageVolume10days - 1) * 100).toFixed(1)}% vs 10-day
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
