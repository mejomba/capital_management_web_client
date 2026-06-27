import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, unwrap } from "@/api/client";
import type { components } from "@/api/generated/schema";
import type { AssetClass } from "@/lib/enums";

type AssetCreate = components["schemas"]["AssetCreate"];
type AssetUpdate = components["schemas"]["AssetUpdate"];

export interface AssetFilters {
  class?: AssetClass;
  q?: string;
  page?: number;
  pageSize?: number;
}

export function useAssets({ class: cls, q, page = 1, pageSize = 20 }: AssetFilters = {}) {
  return useQuery({
    queryKey: ["assets", { cls, q, page, pageSize }],
    queryFn: () =>
      unwrap(
        api.GET("/api/v1/assets", {
          params: { query: { class: cls, q: q || undefined, page, page_size: pageSize } },
        }),
      ),
  });
}

export function useCreateAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AssetCreate) => unwrap(api.POST("/api/v1/assets", { body })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assets"] });
      qc.invalidateQueries({ queryKey: ["lookups"] });
    },
  });
}

export function useUpdateAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AssetUpdate }) =>
      unwrap(api.PATCH("/api/v1/assets/{asset_id}", { params: { path: { asset_id: id } }, body })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assets"] });
      qc.invalidateQueries({ queryKey: ["lookups"] });
    },
  });
}
