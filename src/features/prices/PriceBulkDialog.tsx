import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { createPriceApiV1PricesPostBody as priceSchema } from "@/api/generated/zod";
import { ControlledSelect, type SelectOption } from "@/components/form/ControlledSelect";
import { ControlledTextField } from "@/components/form/ControlledTextField";
import { JalaliDatePicker } from "@/components/form/JalaliPickers";
import { useCreatePricesBulk } from "@/hooks/usePrices";

const bulkSchema = z.object({ items: z.array(priceSchema).min(1) });
type FormValues = z.infer<typeof bulkSchema>;

const EMPTY_ROW = { asset_id: "", quote_currency: "IRR", price: "", as_of: "", source: "manual" };

interface Props {
  open: boolean;
  assetOptions: SelectOption[];
  onClose: () => void;
}

export function PriceBulkDialog({ open, assetOptions, onClose }: Props) {
  const bulk = useCreatePricesBulk();
  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(bulkSchema),
    defaultValues: { items: [{ ...EMPTY_ROW }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  useEffect(() => {
    if (open) reset({ items: [{ ...EMPTY_ROW }] });
  }, [open, reset]);

  const onSubmit = handleSubmit((values) => {
    bulk.mutate(values.items, { onSuccess: onClose });
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>ورود گروهی قیمت</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {bulk.error && <Alert severity="error">{bulk.error.message}</Alert>}
            {fields.map((f, i) => (
              <Stack key={f.id} direction="row" spacing={1} alignItems="flex-start">
                <ControlledSelect control={control} name={`items.${i}.asset_id`} label="دارایی" options={assetOptions} />
                <ControlledTextField control={control} name={`items.${i}.quote_currency`} label="ارز" />
                <ControlledTextField control={control} name={`items.${i}.price`} label="قیمت" />
                <JalaliDatePicker control={control} name={`items.${i}.as_of`} label="تاریخ" />
                <IconButton onClick={() => remove(i)} disabled={fields.length === 1} aria-label="حذف ردیف">
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ))}
            <Button startIcon={<AddIcon />} onClick={() => append({ ...EMPTY_ROW })} sx={{ alignSelf: "flex-start" }}>
              افزودن ردیف
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={bulk.isPending}>
            انصراف
          </Button>
          <Button type="submit" variant="contained" disabled={bulk.isPending}>
            ذخیره همه
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
