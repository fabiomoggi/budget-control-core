function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export class MerchantName {
  private constructor(public readonly value: string) {}

  static of(value: string): MerchantName {
    const normalized = normalizeName(value);

    if (normalized.length < 2) {
      throw new Error("MerchantName must have at least 2 characters");
    }

    if (normalized.length > 120) {
      throw new Error("MerchantName must have at most 120 characters");
    }

    return new MerchantName(normalized);
  }
}