import type { NormalizedTransactionDTO } from "../dtos/NormalizedTransactionDTO.js";

export interface TransactionFingerprintCanonicalizer {
  canonicalize(tx: NormalizedTransactionDTO): string;
}

export class DefaultTransactionFingerprintCanonicalizer
  implements TransactionFingerprintCanonicalizer
{
  canonicalize(tx: NormalizedTransactionDTO): string {
    const norm = (v: string | undefined) =>
      (v ?? "").trim().replace(/\s+/g, " ");

    const canonical = {
      date: norm(tx.date),
      amount: norm(tx.amount),
      currency: norm(tx.currency).toUpperCase(),
      merchantName: norm(tx.merchantName).toLowerCase() || undefined,
    };

    return JSON.stringify(canonical);
  }
}
