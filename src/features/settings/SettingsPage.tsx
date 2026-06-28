import { Box, Stack } from "@mui/material";

import { PageHeader } from "@/components/common/PageHeader";

import { AssumptionsForm } from "./AssumptionsForm";
import { InflationManager } from "./InflationManager";

export function SettingsPage() {
  return (
    <Box>
      <PageHeader title="تنظیمات" />
      <Stack spacing={3}>
        <AssumptionsForm />
        <InflationManager />
      </Stack>
    </Box>
  );
}
