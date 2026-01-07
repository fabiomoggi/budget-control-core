import type { NormalizedTransactionDTO } from "../../../application/transaction/dtos/NormalizedTransactionDTO.js";

export class NubankCreditCardStatementParser {
  /**
   * Parse Nubank credit-card OFX content into normalized transactions.
   *
   * Bank-specific + format-specific (OFX).
   * Does NOT do idempotency, fingerprinting, merging, or persistence.
   */
  parseOfx(input: { file: Buffer; fileName?: string }): NormalizedTransactionDTO[] {
    const text = input.file.toString("utf-8");

    const currency = this.extractCurdef(text) ?? "BRL";
    const blocks = this.extractStmtTrnBlocks(text);

    const txs: NormalizedTransactionDTO[] = [];

    for (const block of blocks) {
      const dateRaw = this.extractTagValue(block, "DTPOSTED");
      const amountRaw = this.extractTagValue(block, "TRNAMT");
      const memo = this.extractTagValue(block, "MEMO");
      const name = this.extractTagValue(block, "NAME");
      const fitid = this.extractTagValue(block, "FITID");

      if (!dateRaw || !amountRaw) {
        // Skip malformed statement rows instead of throwing the whole import
        continue;
      }

      const date = this.normalizeOfxDate(dateRaw);
      const amount = this.normalizeAmount(amountRaw);

      // Nubank usually provides MEMO. Keep NAME as fallback.
      const merchantName = (memo ?? name ?? "").trim();

      // merchantName is required in NormalizedTransactionDTO; skip if not present.
      if (!merchantName) {
        continue;
      }

      txs.push({
        date,
        amount,
        currency,
        merchantName,
        sourceRef: fitid?.trim() || undefined,
      });
    }

    return txs;
  }

  private extractCurdef(text: string): string | undefined {
    const v = this.extractTagValue(text, "CURDEF");
    return v?.trim();
  }

  /**
   * OFX is SGML-like; tags may appear as <TAG>value (no closing tag),
   * or as <TAG>value</TAG>. This reads the first occurrence of <TAG>... up to
   * the next tag or line break.
   */
  private extractTagValue(source: string, tag: string): string | undefined {
    const re = new RegExp(`<${tag}>([^<\\r\\n]*)`, "i");
    const m = source.match(re);
    return m?.[1];
  }

  /**
   * Extract <STMTTRN> blocks. Many OFX files contain <STMTTRN>...</STMTTRN>.
   * Some omit closing tags. This handles both by splitting.
   */
  private extractStmtTrnBlocks(text: string): string[] {
    const parts = text.split(/<STMTTRN>/i);
    if (parts.length <= 1) return [];

    const blocks: string[] = [];
    for (const part of parts.slice(1)) {
      const endIdx = part.search(/<\/STMTTRN>/i);
      blocks.push(endIdx >= 0 ? part.slice(0, endIdx) : part);
    }
    return blocks;
  }

  /**
   * DTPOSTED formats commonly:
   * - YYYYMMDD
   * - YYYYMMDDHHMMSS
   * - YYYYMMDDHHMMSS.XXX
   * - YYYYMMDDHHMMSS[-/+TZ]
   *
   * We normalize to ISO date YYYY-MM-DD.
   */
  private normalizeOfxDate(dtposted: string): string {
    const digits = dtposted.replace(/[^\d]/g, "");
    const yyyymmdd = digits.slice(0, 8);
    if (yyyymmdd.length !== 8) {
      throw new Error(`Invalid OFX DTPOSTED value: ${dtposted}`);
    }
    const yyyy = yyyymmdd.slice(0, 4);
    const mm = yyyymmdd.slice(4, 6);
    const dd = yyyymmdd.slice(6, 8);
    return `${yyyy}-${mm}-${dd}`;
  }

  /**
   * TRNAMT is usually already a decimal with sign: -123.45
   * Keep it as a decimal string (don’t float parse here).
   */
  private normalizeAmount(trnamt: string): string {
    return trnamt.trim();
  }
}
