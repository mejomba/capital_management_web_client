import createClient, { type Middleware } from "openapi-fetch";

import type { paths } from "@/api/generated/schema";

import { clearToken, getToken, notifyUnauthorized } from "./tokenStore";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

// Attaches the JWT to every request, and on a 401 clears the token and lets the
// app redirect to /login.
const authMiddleware: Middleware = {
  onRequest({ request }) {
    const token = getToken();
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  },
  onResponse({ response }) {
    if (response.status === 401) {
      clearToken();
      notifyUnauthorized();
    }
    return response;
  },
};

export const api = createClient<paths>({ baseUrl });
api.use(authMiddleware);

/**
 * Unwrap an openapi-fetch result, throwing the API error envelope on failure so
 * React Query treats it as an error. Never recomputes anything — pure transport.
 */
export async function unwrap<T>(
  result: Promise<{ data?: T; error?: unknown }>,
): Promise<T> {
  const { data, error } = await result;
  if (error !== undefined || data === undefined) {
    throw new ApiError(error);
  }
  return data;
}

type ErrorEnvelope = { error?: { code?: string; message?: string; details?: unknown } };

export class ApiError extends Error {
  code: string;
  details: unknown;

  constructor(raw: unknown) {
    const env = raw as ErrorEnvelope | undefined;
    const message = env?.error?.message ?? "خطای ناشناخته در ارتباط با سرور";
    super(message);
    this.name = "ApiError";
    this.code = env?.error?.code ?? "unknown";
    this.details = env?.error?.details;
  }
}
