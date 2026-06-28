import { Card, CardContent, Stack, Typography } from "@mui/material";
import { useState } from "react";

import { PeriodFilter, toISOEnd, toISOStart, type PeriodValue } from "@/components/common/PeriodFilter";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import type { components } from "@/api/generated/schema";
import { useCurrency } from "@/context/CurrencyContext";
import { usePerformance } from "@/hooks/useReports";
import { formatPercent } from "@/lib/format";

type PerfMetrics = components["schemas"]["PerfMetrics"];

const METRIC_LABELS: { key: keyof PerfMetrics; label: string }[] = [
  { key: "xirr", label: "XIRR (پول‌وزنی، سالانه)" },
  { key: "twr", label: "TWR (زمان‌وزنی)" },
  { key: "nominal", label: "بازدهی اسمی" },
  { key: "real", label: "بازدهی حقیقی (تعدیل تورم)" },
];

function MetricsCard({ title, metrics }: { title: string; metrics: PerfMetrics }) {
  return (
    <Card sx={{ flex: 1, minWidth: 260 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Stack spacing={1}>
          {METRIC_LABELS.map((m) => (
            <Stack key={m.key} direction="row" justifyContent="space-between">
              <Typography color="text.secondary">{m.label}</Typography>
              <Typography fontWeight={600}>{formatPercent(metrics[m.key])}</Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

export function PerformanceReport() {
  const [period, setPeriod] = useState<PeriodValue>({ from: null, to: null });
  const { active } = useCurrency();
  const enabled = Boolean(period.from && period.to);

  const { data, isLoading, isError, error } = usePerformance(
    { from: toISOStart(period.from) ?? "", to: toISOEnd(period.to) ?? "" },
    enabled,
  );

  return (
    <Stack spacing={2}>
      <PeriodFilter value={period} onChange={setPeriod} />
      {!enabled ? (
        <EmptyState>بازه‌ی زمانی را انتخاب کنید.</EmptyState>
      ) : isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState error={error} />
      ) : data ? (
        <>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            {active.includes("IRR") && <MetricsCard title="ریالی" metrics={data.irr} />}
            {active.includes("USD") && <MetricsCard title="دلاری (بومی)" metrics={data.usd} />}
          </Stack>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">تورم انباشته‌ی بازه</Typography>
                <Typography fontWeight={600}>{formatPercent(data.inflation_cumulative)}</Typography>
              </Stack>
            </CardContent>
          </Card>
        </>
      ) : null}
    </Stack>
  );
}
