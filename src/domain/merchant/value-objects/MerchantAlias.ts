function normalizeAlias(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export class MerchantAlias {
  private constructor(public readonly value: string) {}

  static of(value: string): MerchantAlias {
    const normalized = normalizeAlias(value);

    if (normalized.length < 2) {
      throw new Error("MerchantAlias must have at least 2 characters");
    }

    if (normalized.length > 120) {
      throw new Error("MerchantAlias must have at most 120 characters");
    }

    return new MerchantAlias(normalized);
  }

  equals(other: MerchantAlias): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase();
  }
}
