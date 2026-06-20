import { createBrowserRouter, Navigate } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import { LoginPage } from "@/features/auth/LoginPage";
import { RegisterPage } from "@/features/auth/RegisterPage";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { ComingSoon } from "@/features/misc/ComingSoon";

import { ProtectedRoute, PublicOnlyRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/", element: <DashboardPage /> },
          { path: "/accounts", element: <ComingSoon title="حساب‌ها" /> },
          { path: "/assets", element: <ComingSoon title="دارایی‌ها" /> },
          { path: "/prices", element: <ComingSoon title="قیمت‌ها" /> },
          { path: "/transactions", element: <ComingSoon title="تراکنش‌ها" /> },
          { path: "/holdings", element: <ComingSoon title="موجودی" /> },
          { path: "/liabilities", element: <ComingSoon title="بدهی‌ها" /> },
          { path: "/goals", element: <ComingSoon title="اهداف" /> },
          { path: "/reports", element: <ComingSoon title="گزارش‌ها" /> },
          { path: "/settings", element: <ComingSoon title="تنظیمات" /> },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
