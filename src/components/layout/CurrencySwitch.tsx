import { ToggleButton, ToggleButtonGroup } from "@mui/material";

import { useCurrency, type CurrencyMode } from "@/context/CurrencyContext";

const OPTIONS: { value: CurrencyMode; label: string }[] = [
  { value: "IRR", label: "ریال" },
  { value: "USD", label: "دلار" },
  { value: "both", label: "هر دو" },
];

export function CurrencySwitch() {
  const { mode, setMode } = useCurrency();
  return (
    <ToggleButtonGroup
      size="small"
      exclusive
      value={mode}
      onChange={(_, next: CurrencyMode | null) => next && setMode(next)}
      color="primary"
      sx={{ bgcolor: "background.paper" }}
    >
      {OPTIONS.map((o) => (
        <ToggleButton key={o.value} value={o.value}>
          {o.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
