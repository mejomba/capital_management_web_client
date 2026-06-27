import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import type { components } from "@/api/generated/schema";
import { ControlledSelect } from "@/components/form/ControlledSelect";
import { ControlledTextField } from "@/components/form/ControlledTextField";
import { JalaliDateTimePicker } from "@/components/form/JalaliPickers";
import { useCreateTransaction } from "@/hooks/useTransactions";
import { blank } from "@/lib/forms";

import { transferSchema } from "../txnSchemas";
import { useEntityOptions } from "./useEntityOptions";

type FormValues = components["schemas"]["TransferCreate"];

const EMPTY: FormValues = {
  type: "transfer",
  occurred_at: "",
  legs: [
    { account_id: "", asset_id: "", quantity: "" },
    { account_id: "", asset_id: "", quantity: "" },
  ],
  fee: "",
  fee_currency: "",
  note: "",
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export function TransferForm({ open, onClose }: Props) {
  const { accounts, assets } = useEntityOptions();
  const create = useCreateTransaction();

  const { control, handleSubmit, reset, setValue, watch } = useForm<FormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (open) reset(EMPTY);
  }, [open, reset]);

  // A transfer moves ONE asset between two accounts: a single asset selector
  // drives both legs' asset_id so they can never diverge.
  const assetId = watch("legs.0.asset_id");
  const onAssetChange = (value: string) => {
    setValue("legs.0.asset_id", value, { shouldValidate: true });
    setValue("legs.1.asset_id", value, { shouldValidate: true });
  };

  const onSubmit = handleSubmit((values) => {
    const body = {
      type: "transfer" as const,
      occurred_at: values.occurred_at,
      legs: [
        { account_id: values.legs[0].account_id, asset_id: values.legs[0].asset_id, quantity: values.legs[0].quantity },
        { account_id: values.legs[1].account_id, asset_id: values.legs[1].asset_id, quantity: values.legs[1].quantity },
      ],
      fee: blank(values.fee as string),
      fee_currency: blank(values.fee_currency),
      note: blank(values.note),
    };
    create.mutate(body, { onSuccess: onClose });
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>انتقال جدید</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {create.error && <Alert severity="error">{create.error.message}</Alert>}
            <JalaliDateTimePicker control={control} name="occurred_at" label="تاریخ و زمان" />
            <TextField select label="دارایی" value={assetId ?? ""} onChange={(e) => onAssetChange(e.target.value)} fullWidth>
              {assets.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </TextField>

            <Typography variant="subtitle2" color="text.secondary">
              مبدأ (مقدار منفی)
            </Typography>
            <Stack direction="row" spacing={1}>
              <ControlledSelect control={control} name="legs.0.account_id" label="حساب مبدأ" options={accounts} />
              <ControlledTextField control={control} name="legs.0.quantity" label="مقدار خروجی (منفی)" />
            </Stack>

            <Typography variant="subtitle2" color="text.secondary">
              مقصد (مقدار مثبت)
            </Typography>
            <Stack direction="row" spacing={1}>
              <ControlledSelect control={control} name="legs.1.account_id" label="حساب مقصد" options={accounts} />
              <ControlledTextField control={control} name="legs.1.quantity" label="مقدار ورودی (مثبت)" />
            </Stack>

            <Stack direction="row" spacing={1}>
              <ControlledTextField control={control} name="fee" label="کارمزد (اختیاری)" />
              <ControlledTextField control={control} name="fee_currency" label="ارز کارمزد (اختیاری)" />
            </Stack>
            <ControlledTextField control={control} name="note" label="یادداشت (اختیاری)" />
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
