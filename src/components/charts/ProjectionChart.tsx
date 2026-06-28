import { useTheme } from "@mui/material";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { components } from "@/api/generated/schema";
import { useCurrency } from "@/context/CurrencyContext";
import { formatMoney } from "@/lib/format";

type ProjectionOut = components["schemas"]["ProjectionOut"];
type Point = components["schemas"]["ProjectionPoint"];

const SCENARIO_LABELS: Record<string, string> = {
  pessimistic: "بدبینانه",
  realistic: "واقع‌بینانه",
  optimistic: "خوش‌بینانه",
};
const SCENARIO_ORDER = ["pessimistic", "realistic", "optimistic"];

// Merges the per-scenario series into one dataset keyed by month. Uses the
// active currency's precomputed field (display only).
export function ProjectionChart({ data }: { data: ProjectionOut }) {
  const theme = useTheme();
  const { active } = useCurrency();
  const useUsd = active[0] === "USD";

  const scenarios = Object.keys(data.scenarios).sort(
    (a, b) => SCENARIO_ORDER.indexOf(a) - SCENARIO_ORDER.indexOf(b),
  );

  const months = data.scenarios[scenarios[0]]?.length ?? 0;
  const rows = Array.from({ length: months }, (_, i) => {
    const row: Record<string, number | string> = { month: i + 1 };
    for (const s of scenarios) {
      const pt: Point | undefined = data.scenarios[s][i];
      const val = useUsd ? pt?.net_worth_usd : pt?.net_worth_irr;
      row[s] = val != null ? Number(val) : 0;
    }
    return row;
  });

  const colors: Record<string, string> = {
    pessimistic: theme.palette.error.main,
    realistic: theme.palette.primary.main,
    optimistic: theme.palette.success.main,
  };

  return (
    <ResponsiveContainer width="100%" height={340}>
      <LineChart data={rows} margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} tickFormatter={(m) => `ماه ${m}`} />
        <YAxis
          orientation="right"
          width={90}
          tick={{ fontSize: 12 }}
          tickFormatter={(v: number) => new Intl.NumberFormat("fa-IR", { notation: "compact" }).format(v)}
        />
        <Tooltip formatter={(v) => formatMoney(String(v))} contentStyle={{ direction: "rtl", fontFamily: "Vazirmatn" }} />
        <Legend />
        {scenarios.map((s) => (
          <Line
            key={s}
            type="monotone"
            dataKey={s}
            name={SCENARIO_LABELS[s] ?? s}
            stroke={colors[s] ?? theme.palette.text.secondary}
            dot={false}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
