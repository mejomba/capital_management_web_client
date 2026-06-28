import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, unwrap } from "@/api/client";
import type { components } from "@/api/generated/schema";

type AssumptionsUpdate = components["schemas"]["AssumptionsUpdate"];
type InflationRateCreate = components["schemas"]["InflationRateCreate"];

export function useAssumptions() {
  return useQuery({
    queryKey: ["assumptions"],
    queryFn: () => unwrap(api.GET("/api/v1/assumptions", {})),
  });
}

export function useUpdateAssumptions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AssumptionsUpdate) => unwrap(api.PUT("/api/v1/assumptions", { body })),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["assumptions"] }),
  });
}

export function useInflationRates() {
  return useQuery({
    queryKey: ["inflation"],
    queryFn: () => unwrap(api.GET("/api/v1/inflation", {})),
  });
}

export function useCreateInflationRate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: InflationRateCreate) => unwrap(api.POST("/api/v1/inflation", { body })),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inflation"] }),
  });
}
