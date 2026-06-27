import type { components } from "@/api/generated/schema";

type AccountType = components["schemas"]["AccountType"];
type AssetClass = components["schemas"]["AssetClass"];
type TransactionType = components["schemas"]["TransactionType"];
type TransactionStatus = components["schemas"]["TransactionStatus"];
type LiabilityType = components["schemas"]["LiabilityType"];
type LiabilityEventType = components["schemas"]["LiabilityEventType"];
type GoalType = components["schemas"]["GoalType"];
type GoalStatus = components["schemas"]["GoalStatus"];

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  bank: "بانک",
  exchange: "صرافی",
  brokerage: "کارگزاری",
  wallet: "کیف پول",
  physical: "فیزیکی",
  property: "ملک",
  other: "سایر",
};

export const ASSET_CLASS_LABELS: Record<AssetClass, string> = {
  equity: "سهام",
  fund: "صندوق",
  crypto: "رمزارز",
  metal: "فلز گران‌بها",
  forex: "ارز",
  real_estate: "املاک",
  fiat: "نقد/ارز پایه",
  other: "سایر",
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  deposit: "واریز",
  withdrawal: "برداشت",
  trade: "معامله",
  transfer: "انتقال",
  income: "درآمد",
  fee: "کارمزد",
  expense: "هزینه",
};

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  active: "فعال",
  reversed: "باطل‌شده",
};

export const LIABILITY_TYPE_LABELS: Record<LiabilityType, string> = {
  loan: "وام",
  mortgage: "رهن/وام مسکن",
  installment: "اقساطی",
  credit: "اعتباری",
  other: "سایر",
};

export const LIABILITY_EVENT_TYPE_LABELS: Record<LiabilityEventType, string> = {
  disbursement: "دریافت وام",
  repayment: "بازپرداخت",
  interest: "شناسایی بهره",
};

export const GOAL_TYPE_LABELS: Record<GoalType, string> = {
  target_net_worth: "ارزش خالص هدف",
  target_return: "بازدهی هدف",
  target_allocation: "تخصیص هدف",
  custom: "سفارشی",
};

export const GOAL_STATUS_LABELS: Record<GoalStatus, string> = {
  active: "فعال",
  achieved: "محقق‌شده",
  archived: "بایگانی",
};

export const ACCOUNT_TYPES = Object.keys(ACCOUNT_TYPE_LABELS) as AccountType[];
export const ASSET_CLASSES = Object.keys(ASSET_CLASS_LABELS) as AssetClass[];
export const TRANSACTION_TYPES = Object.keys(TRANSACTION_TYPE_LABELS) as TransactionType[];
export const LIABILITY_TYPES = Object.keys(LIABILITY_TYPE_LABELS) as LiabilityType[];
export const LIABILITY_EVENT_TYPES = Object.keys(LIABILITY_EVENT_TYPE_LABELS) as LiabilityEventType[];
export const GOAL_TYPES = Object.keys(GOAL_TYPE_LABELS) as GoalType[];
export const GOAL_STATUSES = Object.keys(GOAL_STATUS_LABELS) as GoalStatus[];

export type {
  AccountType,
  AssetClass,
  TransactionType,
  TransactionStatus,
  LiabilityType,
  LiabilityEventType,
  GoalType,
  GoalStatus,
};
