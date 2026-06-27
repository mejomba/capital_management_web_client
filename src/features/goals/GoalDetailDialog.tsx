import { Chip, Dialog, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";

import { ErrorState, LoadingState } from "@/components/common/States";
import { useGoal } from "@/hooks/useGoals";
import { GOAL_STATUS_LABELS, GOAL_TYPE_LABELS } from "@/lib/enums";
import { toJalaliDate } from "@/lib/jalali";

import { GoalProgress } from "./GoalProgress";

interface Props {
  goalId: string | null;
  onClose: () => void;
}

export function GoalDetailDialog({ goalId, onClose }: Props) {
  const { data, isLoading, isError, error } = useGoal(goalId);

  return (
    <Dialog open={Boolean(goalId)} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{data ? data.title : "هدف"}</DialogTitle>
      <DialogContent>
        {isLoading && <LoadingState />}
        {isError && <ErrorState error={error} />}
        {data && (
          <Stack spacing={3} mt={1}>
            <Stack direction="row" spacing={1}>
              <Chip label={GOAL_TYPE_LABELS[data.type]} color="primary" variant="outlined" />
              <Chip label={GOAL_STATUS_LABELS[data.status]} />
              {data.target_date && (
                <Typography color="text.secondary" sx={{ alignSelf: "center" }}>
                  سررسید: {toJalaliDate(data.target_date)}
                </Typography>
              )}
            </Stack>
            <GoalProgress goal={data} />
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
