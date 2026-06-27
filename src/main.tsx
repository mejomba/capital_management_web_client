import { CacheProvider } from "@emotion/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AdapterMomentJalaali } from "@mui/x-date-pickers/AdapterMomentJalaali";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import moment from "moment-jalaali";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { queryClient } from "@/api/queryClient";
import { AuthProvider } from "@/context/AuthContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { rtlCache } from "@/lib/rtlCache";
import { theme } from "@/lib/theme";
import { router } from "@/routes/router";

import "./index.css";

moment.loadPersian({ dialect: "persian-modern", usePersianDigits: false });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterMomentJalaali}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <CurrencyProvider>
                <RouterProvider router={router} />
              </CurrencyProvider>
            </AuthProvider>
          </QueryClientProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </CacheProvider>
  </React.StrictMode>,
);
