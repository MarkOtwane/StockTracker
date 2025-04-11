import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { HistoricalData } from "@shared/types";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";

type StockChartProps = {
  data: HistoricalData | undefined;
  isLoading: boolean;
  symbol: string;
  currentPeriod: string;
  onPeriodChange: (period: string) => void;
};

export default function StockChart({ 
  data, 
  isLoading, 
  symbol, 
  currentPeriod,
  onPeriodChange 
}: StockChartProps) {
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  
  const periods = [
    { label: "1M", value: "1m" },
    { label: "3M", value: "3m" },
    { label: "6M", value: "6m" },
    { label: "1Y", value: "1y" },
    { label: "5Y", value: "5y" }
  ];
  
  if (isLoading || !data) {
    return (
      <section className="mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <h2 className="text-xl font-medium">Price History</h2>
              <div className="flex gap-2 mt-2 md:mt-0">
                {periods.map((period) => (
                  <Skeleton key={period.value} className="h-8 w-10" />
                ))}
              </div>
            </div>
            <Skeleton className="w-full h-[400px]" />
          </CardContent>
        </Card>
      </section>
    );
  }
  
  const chartData = data.timestamps.map((timestamp, index) => ({
    date: new Date(timestamp * 1000).toLocaleDateString(),
    price: data.closes[index],
    volume: data.volumes[index],
  }));
  
  const minPrice = Math.min(...data.closes) * 0.995;
  const maxPrice = Math.max(...data.closes) * 1.005;
  
  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };
  
  const toggleChartType = () => {
    setChartType(chartType === 'line' ? 'area' : 'line');
  };

  return (
    <section className="mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h2 className="text-xl font-medium">Price History</h2>
            <div className="flex gap-2 mt-2 md:mt-0">
              {periods.map((period) => (
                <Button 
                  key={period.value}
                  variant={currentPeriod === period.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPeriodChange(period.value)}
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }} 
                    tickMargin={10}
                    tickFormatter={(value) => {
                      // Show fewer ticks on smaller screens
                      if (window.innerWidth < 768 && chartData.length > 30) {
                        const index = chartData.findIndex(item => item.date === value);
                        return index % 5 === 0 ? value : '';
                      }
                      return value;
                    }}
                  />
                  <YAxis 
                    domain={[minPrice, maxPrice]} 
                    tickFormatter={formatCurrency} 
                    width={70}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Price']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="hsl(var(--primary))" 
                    dot={false}
                    strokeWidth={2}
                  />
                </LineChart>
              ) : (
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }} 
                    tickMargin={10}
                    tickFormatter={(value) => {
                      // Show fewer ticks on smaller screens
                      if (window.innerWidth < 768 && chartData.length > 30) {
                        const index = chartData.findIndex(item => item.date === value);
                        return index % 5 === 0 ? value : '';
                      }
                      return value;
                    }}
                  />
                  <YAxis 
                    domain={[minPrice, maxPrice]} 
                    tickFormatter={formatCurrency} 
                    width={70}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Price']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="hsl(var(--primary))" 
                    fill="hsla(var(--primary), 0.1)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleChartType}
              className="flex items-center"
            >
              <BarChart3 className="mr-1 h-4 w-4" />
              <span>Switch to {chartType === 'line' ? 'Area' : 'Line'} Chart</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
