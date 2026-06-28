import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Button, Card, CardContent, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import type { z } from "zod";

import { putAssumptionsApiV1AssumptionsPutBody as assumptionsSchema } from "@/api/generated/zod";
import type { components } from "@/api/generated/schema";
import { ControlledSelect } from "@/components/form/ControlledSelect";
import { ControlledTextField } from "@/components/form/ControlledTextField";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import { useAssumptions, useUpdateAssumptions } from "@/hooks/useAssumptions";
import {
  ASSET_CLASSES,
  ASSET_CLASS_LABELS,
  DISPLAY_CURRENCIES,
  DISPLAY_CURRENCY_LABELS,
  HURDLE_MODES,
  HURDLE_MODE_LABELS,
} from "@/lib/enums";

type FormValues = z.infer<typeof assumptionsSchema>;

function GrowthEditor({
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
      <Typography variant="subtitle2">نرخ رشد سالانه‌ی فرضی هر کلاس (برای پیش‌بینی)</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1 }}>
        {ASSET_CLASSES.map((c) => (
          <TextField
            key={c}
            size="small"
            label={`${ASSET_CLASS_LABELS[c]} (مثلاً ۰٫۲)`}
            value={current[c] ?? ""}
            onChange={(e) => set(c, e.target.value)}
          />
        ))}
      </Box>
    </Stack>
  );
}

export function AssumptionsForm() {
  const { data, isLoading, isError, error } = useAssumptions();
  const update = useUpdateAssumptions();
  const [saved, setSaved] = useState(false);

  const { control, handleSubmit, reset, watch } = useForm<FormValues>({
    resolver: zodResolver(assumptionsSchema),
    defaultValues: { display_currency: "both", hurdle_mode: "inflation", hurdle_fixed_rate: undefined, growth_assumptions: {} },
  });

  useEffect(() => {
    if (data) {
      reset({
        display_currency: data.display_currency,
        hurdle_mode: data.hurdle_mode,
        hurdle_fixed_rate: data.hurdle_fixed_rate ?? undefined,
        growth_assumptions: (data.growth_assumptions as Record<string, unknown>) ?? {},
      });
    }
  }, [data, reset]);

  const onSubmit = handleSubmit((values) => {
    // zod .default() makes these optional in the inferred type, but they are
    // always present at runtime; the request type requires them.
    update.mutate(values as components["schemas"]["AssumptionsUpdate"], {
      onSuccess: () => setSaved(true),
    });
  });

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState error={error} />;
  if (!data) return <EmptyState />;

  return (
    <Card>
      <CardContent>
        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            {update.isError && <Alert severity="error">{update.error.message}</Alert>}
            <ControlledSelect
              control={control}
              name="display_currency"
              label="ارز نمایش"
              options={DISPLAY_CURRENCIES.map((c) => ({ value: c, label: DISPLAY_CURRENCY_LABELS[c] }))}
            />
            <ControlledSelect
              control={control}
              name="hurdle_mode"
              label="حالت حداقل سود مورد انتظار"
              options={HURDLE_MODES.map((m) => ({ value: m, label: HURDLE_MODE_LABELS[m] }))}
            />
            {watch("hurdle_mode") === "fixed" && (
              <ControlledTextField control={control} name="hurdle_fixed_rate" label="نرخ ثابت (مثلاً ۰٫۲۵)" />
            )}
            <Controller
              control={control}
              name="growth_assumptions"
              render={({ field }) => <GrowthEditor value={field.value} onChange={field.onChange} />}
            />
            <Box>
              <Button type="submit" variant="contained" disabled={update.isPending}>
                ذخیره
              </Button>
            </Box>
          </Stack>
        </form>
      </CardContent>
      <Snackbar open={saved} autoHideDuration={3000} onClose={() => setSaved(false)} message="ذخیره شد" />
    </Card>
  );
}
