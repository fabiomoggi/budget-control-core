import type { NormalizedTransaction } from "./NormalizedTransaction.js";

export interface ImportTransactionItem {
  fingerprint: string;
  canonical: string;
  transaction: NormalizedTransaction;
}
