import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, unwrap } from "@/api/client";
import type { components } from "@/api/generated/schema";

type LiabilityCreate = components["schemas"]["LiabilityCreate"];
type LiabilityEventCreate = components["schemas"]["LiabilityEventCreate"];

export function useLiabilities(page = 1, pageSize = 50) {
  return useQuery({
    queryKey: ["liabilities", { page, pageSize }],
    queryFn: () =>
      unwrap(api.GET("/api/v1/liabilities", { params: { query: { page, page_size: pageSize } } })),
  });
}

export function useLiability(id: string | null) {
  return useQuery({
    queryKey: ["liability", id],
    enabled: Boolean(id),
    queryFn: () =>
      unwrap(api.GET("/api/v1/liabilities/{liability_id}", { params: { path: { liability_id: id! } } })),
  });
}

export function useCreateLiability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: LiabilityCreate) => unwrap(api.POST("/api/v1/liabilities", { body })),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["liabilities"] }),
  });
}

export function useAddLiabilityEvent(liabilityId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: LiabilityEventCreate) =>
      unwrap(
        api.POST("/api/v1/liabilities/{liability_id}/events", {
          params: { path: { liability_id: liabilityId } },
          body,
        }),
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["liability", liabilityId] });
      qc.invalidateQueries({ queryKey: ["liabilities"] });
    },
  });
}
