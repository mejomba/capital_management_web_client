import {
  Card,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { useState } from "react";

import { PeriodFilter, toISOEnd, toISOStart, type PeriodValue } from "@/components/common/PeriodFilter";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import { useInflationComparison } from "@/hooks/useReports";
import { HURDLE_MODE_LABELS, type HurdleMode } from "@/lib/enums";
import { formatPercent } from "@/lib/format";

function PassChip({ value }: { value: boolean | null | undefined }) {
  if (value == null) return <span>—</span>;
  return (
    <Chip size="small" color={value ? "success" : "error"} label={value ? "عبور کرده" : "عبور نکرده"} />
  );
}

export function InflationReport() {
  const [period, setPeriod] = useState<PeriodValue>({ from: null, to: null });
  const enabled = Boolean(period.from && period.to);
  const { data, isLoading, isError, error } = useInflationComparison(
    { from: toISOStart(period.from) ?? "", to: toISOEnd(period.to) ?? "" },
    enabled,
  );

  const hurdle = data?.hurdle as { mode?: string; rate?: string } | undefined;

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
        <Card>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>بازدهی اسمی (ریالی)</TableCell>
                <TableCell>{formatPercent(data.nominal_irr)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>بازدهی حقیقی (ریالی)</TableCell>
                <TableCell>{formatPercent(data.real_irr)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>بازدهی دلاری (بومی)</TableCell>
                <TableCell>{formatPercent(data.usd_based)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>تورم انباشته</TableCell>
                <TableCell>{formatPercent(data.inflation)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  حداقل سود مورد انتظار
                  {hurdle?.mode ? ` (${HURDLE_MODE_LABELS[hurdle.mode as HurdleMode] ?? hurdle.mode})` : ""}
                </TableCell>
                <TableCell>{formatPercent(hurdle?.rate)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>عبور از تورم</TableCell>
                <TableCell>
                  <PassChip value={data.beats_inflation} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>عبور از آستانه</TableCell>
                <TableCell>
                  <PassChip value={data.beats_hurdle} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      ) : null}
    </Stack>
  );
}
