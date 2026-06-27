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
          name={field.name}
          inputRef={field.ref}
          onBlur={field.onBlur}
          value={field.value ?? ""}
          // Emit undefined for empty so optional money/decimal fields are omitted
          // (an empty "" would fail the generated Decimal regex), while required
          // fields still report "required".
          onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.value)}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message}
          fullWidth
        />
      )}
    />
  );
}
