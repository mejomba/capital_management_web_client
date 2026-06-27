import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
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

import { tradeSchema } from "../txnSchemas";
import { useEntityOptions } from "./useEntityOptions";

type FormValues = components["schemas"]["TradeCreate"];

const EMPTY: FormValues = {
  type: "trade",
  occurred_at: "",
  legs: [
    { account_id: "", asset_id: "", quantity: "", unit_price: "", price_currency: "" },
    { account_id: "", asset_id: "", quantity: "", unit_price: "", price_currency: "" },
  ],
  fee: "",
  fee_currency: "",
  note: "",
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export function TradeForm({ open, onClose }: Props) {
  const { accounts, assets } = useEntityOptions();
  const create = useCreateTransaction();

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(tradeSchema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (open) reset(EMPTY);
  }, [open, reset]);

  const onSubmit = handleSubmit((values) => {
    const body = {
      type: "trade" as const,
      occurred_at: values.occurred_at,
      legs: values.legs.map((l) => ({
        account_id: l.account_id,
        asset_id: l.asset_id,
        quantity: l.quantity,
        unit_price: blank(l.unit_price as string),
        price_currency: blank(l.price_currency),
      })),
      fee: blank(values.fee as string),
      fee_currency: blank(values.fee_currency),
      note: blank(values.note),
    };
    create.mutate(body, { onSuccess: onClose });
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>معامله جدید</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {create.error && <Alert severity="error">{create.error.message}</Alert>}
            <JalaliDateTimePicker control={control} name="occurred_at" label="تاریخ و زمان" />

            <Typography variant="subtitle2" color="text.secondary">
              پایه‌ی پرداخت (مقدار منفی، مثلاً ‎-۵۰۰)
            </Typography>
            <Stack direction="row" spacing={1}>
              <ControlledSelect control={control} name="legs.0.account_id" label="حساب" options={accounts} />
              <ControlledSelect control={control} name="legs.0.asset_id" label="دارایی" options={assets} />
              <ControlledTextField control={control} name="legs.0.quantity" label="مقدار" />
              <ControlledTextField control={control} name="legs.0.unit_price" label="قیمت واحد" />
              <ControlledTextField control={control} name="legs.0.price_currency" label="ارز" />
            </Stack>

            <Divider />

            <Typography variant="subtitle2" color="text.secondary">
              پایه‌ی دریافت (مقدار مثبت)
            </Typography>
            <Stack direction="row" spacing={1}>
              <ControlledSelect control={control} name="legs.1.account_id" label="حساب" options={accounts} />
              <ControlledSelect control={control} name="legs.1.asset_id" label="دارایی" options={assets} />
              <ControlledTextField control={control} name="legs.1.quantity" label="مقدار" />
              <ControlledTextField control={control} name="legs.1.unit_price" label="قیمت واحد" />
              <ControlledTextField control={control} name="legs.1.price_currency" label="ارز" />
            </Stack>

            <Divider />
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
