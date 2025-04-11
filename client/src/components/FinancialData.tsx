import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import { HistoricalData } from "@shared/types";
import { saveAs } from "file-saver";

const ROWS_PER_PAGE = 5;

type FinancialDataProps = {
  data: HistoricalData | undefined;
  symbol: string;
};

export default function FinancialData({ data, symbol }: FinancialDataProps) {
  const [currentPage, setCurrentPage] = useState(0);
  
  if (!data) {
    return null;
  }
  
  const createFinancialTable = () => {
    const tableData = data.timestamps.map((timestamp, index) => {
      const date = new Date(timestamp * 1000).toLocaleDateString();
      const open = data.opens[index];
      const high = data.highs[index];
      const low = data.lows[index];
      const close = data.closes[index];
      const volume = data.volumes[index];
      
      // Calculate daily change percentage
      const prevClose = index > 0 ? data.closes[index - 1] : open;
      const changeAmount = close - prevClose;
      const changePercent = (changeAmount / prevClose) * 100;
      const isPositive = changeAmount >= 0;
      
      return {
        date,
        open,
        high,
        low,
        close,
        volume,
        changeAmount,
        changePercent,
        isPositive
      };
    });
    
    // Reverse to have newest first
    return tableData.reverse();
  };
  
  const tableData = createFinancialTable();
  const totalPages = Math.ceil(tableData.length / ROWS_PER_PAGE);
  const startIndex = currentPage * ROWS_PER_PAGE;
  const visibleData = tableData.slice(startIndex, startIndex + ROWS_PER_PAGE);
  
  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`;
    return volume.toString();
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const downloadCSV = () => {
    // Create CSV content
    const headers = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume', 'Change (%)'];
    const rows = tableData.map(row => [
      row.date,
      row.open.toFixed(2),
      row.high.toFixed(2),
      row.low.toFixed(2),
      row.close.toFixed(2),
      row.volume,
      `${row.changePercent >= 0 ? '+' : ''}${row.changePercent.toFixed(2)}%`
    ]);
    
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\n';
    });
    
    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${symbol}_stock_data.csv`);
  };

  return (
    <section className="mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-xl font-medium">Financial Data</h2>
            <div className="mt-2 md:mt-0">
              <Button 
                onClick={downloadCSV} 
                variant="secondary"
                className="flex items-center"
              >
                <Download className="mr-1 h-4 w-4" />
                Download CSV
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Open</TableHead>
                  <TableHead>High</TableHead>
                  <TableHead>Low</TableHead>
                  <TableHead>Close</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleData.map((row, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell>{row.date}</TableCell>
                    <TableCell className="font-mono">${row.open.toFixed(2)}</TableCell>
                    <TableCell className="font-mono">${row.high.toFixed(2)}</TableCell>
                    <TableCell className="font-mono">${row.low.toFixed(2)}</TableCell>
                    <TableCell className="font-mono">${row.close.toFixed(2)}</TableCell>
                    <TableCell className="font-mono">{formatVolume(row.volume)}</TableCell>
                    <TableCell 
                      className={`font-mono ${row.isPositive ? 'text-emerald-600' : 'text-red-600'}`}
                    >
                      {row.isPositive ? '+' : ''}{row.changePercent.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(startIndex + ROWS_PER_PAGE, tableData.length)} of {tableData.length} days
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToPrevPage}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button 
                variant={currentPage < totalPages - 1 ? "default" : "outline"}
                size="sm" 
                onClick={goToNextPage}
                disabled={currentPage >= totalPages - 1}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
