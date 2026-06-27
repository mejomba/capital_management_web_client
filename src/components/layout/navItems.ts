export interface NavItem {
  to: string;
  label: string;
  /** Implemented in this sub-phase? Unimplemented routes show a "coming soon" page. */
  ready: boolean;
}

// Full app navigation. `ready` is flipped on as each sub-phase lands so the shell
// always looks complete without dead 404 links.
export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "داشبورد", ready: false },
  { to: "/accounts", label: "حساب‌ها", ready: true },
  { to: "/assets", label: "دارایی‌ها", ready: true },
  { to: "/prices", label: "قیمت‌ها", ready: true },
  { to: "/transactions", label: "تراکنش‌ها", ready: true },
  { to: "/holdings", label: "موجودی", ready: true },
  { to: "/liabilities", label: "بدهی‌ها", ready: true },
  { to: "/goals", label: "اهداف", ready: true },
  { to: "/reports", label: "گزارش‌ها", ready: false },
  { to: "/settings", label: "تنظیمات", ready: false },
];
