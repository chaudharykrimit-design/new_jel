import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

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

// Fallback rates (approximate market rates as of March 2025 — used only if API fails)
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

// Metals.dev API key – free tier (50 req/month). 
// For production, move this to an environment variable.
const METALS_API_KEY = "DEMO_KEY"; // Replace with your actual key from https://metals.dev

// Cache key for localStorage
const CACHE_KEY = "aurum_metal_rates";
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

// How often to auto-refresh (in ms)
const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

const GoldRateContext = createContext<GoldRateContextType | undefined>(undefined);

/**
 * Convert 24K gold rate to other karats
 * 24K = 99.9% pure gold
 * 22K = 91.6% pure gold (22/24)
 * 18K = 75.0% pure gold (18/24)
 */
const convertKarat = (rate24k: number, karat: number): number => {
  return Math.round(rate24k * (karat / 24));
};

/**
 * Try to load cached rates from localStorage
 */
const getCachedRates = (): MetalRates | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const { rates, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    
    // If cache is fresh enough, use it
    if (age < CACHE_EXPIRY_MS) {
      return {
        ...rates,
        isLive: true,
        isLoading: false,
        error: null,
      };
    }
    
    // Return stale cache as fallback (still better than hardcoded)
    return {
      ...rates,
      isLive: false,
      isLoading: false,
      error: null,
    };
  } catch {
    return null;
  }
};

/**
 * Save rates to localStorage cache
 */
const setCachedRates = (rates: MetalRates) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      rates,
      timestamp: Date.now(),
    }));
  } catch {
    // localStorage might be full or disabled
  }
};

export const GoldRateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rates, setRates] = useState<MetalRates>(() => {
    // Initialize from cache if available
    const cached = getCachedRates();
    return cached || FALLBACK_RATES;
  });
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isFetchingRef = useRef(false);

  const fetchRates = useCallback(async () => {
    // Prevent concurrent fetches
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      // Fetch from metals.dev API with INR currency and grams unit
      const response = await fetch(
        `https://api.metals.dev/v1/latest?api_key=${METALS_API_KEY}&currency=INR&unit=g`,
        {
          headers: { "Accept": "application/json" },
        }
      );

      if (!response.ok) {
        let errMsg = `API returned ${response.status}`;
        try {
          const errData = await response.json();
          if (errData.error && errData.error.message) {
            errMsg = errData.error.message;
          }
        } catch (_) {}
        throw new Error(errMsg);
      }

      const data = await response.json();

      if (data.status !== "success") {
        throw new Error(data.error_message || "API returned failure status");
      }

      // Extract rates from API response
      // data.metals.gold = price per gram in INR (this is 24K spot price)
      // data.metals.silver = price per gram in INR
      // data.metals.platinum = price per gram in INR
      const gold24k = Math.round(data.metals.gold);
      const silver = Math.round(data.metals.silver);
      const platinum = Math.round(data.metals.platinum || 0);

      const newRates: MetalRates = {
        gold24k,
        gold22k: convertKarat(gold24k, 22),
        gold18k: convertKarat(gold24k, 18),
        silver,
        platinum,
        lastUpdated: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        isLive: true,
        isLoading: false,
        error: null,
      };

      setRates(newRates);
      setCachedRates(newRates);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch rates";
      console.warn("Metals API fallback use: ", errorMessage);
      if (errorMessage.toLowerCase().includes("api key") || errorMessage.includes("500") || errorMessage.includes("429")) {
        console.warn("Tip: Your DEMO_KEY for api.metals.dev has reached its free limit. Using fallback jewelry rates for now.");
      }
      
      // If we already have rates (from cache or previous fetch), keep them but mark the error
      setRates(prev => ({
        ...prev,
        isLive: false,
        isLoading: false,
        error: errorMessage,
      }));
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  // Fetch on mount + set up auto-refresh interval
  useEffect(() => {
    fetchRates();

    intervalRef.current = setInterval(fetchRates, REFRESH_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
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
