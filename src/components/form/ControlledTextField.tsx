import { TextField, type TextFieldProps } from "@mui/material";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
} & Omit<TextFieldProps, "name" | "error" | "helperText" | "value" | "defaultValue">;

export function ControlledTextField<T extends FieldValues>({ control, name, ...rest }: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          {...rest}
          {...field}
          value={field.value ?? ""}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message}
          fullWidth
        />
      )}
    />
  );
}
