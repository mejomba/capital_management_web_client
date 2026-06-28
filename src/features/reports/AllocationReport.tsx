import {
  Card,
  CardContent,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { AllocationPie } from "@/components/charts/AllocationPie";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import { useCurrency } from "@/context/CurrencyContext";
import { useAllocation } from "@/hooks/useReports";
import { ASSET_CLASS_LABELS, type AssetClass } from "@/lib/enums";
import { formatMoney, formatPercent } from "@/lib/format";

const ACTION_LABELS: Record<string, string> = { buy: "خرید", sell: "فروش", hold: "نگه‌داری" };

export function AllocationReport() {
  const { active } = useCurrency();
  const currency = active.length === 1 ? active[0] : "IRR";
  const { data, isLoading, isError, error } = useAllocation({ currency });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState error={error} />;
  if (!data || Object.keys(data.current).length === 0) {
    return <EmptyState>دارایی ارزش‌گذاری‌شده‌ای برای نمایش نیست.</EmptyState>;
  }

  const current = data.current as Record<string, string>;
  const target = data.target as Record<string, string>;
  const drift = data.drift as Record<string, string>;
  const keys = Array.from(new Set([...Object.keys(target), ...Object.keys(current)]));

  return (
    <Stack spacing={2}>
      <Typography color="text.secondary">
        ارزش کل: {formatMoney(data.total_value, currency)} — مبنای محاسبه: {currency === "USD" ? "دلار" : "ریال"}
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" mb={1}>
            ترکیب فعلی
          </Typography>
          <AllocationPie current={current} />
        </CardContent>
      </Card>

      <Card>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>کلاس</TableCell>
              <TableCell>فعلی</TableCell>
              <TableCell>هدف</TableCell>
              <TableCell>انحراف</TableCell>
              <TableCell>پیشنهاد بازتعادل</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {keys.map((k) => {
              const rb = data.rebalance.find((r) => r.asset_class === k);
              return (
                <TableRow key={k}>
                  <TableCell>{ASSET_CLASS_LABELS[k as AssetClass] ?? k}</TableCell>
                  <TableCell>{formatPercent(current[k])}</TableCell>
                  <TableCell>{formatPercent(target[k])}</TableCell>
                  <TableCell>{formatPercent(drift[k])}</TableCell>
                  <TableCell>
                    {rb && rb.action !== "hold" ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          size="small"
                          color={rb.action === "buy" ? "success" : "error"}
                          label={ACTION_LABELS[rb.action] ?? rb.action}
                        />
                        <span>{formatMoney(rb.amount, currency)}</span>
                      </Stack>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </Stack>
  );
}
