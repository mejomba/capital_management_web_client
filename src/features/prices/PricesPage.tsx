import { Box, Button, Card, CardContent, MenuItem, Stack, TextField } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState, ErrorState } from "@/components/common/States";
import type { components } from "@/api/generated/schema";
import { useAllAssets } from "@/hooks/useLookups";
import { usePrices } from "@/hooks/usePrices";
import { formatMoney } from "@/lib/format";
import { toJalaliDate } from "@/lib/jalali";

import { PriceBulkDialog } from "./PriceBulkDialog";
import { PriceFormDialog } from "./PriceFormDialog";
import { PriceSeriesChart } from "./PriceSeriesChart";

type PriceOut = components["schemas"]["PriceOut"];

export function PricesPage() {
  const assets = useAllAssets();
  const [assetId, setAssetId] = useState("");
  const [single, setSingle] = useState(false);
  const [bulk, setBulk] = useState(false);

  const assetOptions = useMemo(
    () => (assets.data?.items ?? []).map((a) => ({ value: a.id, label: `${a.symbol} — ${a.name}` })),
    [assets.data],
  );

  const { data, isLoading, isError, error } = usePrices({ assetId });

  const columns: GridColDef<PriceOut>[] = [
    { field: "as_of", headerName: "تاریخ", width: 140, valueGetter: (v: string) => toJalaliDate(v) },
    {
      field: "price",
      headerName: "قیمت",
      flex: 1,
      minWidth: 140,
      valueGetter: (v: string) => formatMoney(v),
    },
    { field: "quote_currency", headerName: "ارز", width: 90 },
    { field: "source", headerName: "منبع", width: 110 },
  ];

  const prices = data?.items ?? [];

  return (
    <Box>
      <PageHeader title="قیمت‌ها">
        <Button variant="outlined" onClick={() => setBulk(true)}>
          ورود گروهی
        </Button>
        <Button variant="contained" onClick={() => setSingle(true)}>
          قیمت جدید
        </Button>
      </PageHeader>

      <TextField
        select
        size="small"
        label="دارایی"
        value={assetId}
        onChange={(e) => setAssetId(e.target.value)}
        sx={{ minWidth: 260, mb: 2 }}
      >
        <MenuItem value="">— انتخاب دارایی —</MenuItem>
        {assetOptions.map((o) => (
          <MenuItem key={o.value} value={o.value}>
            {o.label}
          </MenuItem>
        ))}
      </TextField>

      {!assetId ? (
        <EmptyState>برای دیدن سری قیمت، یک دارایی انتخاب کنید.</EmptyState>
      ) : isError ? (
        <ErrorState error={error} />
      ) : (
        <Stack spacing={2}>
          {prices.length > 0 && (
            <Card>
              <CardContent>
                <PriceSeriesChart prices={prices} />
              </CardContent>
            </Card>
          )}
          <Box sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
            <DataGrid
              rows={prices}
              columns={columns}
              loading={isLoading}
              autoHeight
              disableRowSelectionOnClick
              localeText={{ noRowsLabel: "قیمتی ثبت نشده است" }}
              initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
              pageSizeOptions={[25, 50, 100]}
            />
          </Box>
        </Stack>
      )}

      <PriceFormDialog
        open={single}
        assetOptions={assetOptions}
        defaultAssetId={assetId || undefined}
        onClose={() => setSingle(false)}
      />
      <PriceBulkDialog open={bulk} assetOptions={assetOptions} onClose={() => setBulk(false)} />
    </Box>
  );
}
