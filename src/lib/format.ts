import Decimal from "decimal.js";

// DISPLAY ONLY. This module never performs financial computation: no currency
// conversion, no summing of holdings, no P&L math. Those numbers come from the
// backend (with ?currency where applicable). Here we only format strings for
// reading. Money values from the API are Decimal strings — we use decimal.js to
// parse/round for display, never Number/parseFloat.

const FA_LOCALE = "fa-IR";

export type CurrencyCode = "IRR" | "USD";

const CURRENCY_LABEL: Record<CurrencyCode, string> = {
  IRR: "ریال",
  USD: "دلار",
};

/** Format a Decimal-string money value with Persian thousands separators. */
export function formatMoney(
  value: string | null | undefined,
  currency?: CurrencyCode,
  maxFractionDigits = 2,
): string {
  if (value === null || value === undefined || value === "") return "—";
  let dec: Decimal;
  try {
    dec = new Decimal(value);
  } catch {
    return "—";
  }
  const fixed = dec.toFixed(maxFractionDigits);
  const formatted = new Intl.NumberFormat(FA_LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFractionDigits,
  }).format(Number(fixed));
  // Number() here is only for the formatter input after decimal.js rounding;
  // the source of truth value is never stored as a JS number.
  return currency ? `${formatted} ${CURRENCY_LABEL[currency]}` : formatted;
}

/** Format a Decimal-string ratio (e.g. "0.1234") as a Persian percentage. */
export function formatPercent(
  value: string | null | undefined,
  fractionDigits = 2,
): string {
  if (value === null || value === undefined || value === "") return "—";
  let dec: Decimal;
  try {
    dec = new Decimal(value);
  } catch {
    return "—";
  }
  const pct = dec.times(100).toFixed(fractionDigits);
  return `${new Intl.NumberFormat(FA_LOCALE, { maximumFractionDigits: fractionDigits }).format(Number(pct))}٪`;
}

/** Plain quantity (asset amount) formatting, more fraction digits allowed. */
export function formatQuantity(value: string | null | undefined, maxFractionDigits = 8): string {
  if (value === null || value === undefined || value === "") return "—";
  try {
    const dec = new Decimal(value);
    return new Intl.NumberFormat(FA_LOCALE, { maximumFractionDigits: maxFractionDigits }).format(
      Number(dec.toFixed(maxFractionDigits)),
    );
  } catch {
    return "—";
  }
}

export function currencyLabel(currency: CurrencyCode): string {
  return CURRENCY_LABEL[currency];
}
