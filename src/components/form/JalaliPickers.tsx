import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import moment from "moment-jalaali";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";

// The pickers display a Jalali calendar (AdapterMomentJalaali, wired in main.tsx)
// but the underlying moment is Gregorian, so we store ISO strings in the form and
// the API always receives Gregorian/ISO. Display↔API conversion only — no math.

interface BaseProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
}

/** Stores an ISO date string (YYYY-MM-DD). */
export function JalaliDatePicker<T extends FieldValues>({ control, name, label }: BaseProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <DatePicker
          label={label}
          value={field.value ? moment(field.value as string, "YYYY-MM-DD") : null}
          onChange={(m) => field.onChange(m && m.isValid() ? m.format("YYYY-MM-DD") : "")}
          slotProps={{
            textField: {
              fullWidth: true,
              error: Boolean(fieldState.error),
              helperText: fieldState.error?.message,
            },
          }}
        />
      )}
    />
  );
}

/** Stores a full ISO datetime string (UTC). */
export function JalaliDateTimePicker<T extends FieldValues>({ control, name, label }: BaseProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <DateTimePicker
          label={label}
          ampm={false}
          value={field.value ? moment(field.value as string) : null}
          onChange={(m) => field.onChange(m && m.isValid() ? m.toISOString() : "")}
          slotProps={{
            textField: {
              fullWidth: true,
              error: Boolean(fieldState.error),
              helperText: fieldState.error?.message,
            },
          }}
        />
      )}
    />
  );
}
