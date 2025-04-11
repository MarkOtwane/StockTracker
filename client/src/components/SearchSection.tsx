import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

type SearchSectionProps = {
  onSymbolSubmit: (symbol: string) => void;
};

export default function SearchSection({ onSymbolSubmit }: SearchSectionProps) {
  const [symbol, setSymbol] = useState<string>("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol.trim()) {
      onSymbolSubmit(symbol.trim().toUpperCase());
    }
  };

  return (
    <section className="mb-8">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-medium mb-4">Search Stock Data</h2>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <Label htmlFor="stock-symbol" className="mb-1">Stock Symbol</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="stock-symbol"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="Enter stock symbol (e.g., AAPL)"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Enter a valid stock symbol like AAPL, MSFT, AMZN
              </p>
            </div>
            <div className="flex items-end">
              <Button type="submit" className="px-6">
                <Search className="mr-1 h-4 w-4" />
                Search
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
