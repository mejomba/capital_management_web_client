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
import { toJalaliDate } from "@/lib/jalali";

type NetWorthPoint = components["schemas"]["NetWorthPoint"];

// Display only: plots the backend's net-worth series for the active currency
// field(s). No conversion or summation happens here.
export function NetWorthChart({ series }: { series: NetWorthPoint[] }) {
  const theme = useTheme();
  const { active } = useCurrency();

  const data = series.map((p) => ({
    as_of: toJalaliDate(p.as_of),
    irr: p.net_worth_irr != null ? Number(p.net_worth_irr) : null,
    usd: p.net_worth_usd != null ? Number(p.net_worth_usd) : null,
  }));

  const lines = active.map((cur) => ({
    key: cur === "USD" ? ("usd" as const) : ("irr" as const),
    name: cur === "USD" ? "ارزش خالص (دلار)" : "ارزش خالص (ریال)",
    color: cur === "USD" ? theme.palette.secondary.main : theme.palette.primary.main,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="as_of" reversed tick={{ fontSize: 12 }} />
        <YAxis
          orientation="right"
          width={90}
          tick={{ fontSize: 12 }}
          tickFormatter={(v: number) => new Intl.NumberFormat("fa-IR", { notation: "compact" }).format(v)}
        />
        <Tooltip
          formatter={(v) => formatMoney(String(v))}
          contentStyle={{ direction: "rtl", fontFamily: "Vazirmatn" }}
        />
        <Legend />
        {lines.map((l) => (
          <Line
            key={l.key}
            type="monotone"
            dataKey={l.key}
            name={l.name}
            stroke={l.color}
            dot={false}
            strokeWidth={2}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
