import { useTheme } from "@mui/material";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { components } from "@/api/generated/schema";
import { formatMoney } from "@/lib/format";
import { toJalaliDate } from "@/lib/jalali";

type PriceOut = components["schemas"]["PriceOut"];

export function PriceSeriesChart({ prices }: { prices: PriceOut[] }) {
  const theme = useTheme();
  // Oldest -> newest for a left-to-right time axis (display only; no math).
  const data = [...prices]
    .sort((a, b) => a.as_of.localeCompare(b.as_of))
    .map((p) => ({ as_of: toJalaliDate(p.as_of), price: Number(p.price) }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="as_of" reversed tick={{ fontSize: 12 }} />
        <YAxis
          orientation="right"
          tick={{ fontSize: 12 }}
          width={90}
          tickFormatter={(v: number) => new Intl.NumberFormat("fa-IR", { notation: "compact" }).format(v)}
        />
        <Tooltip
          formatter={(v) => formatMoney(String(v))}
          labelStyle={{ direction: "rtl" }}
          contentStyle={{ direction: "rtl", fontFamily: "Vazirmatn" }}
        />
        <Line type="monotone" dataKey="price" stroke={theme.palette.primary.main} dot={false} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
