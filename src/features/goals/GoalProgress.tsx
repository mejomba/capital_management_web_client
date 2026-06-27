import {
  Box,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import type { components } from "@/api/generated/schema";
import { ASSET_CLASS_LABELS, type AssetClass } from "@/lib/enums";
import { formatMoney, formatPercent } from "@/lib/format";

type GoalDetailOut = components["schemas"]["GoalDetailOut"];

// Renders the backend-computed `progress` object (display only — no recompute).
// Shape varies by goal type, so we read defensively.
type Progress = Record<string, unknown>;

function str(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={600}>{value}</Typography>
    </Stack>
  );
}

function ProgressBar({ percent }: { percent: string | undefined }) {
  if (percent == null) {
    return (
      <Typography color="text.secondary" variant="body2">
        پیشرفت قابل‌محاسبه نیست.
      </Typography>
    );
  }
  const num = Number(percent);
  const clamped = Number.isFinite(num) ? Math.min(100, Math.max(0, num)) : 0;
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" mb={0.5}>
        <Typography variant="body2">پیشرفت</Typography>
        <Typography variant="body2" fontWeight={700}>
          {formatPercent(String(num / 100))}
        </Typography>
      </Stack>
      <LinearProgress variant="determinate" value={clamped} sx={{ height: 10, borderRadius: 5 }} />
    </Box>
  );
}

export function GoalProgress({ goal }: { goal: GoalDetailOut }) {
  const p = (goal.progress ?? {}) as Progress;
  const currency = (goal.currency ?? "IRR") as "IRR" | "USD";
  const percent = str(p.percent);

  if (goal.type === "target_net_worth") {
    return (
      <Stack spacing={2}>
        <ProgressBar percent={percent} />
        <Row label="ارزش خالص فعلی" value={formatMoney(str(p.current_value), currency)} />
        <Row label="هدف" value={formatMoney(str(p.target_value), currency)} />
        <Row label="باقی‌مانده تا هدف" value={formatMoney(str(p.remaining), currency)} />
      </Stack>
    );
  }

  if (goal.type === "target_return") {
    return (
      <Stack spacing={2}>
        <ProgressBar percent={percent} />
        <Row label="بازدهی فعلی" value={formatPercent(str(p.current_return))} />
        <Row label="بازدهی هدف" value={formatPercent(str(p.target_return))} />
      </Stack>
    );
  }

  if (goal.type === "target_allocation") {
    const current = (p.current_allocation ?? {}) as Record<string, string>;
    const target = (p.target_allocation ?? {}) as Record<string, string>;
    const drift = (p.drift ?? {}) as Record<string, string>;
    const keys = Array.from(new Set([...Object.keys(target), ...Object.keys(current)]));
    return (
      <Stack spacing={2}>
        <ProgressBar percent={percent} />
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>کلاس</TableCell>
              <TableCell>فعلی</TableCell>
              <TableCell>هدف</TableCell>
              <TableCell>انحراف</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {keys.map((k) => (
              <TableRow key={k}>
                <TableCell>{ASSET_CLASS_LABELS[k as AssetClass] ?? k}</TableCell>
                <TableCell>{formatPercent(current[k])}</TableCell>
                <TableCell>{formatPercent(target[k])}</TableCell>
                <TableCell>{formatPercent(drift[k])}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>
    );
  }

  // custom
  return <ProgressBar percent={percent} />;
}
