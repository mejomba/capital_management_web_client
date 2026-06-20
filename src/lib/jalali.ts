import dayjs from "dayjs";
import jalaliday from "jalaliday";
import utc from "dayjs/plugin/utc";

// Jalali (Persian) calendar for DISPLAY and date pickers only. The API always
// speaks ISO/Gregorian UTC, so we convert to Jalali for showing and back to ISO
// before sending.
dayjs.extend(utc);
dayjs.extend(jalaliday);

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

function toFaDigits(input: string): string {
  return input.replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
}

/** ISO datetime/date -> Persian display string (e.g. ۱۴۰۵/۰۳/۳۰). */
export function toJalaliDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = dayjs(iso);
  if (!d.isValid()) return "—";
  return toFaDigits(d.calendar("jalali").format("YYYY/MM/DD"));
}

/** ISO datetime -> Persian date + time. */
export function toJalaliDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = dayjs(iso);
  if (!d.isValid()) return "—";
  return toFaDigits(d.calendar("jalali").format("YYYY/MM/DD HH:mm"));
}

/** A date-only value (YYYY-MM-DD) for API date params. */
export function toISODate(d: dayjs.Dayjs): string {
  return d.calendar("gregory").format("YYYY-MM-DD");
}

/** A full ISO datetime in UTC for API datetime params. */
export function toISODateTime(d: dayjs.Dayjs): string {
  return d.utc().toISOString();
}

export { dayjs };
