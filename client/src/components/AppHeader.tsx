import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, TrendingUp } from "lucide-react";

export default function AppHeader() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <TrendingUp className="mr-2 h-6 w-6" />
          <h1 className="text-2xl font-medium">Stock Data Analyzer</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="text-white hover:bg-primary/90"
          >
            {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
          </Button>
          <a href="#" className="text-sm hover:underline">About</a>
          <a href="#" className="text-sm hover:underline">Help</a>
        </div>
      </div>
    </header>
  );
}
