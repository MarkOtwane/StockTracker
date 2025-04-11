import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { fetchQuote, fetchHistoricalData, fetchKeyStats } from "./services/yahoo";

export async function registerRoutes(app: Express): Promise<Server> {
  // Stock quote endpoint
  app.get("/api/stocks/quote", async (req, res) => {
    try {
      const symbol = req.query.symbol as string;
      
      if (!symbol) {
        return res.status(400).json({ message: "Stock symbol is required" });
      }
      
      const quoteData = await fetchQuote(symbol);
      res.json(quoteData);
    } catch (error) {
      console.error("Error fetching stock quote:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch stock data" 
      });
    }
  });
  
  // Historical data endpoint
  app.get("/api/stocks/history", async (req, res) => {
    try {
      const symbol = req.query.symbol as string;
      const period = req.query.period as string || "1m";
      
      if (!symbol) {
        return res.status(400).json({ message: "Stock symbol is required" });
      }
      
      const historicalData = await fetchHistoricalData(symbol, period);
      res.json(historicalData);
    } catch (error) {
      console.error("Error fetching historical data:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch historical data" 
      });
    }
  });
  
  // Key statistics endpoint
  app.get("/api/stocks/key-stats", async (req, res) => {
    try {
      const symbol = req.query.symbol as string;
      
      if (!symbol) {
        return res.status(400).json({ message: "Stock symbol is required" });
      }
      
      const keyStats = await fetchKeyStats(symbol);
      res.json(keyStats);
    } catch (error) {
      console.error("Error fetching key statistics:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch key statistics" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
