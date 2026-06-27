import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { createAccountApiV1AccountsPostBody as accountSchema } from "@/api/generated/zod";
import type { components } from "@/api/generated/schema";
import { ControlledSelect } from "@/components/form/ControlledSelect";
import { ControlledTextField } from "@/components/form/ControlledTextField";
import { useCreateAccount, useUpdateAccount } from "@/hooks/useAccounts";
import { ACCOUNT_TYPES, ACCOUNT_TYPE_LABELS } from "@/lib/enums";

type AccountOut = components["schemas"]["AccountOut"];
type FormValues = z.infer<typeof accountSchema>;

interface Props {
  open: boolean;
  account?: AccountOut | null;
  onClose: () => void;
}

export function AccountFormDialog({ open, account, onClose }: Props) {
  const create = useCreateAccount();
  const update = useUpdateAccount();
  const pending = create.isPending || update.isPending;
  const error = create.error ?? update.error;

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: { name: "", type: "bank", currency_hint: "", note: "" },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: account?.name ?? "",
        type: account?.type ?? "bank",
        currency_hint: account?.currency_hint ?? "",
        note: account?.note ?? "",
      });
    }
  }, [open, account, reset]);

  const onSubmit = handleSubmit((values) => {
    const body = {
      ...values,
      currency_hint: values.currency_hint || undefined,
      note: values.note || undefined,
    };
    const done = { onSuccess: onClose };
    if (account) update.mutate({ id: account.id, body }, done);
    else create.mutate(body, done);
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{account ? "ویرایش حساب" : "حساب جدید"}</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {error && <Alert severity="error">{error.message}</Alert>}
            <ControlledTextField control={control} name="name" label="نام حساب" />
            <ControlledSelect
              control={control}
              name="type"
              label="نوع"
              options={ACCOUNT_TYPES.map((t) => ({ value: t, label: ACCOUNT_TYPE_LABELS[t] }))}
            />
            <ControlledTextField control={control} name="currency_hint" label="ارز پیش‌فرض (اختیاری)" />
            <ControlledTextField control={control} name="note" label="یادداشت (اختیاری)" multiline minRows={2} />
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
