export class TransactionFingerprint {
  private constructor(private readonly value: string) {}

  static of(value: string): TransactionFingerprint {
    const v = (value ?? "").trim().toLowerCase();
    if (!/^[a-f0-9]{64}$/.test(v)) {
      throw new Error(`Invalid fingerprint (expected sha256 hex): ${value}`);
    }
    return new TransactionFingerprint(v);
  }

  toString(): string {
    return this.value;
  }

  equals(other: TransactionFingerprint): boolean {
    return this.value === other.value;
  }
}
