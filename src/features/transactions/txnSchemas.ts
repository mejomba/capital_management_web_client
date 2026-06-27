import type { z } from "zod";

import { createTransactionApiV1TransactionsPostBody as txnUnion } from "@/api/generated/zod";
import type { components } from "@/api/generated/schema";

// The generated transaction body is a discriminated union of the 7 create
// shapes (same order as the OpenAPI anyOf): deposit, withdrawal, income, fee,
// expense, trade, transfer. We pick the variant per form so each form validates
// with the exact backend schema — no hand-written rules.
const options = txnUnion.options;

export const depositSchema = options[0] as unknown as z.ZodType<components["schemas"]["DepositCreate"]>;
export const withdrawalSchema = options[1] as unknown as z.ZodType<components["schemas"]["WithdrawalCreate"]>;
export const incomeSchema = options[2] as unknown as z.ZodType<components["schemas"]["IncomeCreate"]>;
export const tradeSchema = options[5] as unknown as z.ZodType<components["schemas"]["TradeCreate"]>;
export const transferSchema = options[6] as unknown as z.ZodType<components["schemas"]["TransferCreate"]>;

export type SingleLegType = "deposit" | "withdrawal" | "income";

export const SINGLE_LEG_SCHEMAS = {
  deposit: depositSchema,
  withdrawal: withdrawalSchema,
  income: incomeSchema,
} as const;
