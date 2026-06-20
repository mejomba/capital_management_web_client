import { useMutation, useQuery } from "@tanstack/react-query";

import { api, unwrap } from "@/api/client";
import type { components } from "@/api/generated/schema";

type RegisterBody = components["schemas"]["RegisterRequest"];
type LoginBody = components["schemas"]["LoginRequest"];

export function useMe(enabled: boolean) {
  return useQuery({
    queryKey: ["me"],
    enabled,
    queryFn: () => unwrap(api.GET("/api/v1/auth/me", {})),
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: (body: LoginBody) =>
      unwrap(api.POST("/api/v1/auth/login", { body })),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (body: RegisterBody) =>
      unwrap(api.POST("/api/v1/auth/register", { body })),
  });
}
