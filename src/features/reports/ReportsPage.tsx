import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";

import { PageHeader } from "@/components/common/PageHeader";

import { AllocationReport } from "./AllocationReport";
import { InflationReport } from "./InflationReport";
import { PerformanceReport } from "./PerformanceReport";
import { PnlReport } from "./PnlReport";
import { ProjectionReport } from "./ProjectionReport";

const TABS = [
  { label: "سود و زیان", element: <PnlReport /> },
  { label: "بازدهی", element: <PerformanceReport /> },
  { label: "تخصیص دارایی", element: <AllocationReport /> },
  { label: "مقایسه با تورم", element: <InflationReport /> },
  { label: "پیش‌بینی", element: <ProjectionReport /> },
];

export function ReportsPage() {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <PageHeader title="گزارش‌ها" />
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
          {TABS.map((t) => (
            <Tab key={t.label} label={t.label} />
          ))}
        </Tabs>
      </Box>
      {TABS[tab].element}
    </Box>
  );
}
