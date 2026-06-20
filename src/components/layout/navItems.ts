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
  { to: "/accounts", label: "حساب‌ها", ready: false },
  { to: "/assets", label: "دارایی‌ها", ready: false },
  { to: "/prices", label: "قیمت‌ها", ready: false },
  { to: "/transactions", label: "تراکنش‌ها", ready: false },
  { to: "/holdings", label: "موجودی", ready: false },
  { to: "/liabilities", label: "بدهی‌ها", ready: false },
  { to: "/goals", label: "اهداف", ready: false },
  { to: "/reports", label: "گزارش‌ها", ready: false },
  { to: "/settings", label: "تنظیمات", ready: false },
];
