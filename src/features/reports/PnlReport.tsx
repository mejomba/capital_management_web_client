import {
  Card,
  CardContent,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { CurrencyValue } from "@/components/common/CurrencyValue";
import { PeriodFilter, toISODate, type PeriodValue } from "@/components/common/PeriodFilter";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import { usePnl } from "@/hooks/useReports";

type GroupBy = "class" | "account" | "asset";

export function PnlReport() {
  const [period, setPeriod] = useState<PeriodValue>({ from: null, to: null });
  const [groupBy, setGroupBy] = useState<GroupBy>("class");

  const { data, isLoading, isError, error } = usePnl({
    from: toISODate(period.from),
    to: toISODate(period.to),
    group_by: groupBy,
  });

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
        <PeriodFilter value={period} onChange={setPeriod} />
        <TextField
          select
          size="small"
          label="گروه‌بندی"
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value as GroupBy)}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="class">کلاس دارایی</MenuItem>
          <MenuItem value="account">حساب</MenuItem>
          <MenuItem value="asset">دارایی</MenuItem>
        </TextField>
      </Stack>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState error={error} />
      ) : data ? (
        <>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Card sx={{ flex: 1, minWidth: 220 }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  سود/زیان محقق‌شده
                </Typography>
                <CurrencyValue irr={data.realized.irr} usd={data.realized.usd} signed />
              </CardContent>
            </Card>
            <Card sx={{ flex: 1, minWidth: 220 }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  سود/زیان محقق‌نشده
                </Typography>
                <CurrencyValue irr={data.unrealized.irr} usd={data.unrealized.usd} signed />
              </CardContent>
            </Card>
          </Stack>

          {data.groups.length === 0 ? (
            <EmptyState>داده‌ای برای این بازه نیست.</EmptyState>
          ) : (
            <Card>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>گروه</TableCell>
                    <TableCell>محقق‌شده</TableCell>
                    <TableCell>محقق‌نشده</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.groups.map((g) => (
                    <TableRow key={g.key}>
                      <TableCell>{g.key}</TableCell>
                      <TableCell>
                        <CurrencyValue irr={g.realized_irr} usd={g.realized_usd} signed />
                      </TableCell>
                      <TableCell>
                        <CurrencyValue irr={g.unrealized_irr} usd={g.unrealized_usd} signed />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </>
      ) : null}
    </Stack>
  );
}
