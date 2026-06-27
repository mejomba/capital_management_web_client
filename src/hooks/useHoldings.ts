import { useQuery } from "@tanstack/react-query";

import { api, unwrap } from "@/api/client";

export function useHoldings(asOf?: string) {
  return useQuery({
    queryKey: ["holdings", { asOf }],
    queryFn: () =>
      unwrap(api.GET("/api/v1/holdings", { params: { query: { as_of: asOf } } })),
  });
}
