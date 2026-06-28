import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import moment from "moment-jalaali";

import { AllocationPie } from "@/components/charts/AllocationPie";
import { NetWorthChart } from "@/components/charts/NetWorthChart";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import { PageHeader } from "@/components/common/PageHeader";
import { useCurrency } from "@/context/CurrencyContext";
import { useAllocation, useNetWorth } from "@/hooks/useReports";
import { useRebuildSnapshots } from "@/hooks/useSnapshots";
import { formatMoney } from "@/lib/format";

export function DashboardPage() {
  const { apiParam, active } = useCurrency();
  const allocationCurrency = active.length === 1 ? active[0] : "IRR";

  const netWorth = useNetWorth({ currency: apiParam });
  const allocation = useAllocation({ currency: allocationCurrency });
  const rebuild = useRebuildSnapshots();

  const series = netWorth.data?.series ?? [];
  const latest = series[series.length - 1];

  const handleRebuild = () =>
    rebuild.mutate({
      from: moment().subtract(1, "year").format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD"),
    });

  return (
    <Box>
      <PageHeader title="داشبورد" />

      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">روند ارزش خالص</Typography>
              {latest && (
                <Stack direction="row" spacing={2}>
                  {active.map((cur) => (
                    <Typography key={cur} fontWeight={700}>
                      {formatMoney(cur === "USD" ? latest.net_worth_usd : latest.net_worth_irr, cur)}
                    </Typography>
                  ))}
                </Stack>
              )}
            </Stack>

            {netWorth.isLoading ? (
              <LoadingState />
            ) : netWorth.isError ? (
              <ErrorState error={netWorth.error} />
            ) : series.length === 0 ? (
              <Stack alignItems="center" spacing={2} py={4}>
                <EmptyState>هنوز اسنپ‌شاتی ساخته نشده است.</EmptyState>
                <Button variant="contained" onClick={handleRebuild} disabled={rebuild.isPending}>
                  {rebuild.isPending ? "در حال ساخت…" : "ساخت اسنپ‌شات یک سال اخیر"}
                </Button>
                {rebuild.isError && <ErrorState error={rebuild.error} />}
              </Stack>
            ) : (
              <NetWorthChart series={series} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" mb={2}>
              ترکیب دارایی فعلی
            </Typography>
            {allocation.isLoading ? (
              <LoadingState />
            ) : allocation.isError ? (
              <ErrorState error={allocation.error} />
            ) : Object.keys(allocation.data?.current ?? {}).length === 0 ? (
              <EmptyState>دارایی ارزش‌گذاری‌شده‌ای برای نمایش نیست.</EmptyState>
            ) : (
              <AllocationPie current={allocation.data!.current as Record<string, string>} />
            )}
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
