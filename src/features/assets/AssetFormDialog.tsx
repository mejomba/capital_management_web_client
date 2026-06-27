import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Switch,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { createAssetApiV1AssetsPostBody as assetSchema } from "@/api/generated/zod";
import type { components } from "@/api/generated/schema";
import { ControlledSelect } from "@/components/form/ControlledSelect";
import { ControlledTextField } from "@/components/form/ControlledTextField";
import { useCreateAsset, useUpdateAsset } from "@/hooks/useAssets";
import { ASSET_CLASSES, ASSET_CLASS_LABELS } from "@/lib/enums";

type AssetOut = components["schemas"]["AssetOut"];

const editSchema = assetSchema.extend({ is_active: z.boolean() });
type FormValues = z.infer<typeof editSchema>;

interface Props {
  open: boolean;
  asset?: AssetOut | null;
  onClose: () => void;
}

export function AssetFormDialog({ open, asset, onClose }: Props) {
  const create = useCreateAsset();
  const update = useUpdateAsset();
  const pending = create.isPending || update.isPending;
  const error = create.error ?? update.error;
  const isEdit = Boolean(asset);

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(isEdit ? editSchema : assetSchema),
    defaultValues: { symbol: "", name: "", asset_class: "crypto", unit: "unit", quote_currency: "USD", is_active: true },
  });

  useEffect(() => {
    if (open) {
      reset({
        symbol: asset?.symbol ?? "",
        name: asset?.name ?? "",
        asset_class: asset?.asset_class ?? "crypto",
        unit: asset?.unit ?? "unit",
        quote_currency: asset?.quote_currency ?? "USD",
        is_active: asset?.is_active ?? true,
      });
    }
  }, [open, asset, reset]);

  const onSubmit = handleSubmit((values) => {
    const done = { onSuccess: onClose };
    if (asset) {
      update.mutate({ id: asset.id, body: values }, done);
    } else {
      create.mutate(
        {
          symbol: values.symbol,
          name: values.name,
          asset_class: values.asset_class,
          unit: values.unit,
          quote_currency: values.quote_currency,
        },
        done,
      );
    }
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{asset ? "ویرایش دارایی" : "دارایی جدید"}</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {error && <Alert severity="error">{error.message}</Alert>}
            <ControlledTextField control={control} name="symbol" label="نماد" />
            <ControlledTextField control={control} name="name" label="نام" />
            <ControlledSelect
              control={control}
              name="asset_class"
              label="کلاس دارایی"
              options={ASSET_CLASSES.map((c) => ({ value: c, label: ASSET_CLASS_LABELS[c] }))}
            />
            <ControlledTextField control={control} name="unit" label="واحد (gram/share/coin/unit)" />
            <ControlledTextField control={control} name="quote_currency" label="ارز مرجع قیمت" />
            {isEdit && (
              <Controller
                control={control}
                name="is_active"
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch checked={Boolean(field.value)} onChange={(e) => field.onChange(e.target.checked)} />}
                    label="فعال"
                  />
                )}
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
