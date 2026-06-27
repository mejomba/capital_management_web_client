import { Box, Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { ReactNode } from "react";

interface Props {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
}

export function PageHeader({ title, actionLabel, onAction, children }: Props) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} gap={2} flexWrap="wrap">
      <Typography variant="h4" fontWeight={700}>
        {title}
      </Typography>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
        {children}
        {actionLabel && onAction && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </Box>
    </Stack>
  );
}
