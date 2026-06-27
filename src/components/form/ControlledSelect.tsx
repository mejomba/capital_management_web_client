import { MenuItem, TextField } from "@mui/material";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";

export interface SelectOption {
  value: string;
  label: string;
}

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  options: SelectOption[];
  disabled?: boolean;
}

export function ControlledSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  disabled,
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          select
          label={label}
          disabled={disabled}
          {...field}
          value={field.value ?? ""}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message}
          fullWidth
        >
          {options.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
