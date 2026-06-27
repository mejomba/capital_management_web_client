import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import UndoIcon from "@mui/icons-material/Undo";
import { Box, Button, Chip, Menu, MenuItem, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DataGrid, GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import moment, { type Moment } from "moment-jalaali";
import { useMemo, useState } from "react";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/States";
import type { components } from "@/api/generated/schema";
import {
  useDeleteTransaction,
  useReverseTransaction,
  useTransactions,
  type TransactionFilters,
} from "@/hooks/useTransactions";
import { useAllAccounts, useAllAssets } from "@/hooks/useLookups";
import {
  TRANSACTION_STATUS_LABELS,
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_LABELS,
  type TransactionType,
} from "@/lib/enums";
import { formatQuantity } from "@/lib/format";
import { toJalaliDateTime } from "@/lib/jalali";

import { SingleLegForm } from "./forms/SingleLegForm";
import { TradeForm } from "./forms/TradeForm";
import { TransferForm } from "./forms/TransferForm";

type TransactionOut = components["schemas"]["TransactionOut"];

const NEW_TYPES: TransactionType[] = ["deposit", "withdrawal", "income", "trade", "transfer"];

export function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionFilters>({ page: 1, pageSize: 20 });
  const { data, isLoading, isError, error } = useTransactions(filters);
  const accounts = useAllAccounts();
  const assets = useAllAssets();
  const reverse = useReverseTransaction();
  const del = useDeleteTransaction();

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [openForm, setOpenForm] = useState<TransactionType | null>(null);
  const [toReverse, setToReverse] = useState<TransactionOut | null>(null);
  const [toDelete, setToDelete] = useState<TransactionOut | null>(null);

  const accountName = useMemo(() => {
    const m = new Map<string, string>();
    for (const a of accounts.data?.items ?? []) m.set(a.id, a.name);
    return m;
  }, [accounts.data]);
  const assetSymbol = useMemo(() => {
    const m = new Map<string, string>();
    for (const a of assets.data?.items ?? []) m.set(a.id, a.symbol);
    return m;
  }, [assets.data]);

  const patch = (p: Partial<TransactionFilters>) => setFilters((f) => ({ ...f, page: 1, ...p }));

  const columns: GridColDef<TransactionOut>[] = [
    {
      field: "occurred_at",
      headerName: "تاریخ",
      width: 150,
      valueGetter: (v: string) => toJalaliDateTime(v),
    },
    {
      field: "type",
      headerName: "نوع",
      width: 110,
      renderCell: (p) => <Chip size="small" label={TRANSACTION_TYPE_LABELS[p.row.type]} />,
    },
    {
      field: "legs",
      headerName: "پایه‌ها",
      flex: 1,
      minWidth: 260,
      sortable: false,
      renderCell: (p) => (
        <Stack spacing={0.25} sx={{ py: 0.5 }}>
          {p.row.legs.map((l) => (
            <span key={l.id} style={{ fontSize: 13, whiteSpace: "nowrap" }}>
              {accountName.get(l.account_id) ?? "—"}: {formatQuantity(l.quantity)}{" "}
              {assetSymbol.get(l.asset_id) ?? ""}
            </span>
          ))}
        </Stack>
      ),
    },
    {
      field: "status",
      headerName: "وضعیت",
      width: 100,
      renderCell: (p) => (
        <Chip
          size="small"
          color={p.row.status === "active" ? "success" : "default"}
          label={TRANSACTION_STATUS_LABELS[p.row.status]}
          variant={p.row.status === "active" ? "filled" : "outlined"}
        />
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "عملیات",
      width: 100,
      getActions: (p) => {
        const actions = [];
        if (p.row.status === "active") {
          actions.push(
            <GridActionsCellItem
              key="reverse"
              icon={<UndoIcon />}
              label="باطل‌سازی"
              onClick={() => setToReverse(p.row)}
            />,
          );
        }
        actions.push(
          <GridActionsCellItem key="delete" icon={<DeleteIcon />} label="حذف" onClick={() => setToDelete(p.row)} />,
        );
        return actions;
      },
    },
  ];

  return (
    <Box>
      <PageHeader title="تراکنش‌ها">
        <Button variant="contained" startIcon={<AddIcon />} onClick={(e) => setMenuAnchor(e.currentTarget)}>
          تراکنش جدید
        </Button>
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
          {NEW_TYPES.map((t) => (
            <MenuItem
              key={t}
              onClick={() => {
                setOpenForm(t);
                setMenuAnchor(null);
              }}
            >
              {TRANSACTION_TYPE_LABELS[t]}
            </MenuItem>
          ))}
        </Menu>
      </PageHeader>

      <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" useFlexGap>
        <TextField
          select
          size="small"
          label="نوع"
          value={filters.type ?? ""}
          onChange={(e) => patch({ type: (e.target.value || undefined) as TransactionType | undefined })}
          sx={{ minWidth: 130 }}
        >
          <MenuItem value="">همه</MenuItem>
          {TRANSACTION_TYPES.map((t) => (
            <MenuItem key={t} value={t}>
              {TRANSACTION_TYPE_LABELS[t]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="حساب"
          value={filters.account_id ?? ""}
          onChange={(e) => patch({ account_id: e.target.value || undefined })}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">همه</MenuItem>
          {(accounts.data?.items ?? []).map((a) => (
            <MenuItem key={a.id} value={a.id}>
              {a.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="دارایی"
          value={filters.asset_id ?? ""}
          onChange={(e) => patch({ asset_id: e.target.value || undefined })}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">همه</MenuItem>
          {(assets.data?.items ?? []).map((a) => (
            <MenuItem key={a.id} value={a.id}>
              {a.symbol}
            </MenuItem>
          ))}
        </TextField>
        <DatePicker
          label="از تاریخ"
          value={filters.from ? moment(filters.from) : null}
          onChange={(m: Moment | null) => patch({ from: m?.startOf("day").toISOString() })}
          slotProps={{ textField: { size: "small" }, field: { clearable: true } }}
        />
        <DatePicker
          label="تا تاریخ"
          value={filters.to ? moment(filters.to) : null}
          onChange={(m: Moment | null) => patch({ to: m?.endOf("day").toISOString() })}
          slotProps={{ textField: { size: "small" }, field: { clearable: true } }}
        />
        <TextField
          size="small"
          label="برچسب"
          value={filters.tag ?? ""}
          onChange={(e) => patch({ tag: e.target.value || undefined })}
        />
      </Stack>

      {isError ? (
        <ErrorState error={error} />
      ) : (
        <Box sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
          <DataGrid
            rows={data?.items ?? []}
            columns={columns}
            loading={isLoading}
            autoHeight
            rowHeight={64}
            disableRowSelectionOnClick
            localeText={{ noRowsLabel: "تراکنشی یافت نشد" }}
            paginationMode="server"
            rowCount={data?.total ?? 0}
            paginationModel={{ page: (filters.page ?? 1) - 1, pageSize: filters.pageSize ?? 20 }}
            onPaginationModelChange={(m) => setFilters((f) => ({ ...f, page: m.page + 1, pageSize: m.pageSize }))}
            pageSizeOptions={[20, 50]}
          />
        </Box>
      )}

      {(openForm === "deposit" || openForm === "withdrawal" || openForm === "income") && (
        <SingleLegForm open type={openForm} onClose={() => setOpenForm(null)} />
      )}
      <TradeForm open={openForm === "trade"} onClose={() => setOpenForm(null)} />
      <TransferForm open={openForm === "transfer"} onClose={() => setOpenForm(null)} />

      <ConfirmDialog
        open={Boolean(toReverse)}
        title="باطل‌سازی تراکنش"
        message="یک تراکنش معکوس ثبت می‌شود و اثر این تراکنش خنثی می‌گردد. ادامه می‌دهید؟"
        confirmLabel="باطل‌سازی"
        loading={reverse.isPending}
        onClose={() => setToReverse(null)}
        onConfirm={() => toReverse && reverse.mutate(toReverse.id, { onSuccess: () => setToReverse(null) })}
      />
      <ConfirmDialog
        open={Boolean(toDelete)}
        title="حذف تراکنش"
        message="این تراکنش حذف (نرم) می‌شود. ادامه می‌دهید؟"
        confirmLabel="حذف"
        loading={del.isPending}
        onClose={() => setToDelete(null)}
        onConfirm={() => toDelete && del.mutate(toDelete.id, { onSuccess: () => setToDelete(null) })}
      />
    </Box>
  );
}
