import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/lib/api";

export type MetalRates = {
  gold24k: number;   // per gram in INR
  gold22k: number;   // per gram in INR
  gold18k: number;   // per gram in INR
  silver: number;    // per gram in INR
  platinum: number;  // per gram in INR
  lastUpdated: string;
  isLive: boolean;
  isLoading: boolean;
  error: string | null;
};

type GoldRateContextType = {
  rates: MetalRates;
  refreshRates: () => Promise<void>;
};

// Fallback rates (used primarily for initial render before settings load)
const FALLBACK_RATES: MetalRates = {
  gold24k: 8550,
  gold22k: 7840,
  gold18k: 6413,
  silver: 100,
  platinum: 3150,
  lastUpdated: new Date().toLocaleTimeString("en-IN"),
  isLive: false,
  isLoading: true,
  error: null,
};

const GoldRateContext = createContext<GoldRateContextType | undefined>(undefined);

export const GoldRateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rates, setRates] = useState<MetalRates>(FALLBACK_RATES);
  const isFetchingRef = useRef(false);

  const fetchRates = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      // Fetch settings from our OWN backend (no API key needed!)
      const { settings } = await api.settings.get();
      
      const newRates: MetalRates = {
        gold24k: Number(settings.gold_rate_24k || 8550),
        gold22k: Number(settings.gold_rate_22k || 7840),
        gold18k: Number(settings.gold_rate_18k || 6413),
        silver: Number(settings.silver_rate || 100),
        platinum: Number(settings.platinum_rate || 3150),
        lastUpdated: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isLive: true,
        isLoading: false,
        error: null,
      };

      setRates(newRates);
    } catch (err: unknown) {
      console.warn("Gold Rate fetch failed, using fallbacks: ", err);
      setRates(prev => ({
        ...prev,
        isLoading: false,
        isLive: false,
      }));
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchRates();
    // Refresh every 30 seconds from our own server (very lightweight)
    const interval = setInterval(fetchRates, 30000);
    return () => clearInterval(interval);
  }, [fetchRates]);

  const refreshRates = useCallback(async () => {
    setRates(prev => ({ ...prev, isLoading: true }));
    await fetchRates();
  }, [fetchRates]);

  return (
    <GoldRateContext.Provider value={{ rates, refreshRates }}>
      {children}
    </GoldRateContext.Provider>
  );
};

export const useGoldRates = () => {
  const context = useContext(GoldRateContext);
  if (!context) throw new Error("useGoldRates must be used within GoldRateProvider");
  return context;
};
