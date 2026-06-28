import { useQuery } from "@tanstack/react-query";

import { api, unwrap } from "@/api/client";

export function useNetWorth(params: { from?: string; to?: string; currency: string }) {
  return useQuery({
    queryKey: ["net-worth", params],
    queryFn: () =>
      unwrap(
        api.GET("/api/v1/reports/net-worth", {
          params: { query: { from: params.from, to: params.to, currency: params.currency } },
        }),
      ),
  });
}

export function useAllocation(params: { as_of?: string; currency: string; goal_id?: string }) {
  return useQuery({
    queryKey: ["allocation", params],
    queryFn: () =>
      unwrap(
        api.GET("/api/v1/reports/allocation", {
          params: { query: { as_of: params.as_of, currency: params.currency, goal_id: params.goal_id } },
        }),
      ),
  });
}

export function usePnl(params: { from?: string; to?: string; group_by?: "class" | "account" | "asset" }) {
  return useQuery({
    queryKey: ["pnl", params],
    queryFn: () =>
      unwrap(
        api.GET("/api/v1/reports/pnl", {
          params: { query: { from: params.from, to: params.to, group_by: params.group_by } },
        }),
      ),
  });
}

export function usePerformance(params: { from: string; to: string }, enabled: boolean) {
  return useQuery({
    queryKey: ["performance", params],
    enabled,
    queryFn: () =>
      unwrap(
        api.GET("/api/v1/reports/performance", { params: { query: { from: params.from, to: params.to } } }),
      ),
  });
}

export function useInflationComparison(params: { from: string; to: string }, enabled: boolean) {
  return useQuery({
    queryKey: ["inflation-comparison", params],
    enabled,
    queryFn: () =>
      unwrap(
        api.GET("/api/v1/reports/inflation-comparison", {
          params: { query: { from: params.from, to: params.to } },
        }),
      ),
  });
}

export function useProjection(params: {
  horizon_months: number;
  monthly_contribution: string;
  scenario?: "pessimistic" | "realistic" | "optimistic";
}) {
  return useQuery({
    queryKey: ["projection", params],
    queryFn: () =>
      unwrap(
        api.GET("/api/v1/reports/projection", {
          params: {
            query: {
              horizon_months: params.horizon_months,
              monthly_contribution: params.monthly_contribution,
              scenario: params.scenario,
            },
          },
        }),
      ),
  });
}
