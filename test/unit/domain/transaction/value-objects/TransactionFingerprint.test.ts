import { TransactionFingerprint } from "../../../../../dist/domain/transaction/value-objects/TransactionFingerprint.js";

describe("TransactionFingerprint", () => {
  const validHash =
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  const anotherValidHash =
    "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

  describe("of()", () => {
    it("creates from a valid sha256 hex string", () => {
      const fp = TransactionFingerprint.of(validHash);
      expect(fp.toString()).toBe(validHash);
    });

    it("normalizes to lowercase", () => {
      const fp = TransactionFingerprint.of(validHash.toUpperCase());
      expect(fp.toString()).toBe(validHash);
    });

    it("throws for empty", () => {
      expect(() => TransactionFingerprint.of("")).toThrow();
      expect(() => TransactionFingerprint.of("   ")).toThrow();
    });

    it("throws for non-hex", () => {
      expect(() => TransactionFingerprint.of("z".repeat(64))).toThrow();
    });

    it("throws for wrong length", () => {
      expect(() => TransactionFingerprint.of("a".repeat(63))).toThrow();
      expect(() => TransactionFingerprint.of("a".repeat(65))).toThrow();
    });
  });

  describe("equals()", () => {
    it("is true for same value", () => {
      expect(TransactionFingerprint.of(validHash).equals(TransactionFingerprint.of(validHash))).toBe(true);
    });

    it("is false for different values", () => {
      expect(TransactionFingerprint.of(validHash).equals(TransactionFingerprint.of(anotherValidHash))).toBe(false);
    });
  });
});
