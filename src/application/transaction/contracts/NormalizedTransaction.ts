export interface NormalizedTransaction {
    /**
       * Posting date in ISO-8601 format (YYYY-MM-DD).
       * Normalized across all sources (OFX, CSV, API, etc).
       */
    date: string;

    /**
     * Monetary amount as a decimal string (e.g. "-160.00").
     * Kept as string to avoid floating point issues.
     */
    amount: string;

    /**
     * ISO 4217 currency code (e.g. "BRL", "USD").
     */
    currency: string;

    /**
     * Normalized merchant / payee name.
     * Must NOT be empty.
     */
    merchantName: string;

    /**
     * Optional reference provided by the source system
     * (e.g. OFX FITID, API transaction id).
     * Used for provenance, NOT identity.
     */
    sourceRef?: string;
}