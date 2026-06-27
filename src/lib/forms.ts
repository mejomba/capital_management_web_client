// Convert empty form strings to undefined so optional API fields are omitted
// rather than sent as "".
export function blank<T extends string | null | undefined>(v: T): string | undefined {
  return v === "" || v === null || v === undefined ? undefined : v;
}
