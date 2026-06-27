import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, unwrap } from "@/api/client";
import type { components } from "@/api/generated/schema";

type PriceCreate = components["schemas"]["PriceCreate"];

export interface PriceFilters {
  assetId?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

export function usePrices({ assetId, from, to, page = 1, pageSize = 100 }: PriceFilters) {
  return useQuery({
    queryKey: ["prices", { assetId, from, to, page, pageSize }],
    enabled: Boolean(assetId),
    queryFn: () =>
      unwrap(
        api.GET("/api/v1/prices", {
          params: { query: { asset_id: assetId, from, to, page, page_size: pageSize } },
        }),
      ),
  });
}

export function useCreatePrice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: PriceCreate) => unwrap(api.POST("/api/v1/prices", { body })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["prices"] });
      qc.invalidateQueries({ queryKey: ["holdings"] });
    },
  });
}

export function useCreatePricesBulk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: PriceCreate[]) => unwrap(api.POST("/api/v1/prices/bulk", { body })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["prices"] });
      qc.invalidateQueries({ queryKey: ["holdings"] });
    },
  });
}
