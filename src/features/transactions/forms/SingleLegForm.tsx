import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import type { components } from "@/api/generated/schema";
import { ControlledSelect } from "@/components/form/ControlledSelect";
import { ControlledTextField } from "@/components/form/ControlledTextField";
import { JalaliDateTimePicker } from "@/components/form/JalaliPickers";
import { useCreateTransaction } from "@/hooks/useTransactions";
import { TRANSACTION_TYPE_LABELS } from "@/lib/enums";
import { blank } from "@/lib/forms";

import { SINGLE_LEG_SCHEMAS, type SingleLegType } from "../txnSchemas";
import { useEntityOptions } from "./useEntityOptions";

// deposit / withdrawal / income share the same single-leg shape.
type FormValues = components["schemas"]["DepositCreate"];

interface Props {
  open: boolean;
  type: SingleLegType;
  onClose: () => void;
}

const EMPTY: Omit<FormValues, "type"> = {
  occurred_at: "",
  account_id: "",
  asset_id: "",
  quantity: "",
  unit_price: "",
  price_currency: "",
  fee: "",
  fee_currency: "",
  note: "",
};

export function SingleLegForm({ open, type, onClose }: Props) {
  const { accounts, assets } = useEntityOptions();
  const create = useCreateTransaction();

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(SINGLE_LEG_SCHEMAS[type] as z.ZodType<FormValues>),
    defaultValues: { ...EMPTY, type: type as FormValues["type"] },
  });

  useEffect(() => {
    if (open) reset({ ...EMPTY, type: type as FormValues["type"] });
  }, [open, type, reset]);

  const onSubmit = handleSubmit((values) => {
    const body = {
      type,
      occurred_at: values.occurred_at,
      account_id: values.account_id,
      asset_id: values.asset_id,
      quantity: values.quantity,
      unit_price: blank(values.unit_price as string),
      price_currency: blank(values.price_currency),
      fee: blank(values.fee as string),
      fee_currency: blank(values.fee_currency),
      note: blank(values.note),
    };
    create.mutate(body, { onSuccess: onClose });
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{TRANSACTION_TYPE_LABELS[type]} جدید</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {create.error && <Alert severity="error">{create.error.message}</Alert>}
            <JalaliDateTimePicker control={control} name="occurred_at" label="تاریخ و زمان" />
            <ControlledSelect control={control} name="account_id" label="حساب" options={accounts} />
            <ControlledSelect control={control} name="asset_id" label="دارایی" options={assets} />
            <ControlledTextField control={control} name="quantity" label="مقدار" />
            <ControlledTextField control={control} name="unit_price" label="قیمت واحد (اختیاری)" />
            <ControlledTextField control={control} name="price_currency" label="ارز قیمت (اختیاری)" />
            <ControlledTextField control={control} name="fee" label="کارمزد (اختیاری)" />
            <ControlledTextField control={control} name="fee_currency" label="ارز کارمزد (اختیاری)" />
            <ControlledTextField control={control} name="note" label="یادداشت (اختیاری)" multiline minRows={2} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={create.isPending}>
            انصراف
          </Button>
          <Button type="submit" variant="contained" disabled={create.isPending}>
            ثبت
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
