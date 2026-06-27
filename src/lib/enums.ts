import type { components } from "@/api/generated/schema";

type AccountType = components["schemas"]["AccountType"];
type AssetClass = components["schemas"]["AssetClass"];
type TransactionType = components["schemas"]["TransactionType"];
type TransactionStatus = components["schemas"]["TransactionStatus"];

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

export const ACCOUNT_TYPES = Object.keys(ACCOUNT_TYPE_LABELS) as AccountType[];
export const ASSET_CLASSES = Object.keys(ASSET_CLASS_LABELS) as AssetClass[];
export const TRANSACTION_TYPES = Object.keys(TRANSACTION_TYPE_LABELS) as TransactionType[];

export type { AccountType, AssetClass, TransactionType, TransactionStatus };
