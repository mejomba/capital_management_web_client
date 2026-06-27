import EditIcon from "@mui/icons-material/Edit";
import { Box, Chip, MenuItem, Stack, TextField } from "@mui/material";
import { DataGrid, GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/States";
import type { components } from "@/api/generated/schema";
import { useAssets } from "@/hooks/useAssets";
import { ASSET_CLASSES, ASSET_CLASS_LABELS, type AssetClass } from "@/lib/enums";

import { AssetFormDialog } from "./AssetFormDialog";

type AssetOut = components["schemas"]["AssetOut"];

export function AssetsPage() {
  const [cls, setCls] = useState<AssetClass | "">("");
  const [q, setQ] = useState("");
  const { data, isLoading, isError, error } = useAssets({ class: cls || undefined, q, pageSize: 100 });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AssetOut | null>(null);

  const columns: GridColDef<AssetOut>[] = [
    { field: "symbol", headerName: "نماد", width: 110 },
    { field: "name", headerName: "نام", flex: 1, minWidth: 140 },
    {
      field: "asset_class",
      headerName: "کلاس",
      width: 130,
      valueGetter: (value: AssetOut["asset_class"]) => ASSET_CLASS_LABELS[value],
    },
    { field: "unit", headerName: "واحد", width: 90 },
    { field: "quote_currency", headerName: "ارز مرجع", width: 100 },
    {
      field: "user_id",
      headerName: "نوع",
      width: 110,
      renderCell: (params) =>
        params.value ? (
          <Chip size="small" label="سفارشی" color="primary" variant="outlined" />
        ) : (
          <Chip size="small" label="سیستمی" />
        ),
    },
    {
      field: "is_active",
      headerName: "فعال",
      width: 80,
      renderCell: (params) => (params.value ? "✓" : "—"),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "عملیات",
      width: 80,
      getActions: (params) =>
        params.row.user_id
          ? [
              <GridActionsCellItem
                key="edit"
                icon={<EditIcon />}
                label="ویرایش"
                onClick={() => {
                  setEditing(params.row);
                  setFormOpen(true);
                }}
              />,
            ]
          : [], // system assets are read-only
    },
  ];

  if (isError) return <ErrorState error={error} />;

  return (
    <Box>
      <PageHeader
        title="دارایی‌ها"
        actionLabel="دارایی جدید"
        onAction={() => {
          setEditing(null);
          setFormOpen(true);
        }}
      >
        <TextField
          select
          size="small"
          label="کلاس"
          value={cls}
          onChange={(e) => setCls(e.target.value as AssetClass | "")}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">همه</MenuItem>
          {ASSET_CLASSES.map((c) => (
            <MenuItem key={c} value={c}>
              {ASSET_CLASS_LABELS[c]}
            </MenuItem>
          ))}
        </TextField>
        <TextField size="small" label="جستجو" value={q} onChange={(e) => setQ(e.target.value)} />
      </PageHeader>

      <Box sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
        <DataGrid
          rows={data?.items ?? []}
          columns={columns}
          loading={isLoading}
          autoHeight
          disableRowSelectionOnClick
          localeText={{ noRowsLabel: "دارایی‌ای یافت نشد" }}
          initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
          pageSizeOptions={[25, 50, 100]}
        />
      </Box>

      <AssetFormDialog open={formOpen} asset={editing} onClose={() => setFormOpen(false)} />
      <Stack />
    </Box>
  );
}
