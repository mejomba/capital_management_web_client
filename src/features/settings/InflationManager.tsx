import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment-jalaali";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import { createInflationApiV1InflationPostBody as inflationSchema } from "@/api/generated/zod";
import { ControlledTextField } from "@/components/form/ControlledTextField";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import { useCreateInflationRate, useInflationRates } from "@/hooks/useAssumptions";
import { formatPercent } from "@/lib/format";

type FormValues = z.infer<typeof inflationSchema>;

const FA = "۰۱۲۳۴۵۶۷۸۹";
const faNum = (n: number | string) => String(n).replace(/[0-9]/g, (d) => FA[Number(d)]);

export function InflationManager() {
  const list = useInflationRates();
  const create = useCreateInflationRate();

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(inflationSchema),
    defaultValues: {
      period_year: moment().jYear(),
      period_month: moment().jMonth() + 1,
      rate: "",
      source: "manual",
    },
  });

  const numberField = (name: "period_year" | "period_month", label: string) => (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          type="number"
          size="small"
          label={label}
          value={field.value ?? ""}
          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );

  const onSubmit = handleSubmit((values) => {
    create.mutate(values, {
      onSuccess: () =>
        reset({
          period_year: values.period_year,
          period_month: values.period_month,
          rate: "",
          source: "manual",
        }),
    });
  });

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          نرخ تورم ماهانه (شمسی)
        </Typography>
        <form onSubmit={onSubmit}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="flex-start" mb={2}>
            {numberField("period_year", "سال شمسی")}
            {numberField("period_month", "ماه (۱ تا ۱۲)")}
            <Box sx={{ width: 160 }}>
              <ControlledTextField control={control} name="rate" label="نرخ ماهانه (مثلاً ۰٫۰۳)" />
            </Box>
            <Button type="submit" variant="contained" disabled={create.isPending}>
              افزودن
            </Button>
          </Stack>
        </form>
        {create.isError && <Alert severity="error" sx={{ mb: 2 }}>{create.error.message}</Alert>}

        {list.isLoading ? (
          <LoadingState />
        ) : list.isError ? (
          <ErrorState error={list.error} />
        ) : (list.data ?? []).length === 0 ? (
          <EmptyState>نرخ تورمی ثبت نشده است.</EmptyState>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>دوره</TableCell>
                <TableCell>نرخ</TableCell>
                <TableCell>منبع</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(list.data ?? []).map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{`${faNum(r.period_year)}/${faNum(String(r.period_month).padStart(2, "0"))}`}</TableCell>
                  <TableCell>{formatPercent(r.rate)}</TableCell>
                  <TableCell>{r.source}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
