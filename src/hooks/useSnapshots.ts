import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api, unwrap } from "@/api/client";

/** Operational rebuild/backfill of portfolio snapshots over a date range. */
export function useRebuildSnapshots() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (range: { from: string; to: string }) =>
      unwrap(api.POST("/api/v1/snapshots/rebuild", { body: range })),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["net-worth"] }),
  });
}
