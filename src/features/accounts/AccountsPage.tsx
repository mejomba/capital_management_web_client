import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box } from "@mui/material";
import { DataGrid, GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/States";
import type { components } from "@/api/generated/schema";
import { useAccounts, useDeleteAccount } from "@/hooks/useAccounts";
import { ACCOUNT_TYPE_LABELS } from "@/lib/enums";

import { AccountFormDialog } from "./AccountFormDialog";

type AccountOut = components["schemas"]["AccountOut"];

export function AccountsPage() {
  const { data, isLoading, isError, error } = useAccounts(1, 100);
  const del = useDeleteAccount();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AccountOut | null>(null);
  const [toDelete, setToDelete] = useState<AccountOut | null>(null);

  const columns: GridColDef<AccountOut>[] = [
    { field: "name", headerName: "نام", flex: 1, minWidth: 140 },
    {
      field: "type",
      headerName: "نوع",
      width: 130,
      valueGetter: (value: AccountOut["type"]) => ACCOUNT_TYPE_LABELS[value],
    },
    { field: "currency_hint", headerName: "ارز", width: 90 },
    { field: "note", headerName: "یادداشت", flex: 1, minWidth: 160 },
    {
      field: "actions",
      type: "actions",
      headerName: "عملیات",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="ویرایش"
          onClick={() => {
            setEditing(params.row);
            setFormOpen(true);
          }}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="حذف"
          onClick={() => setToDelete(params.row)}
        />,
      ],
    },
  ];

  if (isError) return <ErrorState error={error} />;

  return (
    <Box>
      <PageHeader
        title="حساب‌ها"
        actionLabel="حساب جدید"
        onAction={() => {
          setEditing(null);
          setFormOpen(true);
        }}
      />
      <Box sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
        <DataGrid
          rows={data?.items ?? []}
          columns={columns}
          loading={isLoading}
          autoHeight
          disableRowSelectionOnClick
          localeText={{ noRowsLabel: "حسابی ثبت نشده است" }}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 25, 50]}
        />
      </Box>

      <AccountFormDialog open={formOpen} account={editing} onClose={() => setFormOpen(false)} />
      <ConfirmDialog
        open={Boolean(toDelete)}
        title="حذف حساب"
        message={`حساب «${toDelete?.name}» حذف شود؟`}
        confirmLabel="حذف"
        loading={del.isPending}
        onClose={() => setToDelete(null)}
        onConfirm={() =>
          toDelete && del.mutate(toDelete.id, { onSuccess: () => setToDelete(null) })
        }
      />
    </Box>
  );
}
