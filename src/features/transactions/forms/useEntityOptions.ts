import { useMemo } from "react";

import type { SelectOption } from "@/components/form/ControlledSelect";
import { useAllAccounts, useAllAssets } from "@/hooks/useLookups";

/** Account & asset dropdown options for transaction forms. */
export function useEntityOptions(): { accounts: SelectOption[]; assets: SelectOption[] } {
  const accounts = useAllAccounts();
  const assets = useAllAssets();
  return useMemo(
    () => ({
      accounts: (accounts.data?.items ?? []).map((a) => ({ value: a.id, label: a.name })),
      assets: (assets.data?.items ?? []).map((a) => ({ value: a.id, label: `${a.symbol} — ${a.name}` })),
    }),
    [accounts.data, assets.data],
  );
}
