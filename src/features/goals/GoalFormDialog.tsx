import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import { createGoalApiV1GoalsPostBody as goalSchema } from "@/api/generated/zod";
import type { components } from "@/api/generated/schema";
import { ControlledSelect } from "@/components/form/ControlledSelect";
import { ControlledTextField } from "@/components/form/ControlledTextField";
import { JalaliDatePicker } from "@/components/form/JalaliPickers";
import { useCreateGoal, useUpdateGoal } from "@/hooks/useGoals";
import {
  ASSET_CLASSES,
  ASSET_CLASS_LABELS,
  GOAL_STATUSES,
  GOAL_STATUS_LABELS,
  GOAL_TYPES,
  GOAL_TYPE_LABELS,
} from "@/lib/enums";
import { blank } from "@/lib/forms";

type GoalOut = components["schemas"]["GoalOut"];
type FormValues = z.infer<typeof goalSchema>;

interface Props {
  open: boolean;
  goal?: GoalOut | null;
  onClose: () => void;
}

const EMPTY: FormValues = {
  type: "target_net_worth",
  title: "",
  target_value: undefined,
  currency: "IRR",
  target_allocation: undefined,
  target_date: undefined,
  status: "active",
};

function AllocationEditor({
  value,
  onChange,
}: {
  value: Record<string, unknown> | null | undefined;
  onChange: (v: Record<string, string>) => void;
}) {
  const current = (value ?? {}) as Record<string, string>;
  const set = (cls: string, raw: string) => {
    const next = { ...current };
    if (raw === "") delete next[cls];
    else next[cls] = raw;
    onChange(next);
  };
  return (
    <Stack spacing={1}>
      {ASSET_CLASSES.map((c) => (
        <TextField
          key={c}
          label={`${ASSET_CLASS_LABELS[c]} (وزن، مثلاً ۰٫۳)`}
          size="small"
          value={current[c] ?? ""}
          onChange={(e) => set(c, e.target.value)}
          fullWidth
        />
      ))}
    </Stack>
  );
}

export function GoalFormDialog({ open, goal, onClose }: Props) {
  const create = useCreateGoal();
  const update = useUpdateGoal();
  const pending = create.isPending || update.isPending;
  const error = create.error ?? update.error;
  const isEdit = Boolean(goal);

  const { control, handleSubmit, reset, watch } = useForm<FormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (open) {
      reset(
        goal
          ? {
              type: goal.type,
              title: goal.title,
              target_value: goal.target_value ?? undefined,
              currency: goal.currency ?? "IRR",
              target_allocation: goal.target_allocation ?? undefined,
              target_date: goal.target_date ?? undefined,
              status: goal.status,
            }
          : EMPTY,
      );
    }
  }, [open, goal, reset]);

  const type = watch("type");
  const showValue = type === "target_net_worth" || type === "target_return";
  const showAllocation = type === "target_allocation";

  const onSubmit = handleSubmit((values) => {
    const common = {
      title: values.title,
      target_value: showValue ? blank(values.target_value as string) : undefined,
      currency: showValue ? blank(values.currency) : undefined,
      target_allocation: showAllocation ? values.target_allocation ?? undefined : undefined,
      target_date: blank(values.target_date as string),
    };
    const done = { onSuccess: onClose };
    if (goal) {
      update.mutate({ id: goal.id, body: { ...common, status: values.status ?? undefined } }, done);
    } else {
      create.mutate({ type: values.type, ...common }, done);
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{goal ? "ویرایش هدف" : "هدف جدید"}</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {error && <Alert severity="error">{error.message}</Alert>}
            <ControlledSelect
              control={control}
              name="type"
              label="نوع هدف"
              disabled={isEdit}
              options={GOAL_TYPES.map((t) => ({ value: t, label: GOAL_TYPE_LABELS[t] }))}
            />
            <ControlledTextField control={control} name="title" label="عنوان" />
            {showValue && (
              <>
                <ControlledTextField
                  control={control}
                  name="target_value"
                  label={type === "target_return" ? "بازدهی هدف (مثلاً ۰٫۲)" : "مقدار هدف"}
                />
                <ControlledTextField control={control} name="currency" label="ارز" />
              </>
            )}
            {showAllocation && (
              <Controller
                control={control}
                name="target_allocation"
                render={({ field }) => (
                  <AllocationEditor value={field.value} onChange={field.onChange} />
                )}
              />
            )}
            <JalaliDatePicker control={control} name="target_date" label="تاریخ هدف (اختیاری)" />
            {isEdit && (
              <ControlledSelect
                control={control}
                name="status"
                label="وضعیت"
                options={GOAL_STATUSES.map((s) => ({ value: s, label: GOAL_STATUS_LABELS[s] }))}
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={pending}>
            انصراف
          </Button>
          <Button type="submit" variant="contained" disabled={pending}>
            ذخیره
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
