import { Stack, Typography } from "@mui/material";

import { useCurrency } from "@/context/CurrencyContext";
import { formatMoney } from "@/lib/format";

// DISPLAY ONLY. Receives the already-computed dual-currency fields from the API
// and shows the one(s) the global switch selects. It NEVER converts between
// currencies and NEVER sums — those numbers come from the backend.
interface Props {
  irr: string | null | undefined;
  usd: string | null | undefined;
  /** Colour negative values red / positive green (for P&L columns). */
  signed?: boolean;
}

function ValueText({ value, currency, signed }: { value: string | null | undefined; currency: "IRR" | "USD"; signed?: boolean }) {
  const color =
    signed && value != null && value !== ""
      ? value.trim().startsWith("-")
        ? "error.main"
        : "success.main"
      : "text.primary";
  return (
    <Typography variant="body2" sx={{ color, whiteSpace: "nowrap" }}>
      {formatMoney(value, currency)}
    </Typography>
  );
}

export function CurrencyValue({ irr, usd, signed }: Props) {
  const { active } = useCurrency();
  return (
    <Stack spacing={0.25}>
      {active.map((cur) => (
        <ValueText key={cur} value={cur === "USD" ? usd : irr} currency={cur} signed={signed} />
      ))}
    </Stack>
  );
}
