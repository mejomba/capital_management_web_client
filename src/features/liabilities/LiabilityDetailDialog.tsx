import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import { useLiability } from "@/hooks/useLiabilities";
import { LIABILITY_EVENT_TYPE_LABELS } from "@/lib/enums";
import { formatMoney } from "@/lib/format";
import { toJalaliDateTime } from "@/lib/jalali";

import { LiabilityEventDialog } from "./LiabilityEventDialog";

interface Props {
  liabilityId: string | null;
  onClose: () => void;
}

function Stat({ label, value, currency }: { label: string; value: string; currency: string }) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6">{formatMoney(value, currency as "IRR" | "USD")}</Typography>
    </Paper>
  );
}

export function LiabilityDetailDialog({ liabilityId, onClose }: Props) {
  const { data, isLoading, isError, error } = useLiability(liabilityId);
  const [eventOpen, setEventOpen] = useState(false);

  return (
    <Dialog open={Boolean(liabilityId)} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{data ? data.name : "بدهی"}</DialogTitle>
      <DialogContent>
        {isLoading && <LoadingState />}
        {isError && <ErrorState error={error} />}
        {data && (
          <Stack spacing={3} mt={1}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                gap: 2,
              }}
            >
              <Stat label="اصل باقی‌مانده" value={data.balance.principal_outstanding} currency={data.currency} />
              <Stat label="بهره‌ی پرداخت‌نشده" value={data.balance.interest_unpaid} currency={data.currency} />
              <Stat label="مانده‌ی کل" value={data.balance.total_outstanding} currency={data.currency} />
            </Box>

            <Divider />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">رویدادها</Typography>
              <Button startIcon={<AddIcon />} variant="contained" size="small" onClick={() => setEventOpen(true)}>
                ثبت رویداد
              </Button>
            </Stack>

            {data.events.length === 0 ? (
              <EmptyState>رویدادی ثبت نشده است</EmptyState>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>تاریخ</TableCell>
                    <TableCell>نوع</TableCell>
                    <TableCell>مبلغ</TableCell>
                    <TableCell>سهم اصل</TableCell>
                    <TableCell>سهم بهره</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.events.map((ev) => (
                    <TableRow key={ev.id}>
                      <TableCell>{toJalaliDateTime(ev.occurred_at)}</TableCell>
                      <TableCell>{LIABILITY_EVENT_TYPE_LABELS[ev.type]}</TableCell>
                      <TableCell>{formatMoney(ev.amount, ev.currency as "IRR" | "USD")}</TableCell>
                      <TableCell>{formatMoney(ev.principal_component)}</TableCell>
                      <TableCell>{formatMoney(ev.interest_component)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <LiabilityEventDialog
              open={eventOpen}
              liabilityId={data.id}
              currency={data.currency}
              onClose={() => setEventOpen(false)}
            />
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
