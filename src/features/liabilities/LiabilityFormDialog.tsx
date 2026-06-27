import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import { createLiabilityApiV1LiabilitiesPostBody as liabilitySchema } from "@/api/generated/zod";
import { ControlledSelect } from "@/components/form/ControlledSelect";
import { ControlledTextField } from "@/components/form/ControlledTextField";
import { JalaliDatePicker } from "@/components/form/JalaliPickers";
import { useCreateLiability } from "@/hooks/useLiabilities";
import { LIABILITY_TYPES, LIABILITY_TYPE_LABELS } from "@/lib/enums";

type FormValues = z.infer<typeof liabilitySchema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export function LiabilityFormDialog({ open, onClose }: Props) {
  const create = useCreateLiability();

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(liabilitySchema),
    defaultValues: {
      name: "",
      type: "loan",
      principal: "",
      currency: "IRR",
      interest_rate: undefined,
      start_date: "",
      term_months: undefined,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: "",
        type: "loan",
        principal: "",
        currency: "IRR",
        interest_rate: undefined,
        start_date: "",
        term_months: undefined,
      });
    }
  }, [open, reset]);

  const onSubmit = handleSubmit((values) => {
    create.mutate(values, { onSuccess: onClose });
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>بدهی جدید</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {create.error && <Alert severity="error">{create.error.message}</Alert>}
            <ControlledTextField control={control} name="name" label="نام" />
            <ControlledSelect
              control={control}
              name="type"
              label="نوع"
              options={LIABILITY_TYPES.map((t) => ({ value: t, label: LIABILITY_TYPE_LABELS[t] }))}
            />
            <ControlledTextField control={control} name="principal" label="مبلغ اصل" />
            <ControlledTextField control={control} name="currency" label="ارز" />
            <ControlledTextField control={control} name="interest_rate" label="نرخ بهره (اختیاری، مثلاً ۰٫۱۸)" />
            <JalaliDatePicker control={control} name="start_date" label="تاریخ شروع" />
            <Controller
              control={control}
              name="term_months"
              render={({ field, fieldState }) => (
                <TextField
                  label="تعداد اقساط (ماه، اختیاری)"
                  type="number"
                  fullWidth
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={create.isPending}>
            انصراف
          </Button>
          <Button type="submit" variant="contained" disabled={create.isPending}>
            ذخیره
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
