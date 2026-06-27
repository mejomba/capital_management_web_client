import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, unwrap } from "@/api/client";
import type { components } from "@/api/generated/schema";

type GoalCreate = components["schemas"]["GoalCreate"];
type GoalUpdate = components["schemas"]["GoalUpdate"];

export function useGoals(page = 1, pageSize = 50) {
  return useQuery({
    queryKey: ["goals", { page, pageSize }],
    queryFn: () =>
      unwrap(api.GET("/api/v1/goals", { params: { query: { page, page_size: pageSize } } })),
  });
}

export function useGoal(id: string | null) {
  return useQuery({
    queryKey: ["goal", id],
    enabled: Boolean(id),
    queryFn: () => unwrap(api.GET("/api/v1/goals/{goal_id}", { params: { path: { goal_id: id! } } })),
  });
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: GoalCreate) => unwrap(api.POST("/api/v1/goals", { body })),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
}

export function useUpdateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: GoalUpdate }) =>
      unwrap(api.PATCH("/api/v1/goals/{goal_id}", { params: { path: { goal_id: id } }, body })),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["goals"] });
      qc.invalidateQueries({ queryKey: ["goal", vars.id] });
    },
  });
}
