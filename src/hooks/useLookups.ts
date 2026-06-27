import { useQuery } from "@tanstack/react-query";

import { api, unwrap } from "@/api/client";

// Full lists (large page) for select inputs. Cached separately from paginated
// table queries so forms always have every account/asset to choose from.
const BIG_PAGE = 200;

export function useAllAccounts() {
  return useQuery({
    queryKey: ["lookups", "accounts"],
    queryFn: () =>
      unwrap(api.GET("/api/v1/accounts", { params: { query: { page: 1, page_size: BIG_PAGE } } })),
    staleTime: 60_000,
  });
}

export function useAllAssets() {
  return useQuery({
    queryKey: ["lookups", "assets"],
    queryFn: () =>
      unwrap(api.GET("/api/v1/assets", { params: { query: { page: 1, page_size: BIG_PAGE } } })),
    staleTime: 60_000,
  });
}
