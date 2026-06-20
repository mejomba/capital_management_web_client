import { Box, Typography } from "@mui/material";

export function ComingSoon({ title }: { title: string }) {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={1}>
        {title}
      </Typography>
      <Typography color="text.secondary">این بخش به‌زودی اضافه می‌شود.</Typography>
    </Box>
  );
}
