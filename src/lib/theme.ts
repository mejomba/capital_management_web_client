import { faIR } from "@mui/material/locale";
import { createTheme } from "@mui/material/styles";
import { faIR as dataGridFaIR } from "@mui/x-data-grid/locales";

export const theme = createTheme(
  {
    direction: "rtl",
  palette: {
    mode: "light",
    primary: { main: "#1f6f54" },
    secondary: { main: "#8a5cf6" },
    background: { default: "#f6f7f9" },
  },
  typography: {
    fontFamily: [
      "Vazirmatn",
      "system-ui",
      "-apple-system",
      "Segoe UI",
      "sans-serif",
    ].join(","),
  },
    shape: { borderRadius: 10 },
  },
  faIR,
  dataGridFaIR,
);
