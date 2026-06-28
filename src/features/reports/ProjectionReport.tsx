import { Card, CardContent, Stack, TextField } from "@mui/material";
import { useState } from "react";

import { ProjectionChart } from "@/components/charts/ProjectionChart";
import { ErrorState, LoadingState } from "@/components/common/States";
import { useProjection } from "@/hooks/useReports";

export function ProjectionReport() {
  const [horizon, setHorizon] = useState(12);
  const [contribution, setContribution] = useState("0");

  const { data, isLoading, isError, error } = useProjection({
    horizon_months: horizon,
    monthly_contribution: contribution || "0",
  });

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <TextField
          type="number"
          size="small"
          label="افق (ماه)"
          value={horizon}
          onChange={(e) => setHorizon(Math.max(1, Number(e.target.value) || 1))}
          sx={{ width: 140 }}
        />
        <TextField
          size="small"
          label="واریز ماهانه (ریال)"
          value={contribution}
          onChange={(e) => setContribution(e.target.value)}
          sx={{ width: 200 }}
        />
      </Stack>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState error={error} />
      ) : data ? (
        <Card>
          <CardContent>
            <ProjectionChart data={data} />
          </CardContent>
        </Card>
      ) : null}
    </Stack>
  );
}
