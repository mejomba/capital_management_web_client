import { Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { Moment } from "moment-jalaali";
import { useMemo, useState } from "react";

import { CurrencyValue } from "@/components/common/CurrencyValue";
import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/States";
import type { components } from "@/api/generated/schema";
import { useHoldings } from "@/hooks/useHoldings";
import { useAllAccounts } from "@/hooks/useLookups";
import { formatQuantity } from "@/lib/format";

type HoldingOut = components["schemas"]["HoldingOut"];

export function HoldingsPage() {
  const [asOf, setAsOf] = useState<Moment | null>(null);
  const accounts = useAllAccounts();
  const { data, isLoading, isError, error } = useHoldings(asOf?.toISOString());

  const accountName = useMemo(() => {
    const map = new Map<string, string>();
    for (const a of accounts.data?.items ?? []) map.set(a.id, a.name);
    return map;
  }, [accounts.data]);

  const columns: GridColDef<HoldingOut>[] = [
    {
      field: "account_id",
      headerName: "حساب",
      flex: 1,
      minWidth: 140,
      valueGetter: (v: string) => accountName.get(v) ?? "—",
    },
    { field: "symbol", headerName: "دارایی", width: 110 },
    {
      field: "quantity",
      headerName: "مقدار",
      width: 160,
      valueGetter: (v: string) => formatQuantity(v),
    },
    {
      field: "value",
      headerName: "ارزش روز",
      flex: 1,
      minWidth: 160,
      sortable: false,
      renderCell: (params) => <CurrencyValue irr={params.row.value_irr} usd={params.row.value_usd} />,
    },
    {
      field: "unrealized",
      headerName: "سود/زیان محقق‌نشده",
      flex: 1,
      minWidth: 180,
      sortable: false,
      renderCell: (params) => (
        <CurrencyValue irr={params.row.unrealized_pnl_irr} usd={params.row.unrealized_pnl_usd} signed />
      ),
    },
  ];

  if (isError) return <ErrorState error={error} />;

  return (
    <Box>
      <PageHeader title="موجودی">
        <DatePicker
          label="تا تاریخ"
          value={asOf}
          onChange={setAsOf}
          slotProps={{ textField: { size: "small" }, field: { clearable: true } }}
        />
      </PageHeader>

      <Box sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
        <DataGrid
          rows={data ?? []}
          getRowId={(r) => `${r.account_id}:${r.asset_id}`}
          columns={columns}
          loading={isLoading}
          autoHeight
          rowHeight={64}
          disableRowSelectionOnClick
          localeText={{ noRowsLabel: "موجودی‌ای برای نمایش نیست" }}
          initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
          pageSizeOptions={[25, 50, 100]}
        />
      </Box>
    </Box>
  );
}
