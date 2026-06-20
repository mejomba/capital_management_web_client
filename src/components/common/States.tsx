import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import type { ReactNode } from "react";

export function LoadingState({ label = "در حال بارگذاری…" }: { label?: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, py: 6 }}>
      <CircularProgress size={24} />
      <Typography color="text.secondary">{label}</Typography>
    </Box>
  );
}

export function ErrorState({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : "خطایی رخ داد";
  return (
    <Alert severity="error" sx={{ my: 2 }}>
      {message}
    </Alert>
  );
}

export function EmptyState({ children = "موردی برای نمایش نیست" }: { children?: ReactNode }) {
  return (
    <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
      <Typography>{children}</Typography>
    </Box>
  );
}
