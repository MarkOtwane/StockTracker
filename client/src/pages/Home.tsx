import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import SearchSection from "@/components/SearchSection";
import CompanyOverview from "@/components/CompanyOverview";
import StockChart from "@/components/StockChart";
import FinancialData from "@/components/FinancialData";
import KeyMetrics from "@/components/KeyMetrics";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const [symbol, setSymbol] = useState<string>("");
  const [period, setPeriod] = useState<string>("1m");
  
  const { data: stockData, isLoading, error, isError } = useQuery({
    queryKey: ['/api/stocks/quote', symbol],
    enabled: !!symbol,
  });
  
  const { data: historyData, isLoading: isHistoryLoading } = useQuery({
    queryKey: ['/api/stocks/history', symbol, period],
    enabled: !!symbol,
  });
  
  const { data: keyMetricsData, isLoading: isMetricsLoading } = useQuery({
    queryKey: ['/api/stocks/key-stats', symbol],
    enabled: !!symbol,
  });

  const handleSearch = (newSymbol: string) => {
    setSymbol(newSymbol);
  };
  
  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <SearchSection onSymbolSubmit={handleSearch} />
        
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        {isError && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {(error as Error)?.message || "Unable to fetch stock data. Please check the stock symbol and try again."}
            </AlertDescription>
          </Alert>
        )}
        
        {!isLoading && !isError && stockData && (
          <div>
            <CompanyOverview data={stockData} />
            
            <StockChart 
              data={historyData} 
              isLoading={isHistoryLoading} 
              symbol={symbol} 
              currentPeriod={period}
              onPeriodChange={handlePeriodChange}
            />
            
            <FinancialData data={historyData} symbol={symbol} />
            
            <KeyMetrics data={keyMetricsData} isLoading={isMetricsLoading} />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
