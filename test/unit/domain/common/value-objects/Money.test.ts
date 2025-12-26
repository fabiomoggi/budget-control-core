import { Money } from "../../../../../dist/domain/common/value-objects/Money.js";

describe("Money", () => {
  describe("of()", () => {
    it("creates Money for a finite amount in BRL", () => {
      const m = Money.of(10, "BRL");
      expect(m.amount).toBe(10);
      expect(m.currency).toBe("BRL");
    });

    it("creates Money for a finite amount in USD", () => {
      const m = Money.of(25.5, "USD");
      expect(m.amount).toBe(25.5);
      expect(m.currency).toBe("USD");
    });

    it("throws when amount is NaN", () => {
      expect(() => Money.of(Number.NaN, "BRL")).toThrow(
        "Money amount must be a finite number"
      );
    });

    it("throws when amount is Infinity", () => {
      expect(() => Money.of(Number.POSITIVE_INFINITY, "USD")).toThrow(
        "Money amount must be a finite number"
      );
    });

    it("throws when amount is -Infinity", () => {
      expect(() => Money.of(Number.NEGATIVE_INFINITY, "BRL")).toThrow(
        "Money amount must be a finite number"
      );
    });
  });

  describe("add()", () => {
    it("adds two Money values with same currency (BRL)", () => {
      const a = Money.of(10, "BRL");
      const b = Money.of(2.5, "BRL");

      const result = a.add(b);

      expect(result.amount).toBe(12.5);
      expect(result.currency).toBe("BRL");
    });

    it("adds two Money values with same currency (USD)", () => {
      const a = Money.of(10, "USD");
      const b = Money.of(2, "USD");

      const result = a.add(b);

      expect(result.amount).toBe(12);
      expect(result.currency).toBe("USD");
    });

    it("throws when adding different currencies", () => {
      const brl = Money.of(10, "BRL");
      const usd = Money.of(10, "USD");

      expect(() => brl.add(usd)).toThrow(
        "Cannot operate on different currencies (BRL vs USD)"
      );
    });
  });

  describe("subtract()", () => {
    it("subtracts two Money values with same currency", () => {
      const a = Money.of(10, "BRL");
      const b = Money.of(2.5, "BRL");

      const result = a.subtract(b);

      expect(result.amount).toBe(7.5);
      expect(result.currency).toBe("BRL");
    });

    it("throws when subtracting different currencies", () => {
      const brl = Money.of(10, "BRL");
      const usd = Money.of(3, "USD");

      expect(() => brl.subtract(usd)).toThrow(
        "Cannot operate on different currencies (BRL vs USD)"
      );
    });
  });

  describe("equals()", () => {
    it("returns true when amount and currency match", () => {
      const a = Money.of(10, "BRL");
      const b = Money.of(10, "BRL");

      expect(a.equals(b)).toBe(true);
      expect(b.equals(a)).toBe(true);
    });

    it("returns false when amount differs", () => {
      const a = Money.of(10, "USD");
      const b = Money.of(11, "USD");

      expect(a.equals(b)).toBe(false);
    });

    it("returns false when currency differs", () => {
      const a = Money.of(10, "BRL");
      const b = Money.of(10, "USD");

      expect(a.equals(b)).toBe(false);
    });
  });
});