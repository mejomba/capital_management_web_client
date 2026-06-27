import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, unwrap } from "@/api/client";
import type { paths } from "@/api/generated/schema";
import type { TransactionType } from "@/lib/enums";

// The create body is the discriminated union of all 7 transaction-create shapes.
export type TransactionCreate = NonNullable<
  paths["/api/v1/transactions"]["post"]["requestBody"]
>["content"]["application/json"];

export interface TransactionFilters {
  type?: TransactionType;
  account_id?: string;
  asset_id?: string;
  from?: string;
  to?: string;
  tag?: string;
  page?: number;
  pageSize?: number;
}

export function useTransactions(filters: TransactionFilters) {
  const { type, account_id, asset_id, from, to, tag, page = 1, pageSize = 20 } = filters;
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: () =>
      unwrap(
        api.GET("/api/v1/transactions", {
          params: {
            query: {
              type,
              account_id,
              asset_id,
              from,
              to,
              tag: tag || undefined,
              page,
              page_size: pageSize,
            },
          },
        }),
      ),
  });
}

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: TransactionCreate) => unwrap(api.POST("/api/v1/transactions", { body })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["holdings"] });
    },
  });
}

export function useReverseTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      unwrap(api.POST("/api/v1/transactions/{txn_id}/reverse", { params: { path: { txn_id: id } } })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["holdings"] });
    },
  });
}

export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      unwrap(api.DELETE("/api/v1/transactions/{txn_id}", { params: { path: { txn_id: id } } })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["holdings"] });
    },
  });
}
