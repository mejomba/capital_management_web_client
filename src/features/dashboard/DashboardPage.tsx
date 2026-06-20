import { Box, Card, CardContent, Typography } from "@mui/material";

import { ErrorState, LoadingState } from "@/components/common/States";
import { useAuth } from "@/context/AuthContext";
import { useMe } from "@/hooks/useAuth";

export function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const { data, isLoading, isError, error } = useMe(isAuthenticated);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState error={error} />;

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={1}>
        داشبورد
      </Typography>
      <Typography color="text.secondary" mb={3}>
        خوش آمدید{data?.display_name ? `، ${data.display_name}` : ""}.
      </Typography>
      <Card>
        <CardContent>
          <Typography color="text.secondary">
            نمودار ارزش خالص و ترکیب دارایی در زیرفاز داشبورد و گزارش‌ها اضافه می‌شود.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
