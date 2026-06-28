import { createBrowserRouter, Navigate } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import { AccountsPage } from "@/features/accounts/AccountsPage";
import { AssetsPage } from "@/features/assets/AssetsPage";
import { LoginPage } from "@/features/auth/LoginPage";
import { RegisterPage } from "@/features/auth/RegisterPage";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { GoalsPage } from "@/features/goals/GoalsPage";
import { HoldingsPage } from "@/features/holdings/HoldingsPage";
import { LiabilitiesPage } from "@/features/liabilities/LiabilitiesPage";
import { PricesPage } from "@/features/prices/PricesPage";
import { ReportsPage } from "@/features/reports/ReportsPage";
import { SettingsPage } from "@/features/settings/SettingsPage";
import { TransactionsPage } from "@/features/transactions/TransactionsPage";

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
          { path: "/accounts", element: <AccountsPage /> },
          { path: "/assets", element: <AssetsPage /> },
          { path: "/prices", element: <PricesPage /> },
          { path: "/transactions", element: <TransactionsPage /> },
          { path: "/holdings", element: <HoldingsPage /> },
          { path: "/liabilities", element: <LiabilitiesPage /> },
          { path: "/goals", element: <GoalsPage /> },
          { path: "/reports", element: <ReportsPage /> },
          { path: "/settings", element: <SettingsPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
