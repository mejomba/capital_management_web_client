import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { addEventApiV1LiabilitiesLiabilityIdEventsPostBody as eventSchema } from "@/api/generated/zod";
import { ControlledSelect } from "@/components/form/ControlledSelect";
import { ControlledTextField } from "@/components/form/ControlledTextField";
import { JalaliDateTimePicker } from "@/components/form/JalaliPickers";
import { useAddLiabilityEvent } from "@/hooks/useLiabilities";
import { LIABILITY_EVENT_TYPES, LIABILITY_EVENT_TYPE_LABELS } from "@/lib/enums";

type FormValues = z.infer<typeof eventSchema>;

interface Props {
  open: boolean;
  liabilityId: string;
  currency: string;
  onClose: () => void;
}

export function LiabilityEventDialog({ open, liabilityId, currency, onClose }: Props) {
  const add = useAddLiabilityEvent(liabilityId);

  const { control, handleSubmit, reset, watch } = useForm<FormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      type: "disbursement",
      amount: "",
      currency,
      occurred_at: "",
      principal_component: undefined,
      interest_component: undefined,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        type: "disbursement",
        amount: "",
        currency,
        occurred_at: "",
        principal_component: undefined,
        interest_component: undefined,
      });
    }
  }, [open, currency, reset]);

  const isRepayment = watch("type") === "repayment";

  const onSubmit = handleSubmit((values) => {
    add.mutate(values, { onSuccess: onClose });
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>ثبت رویداد بدهی</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {add.error && <Alert severity="error">{add.error.message}</Alert>}
            <ControlledSelect
              control={control}
              name="type"
              label="نوع رویداد"
              options={LIABILITY_EVENT_TYPES.map((t) => ({ value: t, label: LIABILITY_EVENT_TYPE_LABELS[t] }))}
            />
            <ControlledTextField control={control} name="amount" label="مبلغ" />
            <ControlledTextField control={control} name="currency" label="ارز" />
            <JalaliDateTimePicker control={control} name="occurred_at" label="تاریخ و زمان" />
            {isRepayment && (
              <>
                <Typography variant="caption" color="text.secondary">
                  برای بازپرداخت، تفکیک اصل و بهره را وارد کنید (جمعشان باید برابر مبلغ باشد).
                </Typography>
                <ControlledTextField control={control} name="principal_component" label="سهم اصل" />
                <ControlledTextField control={control} name="interest_component" label="سهم بهره" />
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={add.isPending}>
            انصراف
          </Button>
          <Button type="submit" variant="contained" disabled={add.isPending}>
            ثبت
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
