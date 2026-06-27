import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { createPriceApiV1PricesPostBody as priceSchema } from "@/api/generated/zod";
import { ControlledSelect, type SelectOption } from "@/components/form/ControlledSelect";
import { ControlledTextField } from "@/components/form/ControlledTextField";
import { JalaliDatePicker } from "@/components/form/JalaliPickers";
import { useCreatePrice } from "@/hooks/usePrices";

type FormValues = z.infer<typeof priceSchema>;

interface Props {
  open: boolean;
  assetOptions: SelectOption[];
  defaultAssetId?: string;
  onClose: () => void;
}

export function PriceFormDialog({ open, assetOptions, defaultAssetId, onClose }: Props) {
  const create = useCreatePrice();

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(priceSchema),
    defaultValues: { asset_id: "", quote_currency: "IRR", price: "", as_of: "", source: "manual" },
  });

  useEffect(() => {
    if (open) {
      reset({
        asset_id: defaultAssetId ?? "",
        quote_currency: "IRR",
        price: "",
        as_of: "",
        source: "manual",
      });
    }
  }, [open, defaultAssetId, reset]);

  const onSubmit = handleSubmit((values) => {
    create.mutate(values, { onSuccess: onClose });
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>ثبت قیمت</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {create.error && <Alert severity="error">{create.error.message}</Alert>}
            <ControlledSelect control={control} name="asset_id" label="دارایی" options={assetOptions} />
            <ControlledTextField control={control} name="quote_currency" label="ارز قیمت" />
            <ControlledTextField control={control} name="price" label="قیمت" />
            <JalaliDatePicker control={control} name="as_of" label="تاریخ" />
            <ControlledTextField control={control} name="source" label="منبع" />
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
