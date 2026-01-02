export interface NormalizedTransactionDTO {
  date: string;        // ISO: YYYY-MM-DD
  amount: string;      // decimal string, keeps sign
  currency: string;    // ISO 4217 (e.g., "BRL")
  merchantName: string;

  /**
   * Optional source reference (e.g., FITID from OFX).
   * Not guaranteed to exist across sources.
   */
  sourceRef?: string;
}
