import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, unwrap } from "@/api/client";
import type { components } from "@/api/generated/schema";

type AccountCreate = components["schemas"]["AccountCreate"];
type AccountUpdate = components["schemas"]["AccountUpdate"];

export function useAccounts(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["accounts", { page, pageSize }],
    queryFn: () =>
      unwrap(api.GET("/api/v1/accounts", { params: { query: { page, page_size: pageSize } } })),
  });
}

export function useCreateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AccountCreate) => unwrap(api.POST("/api/v1/accounts", { body })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounts"] });
      qc.invalidateQueries({ queryKey: ["lookups"] });
    },
  });
}

export function useUpdateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AccountUpdate }) =>
      unwrap(api.PATCH("/api/v1/accounts/{account_id}", { params: { path: { account_id: id } }, body })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounts"] });
      qc.invalidateQueries({ queryKey: ["lookups"] });
    },
  });
}

export function useDeleteAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      unwrap(api.DELETE("/api/v1/accounts/{account_id}", { params: { path: { account_id: id } } })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounts"] });
      qc.invalidateQueries({ queryKey: ["lookups"] });
    },
  });
}
