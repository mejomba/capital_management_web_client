import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Chip } from "@mui/material";
import { DataGrid, GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { ErrorState } from "@/components/common/States";
import type { components } from "@/api/generated/schema";
import { useGoals } from "@/hooks/useGoals";
import { GOAL_STATUS_LABELS, GOAL_TYPE_LABELS } from "@/lib/enums";
import { formatMoney } from "@/lib/format";

import { GoalDetailDialog } from "./GoalDetailDialog";
import { GoalFormDialog } from "./GoalFormDialog";

type GoalOut = components["schemas"]["GoalOut"];

export function GoalsPage() {
  const { data, isLoading, isError, error } = useGoals();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<GoalOut | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

  const columns: GridColDef<GoalOut>[] = [
    { field: "title", headerName: "عنوان", flex: 1, minWidth: 160 },
    {
      field: "type",
      headerName: "نوع",
      width: 150,
      valueGetter: (v: GoalOut["type"]) => GOAL_TYPE_LABELS[v],
    },
    {
      field: "target_value",
      headerName: "مقدار هدف",
      width: 150,
      valueGetter: (_v, row) => (row.target_value ? formatMoney(row.target_value, (row.currency as "IRR" | "USD") ?? "IRR") : "—"),
    },
    {
      field: "status",
      headerName: "وضعیت",
      width: 110,
      renderCell: (p) => (
        <Chip
          size="small"
          label={GOAL_STATUS_LABELS[p.row.status]}
          color={p.row.status === "achieved" ? "success" : p.row.status === "active" ? "primary" : "default"}
          variant={p.row.status === "archived" ? "outlined" : "filled"}
        />
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "عملیات",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          key="view"
          icon={<VisibilityIcon />}
          label="مشاهده"
          onClick={() => setDetailId(params.row.id)}
        />,
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="ویرایش"
          onClick={() => {
            setEditing(params.row);
            setFormOpen(true);
          }}
        />,
      ],
    },
  ];

  if (isError) return <ErrorState error={error} />;

  return (
    <Box>
      <PageHeader
        title="اهداف"
        actionLabel="هدف جدید"
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
          localeText={{ noRowsLabel: "هدفی ثبت نشده است" }}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 25, 50]}
        />
      </Box>

      <GoalFormDialog open={formOpen} goal={editing} onClose={() => setFormOpen(false)} />
      <GoalDetailDialog goalId={detailId} onClose={() => setDetailId(null)} />
    </Box>
  );
}
