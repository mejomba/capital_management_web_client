import { defineConfig } from "orval";

// We only use orval for its `zod` target: form validation schemas generated
// directly from the backend OpenAPI, so client validation matches the backend
// byte-for-byte (no hand-written rules that could drift and cause surprise 422s).
// The typed HTTP client/types come from openapi-typescript + openapi-fetch.
export default defineConfig({
  zod: {
    input: "./openapi.json",
    output: {
      mode: "single",
      client: "zod",
      target: "./src/api/generated/zod.ts",
      fileExtension: ".ts",
    },
  },
});
