export interface TransactionFingerprintGeneratorPort {
  generate(canonical: string): string;
}
