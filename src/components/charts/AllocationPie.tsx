import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { ASSET_CLASS_LABELS, type AssetClass } from "@/lib/enums";
import { formatPercent } from "@/lib/format";

const COLORS = ["#1f6f54", "#8a5cf6", "#e0a106", "#d6455b", "#2f80ed", "#16a085", "#9b59b6", "#7f8c8d"];

// `current` is the backend-computed weight map {asset_class: ratio}. Display only.
export function AllocationPie({ current }: { current: Record<string, string> }) {
  const data = Object.entries(current)
    .map(([k, v]) => ({ name: ASSET_CLASS_LABELS[k as AssetClass] ?? k, value: Number(v) }))
    .filter((d) => d.value > 0);

  if (data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={110} label={(d) => d.name}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v) => formatPercent(String(v))}
          contentStyle={{ direction: "rtl", fontFamily: "Vazirmatn" }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
