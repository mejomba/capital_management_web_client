import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box } from "@mui/material";
import { DataGrid, GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/States";
import type { components } from "@/api/generated/schema";
import { useLiabilities } from "@/hooks/useLiabilities";
import { LIABILITY_TYPE_LABELS } from "@/lib/enums";
import { formatMoney } from "@/lib/format";

import { LiabilityDetailDialog } from "./LiabilityDetailDialog";
import { LiabilityFormDialog } from "./LiabilityFormDialog";

type LiabilityOut = components["schemas"]["LiabilityOut"];

export function LiabilitiesPage() {
  const { data, isLoading, isError, error } = useLiabilities();
  const [formOpen, setFormOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);

  const columns: GridColDef<LiabilityOut>[] = [
    { field: "name", headerName: "نام", flex: 1, minWidth: 140 },
    {
      field: "type",
      headerName: "نوع",
      width: 130,
      valueGetter: (v: LiabilityOut["type"]) => LIABILITY_TYPE_LABELS[v],
    },
    {
      field: "principal",
      headerName: "اصل",
      width: 150,
      valueGetter: (_v, row) => formatMoney(row.principal, row.currency as "IRR" | "USD"),
    },
    {
      field: "total_outstanding",
      headerName: "مانده‌ی کل",
      flex: 1,
      minWidth: 160,
      sortable: false,
      valueGetter: (_v, row) => formatMoney(row.balance.total_outstanding, row.currency as "IRR" | "USD"),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "عملیات",
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          key="view"
          icon={<VisibilityIcon />}
          label="مشاهده"
          onClick={() => setDetailId(params.row.id)}
        />,
      ],
    },
  ];

  if (isError) return <ErrorState error={error} />;

  return (
    <Box>
      <PageHeader title="بدهی‌ها" actionLabel="بدهی جدید" onAction={() => setFormOpen(true)} />
      <Box sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
        <DataGrid
          rows={data?.items ?? []}
          columns={columns}
          loading={isLoading}
          autoHeight
          disableRowSelectionOnClick
          localeText={{ noRowsLabel: "بدهی‌ای ثبت نشده است" }}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 25, 50]}
        />
      </Box>

      <LiabilityFormDialog open={formOpen} onClose={() => setFormOpen(false)} />
      <LiabilityDetailDialog liabilityId={detailId} onClose={() => setDetailId(null)} />
    </Box>
  );
}
