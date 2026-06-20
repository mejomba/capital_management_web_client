import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import type { CurrencyCode } from "@/lib/format";

// ───────────────────────────────────────────────────────────────────────────
// DISPLAY-ONLY currency switch. This context NEVER converts money and NEVER
// sums holdings. Behaviour:
//   • For endpoints that accept ?currency (reports/net-worth, reports/allocation)
//     we forward `apiParam` so the backend computes the figure.
//   • For endpoints that already return both currencies (holdings, pnl, ...)
//     we only SELECT which precomputed field to show via `field`.
// If you ever find yourself multiplying by an FX rate here, stop — ask the API.
// ───────────────────────────────────────────────────────────────────────────

export type CurrencyMode = "IRR" | "USD" | "both";

interface CurrencyContextValue {
  mode: CurrencyMode;
  setMode: (mode: CurrencyMode) => void;
  /** The currencies to display, in order. */
  active: CurrencyCode[];
  /** Value for the `?currency=` API param. */
  apiParam: string;
}

const STORAGE_KEY = "wm.currency";

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<CurrencyMode>(
    () => (localStorage.getItem(STORAGE_KEY) as CurrencyMode) ?? "both",
  );

  const setMode = useCallback((next: CurrencyMode) => {
    localStorage.setItem(STORAGE_KEY, next);
    setModeState(next);
  }, []);

  const value = useMemo<CurrencyContextValue>(() => {
    const active: CurrencyCode[] = mode === "both" ? ["IRR", "USD"] : [mode];
    const apiParam = mode === "both" ? "both" : mode;
    return { mode, setMode, active, apiParam };
  }, [mode, setMode]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

/** Map a currency to the suffix of the dual fields a payload exposes (value_irr/value_usd). */
export function currencyFieldSuffix(currency: CurrencyCode): "irr" | "usd" {
  return currency === "USD" ? "usd" : "irr";
}
