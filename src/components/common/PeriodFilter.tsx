import { Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { Moment } from "moment-jalaali";

export interface PeriodValue {
  from: Moment | null;
  to: Moment | null;
}

// Jalali from/to range picker. Emits Moment objects; callers convert to the ISO
// date or datetime the specific endpoint expects.
export function PeriodFilter({
  value,
  onChange,
}: {
  value: PeriodValue;
  onChange: (v: PeriodValue) => void;
}) {
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      <DatePicker
        label="از تاریخ"
        value={value.from}
        onChange={(from) => onChange({ ...value, from })}
        slotProps={{ textField: { size: "small" }, field: { clearable: true } }}
      />
      <DatePicker
        label="تا تاریخ"
        value={value.to}
        onChange={(to) => onChange({ ...value, to })}
        slotProps={{ textField: { size: "small" }, field: { clearable: true } }}
      />
    </Stack>
  );
}

export function toISODate(m: Moment | null): string | undefined {
  return m ? m.format("YYYY-MM-DD") : undefined;
}

export function toISOStart(m: Moment | null): string | undefined {
  return m ? m.clone().startOf("day").toISOString() : undefined;
}

export function toISOEnd(m: Moment | null): string | undefined {
  return m ? m.clone().endOf("day").toISOString() : undefined;
}
