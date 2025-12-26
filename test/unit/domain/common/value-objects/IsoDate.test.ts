import { IsoDate } from "../../../../../dist/domain/common/value-objects/IsoDate.js";

describe("IsoDate", () => {
  describe("of()", () => {
    it("creates an IsoDate for a valid YYYY-MM-DD date", () => {
      const date = IsoDate.of("2025-01-15");
      expect(date.value).toBe("2025-01-15");
    });

    it("trims leading and trailing whitespace", () => {
      const date = IsoDate.of("  2025-01-15  ");
      expect(date.value).toBe("2025-01-15");
    });

    it("throws for invalid format", () => {
      expect(() => IsoDate.of("2025/01/15")).toThrow(
        "IsoDate must be in YYYY-MM-DD format"
      );
      expect(() => IsoDate.of("15-01-2025")).toThrow(
        "IsoDate must be in YYYY-MM-DD format"
      );
      expect(() => IsoDate.of("20250115")).toThrow(
        "IsoDate must be in YYYY-MM-DD format"
      );
    });

    it("throws for non-existent calendar dates", () => {
      expect(() => IsoDate.of("2024-02-30")).toThrow(
        "Invalid calendar date: 2024-02-30"
      );
      expect(() => IsoDate.of("2023-04-31")).toThrow(
        "Invalid calendar date: 2023-04-31"
      );
    });

    it("accepts leap day on leap years", () => {
      const date = IsoDate.of("2024-02-29");
      expect(date.value).toBe("2024-02-29");
    });

    it("rejects leap day on non-leap years", () => {
      expect(() => IsoDate.of("2023-02-29")).toThrow(
        "Invalid calendar date: 2023-02-29"
      );
    });
  });

  describe("equals()", () => {
    it("returns true for same date values", () => {
      const a = IsoDate.of("2025-01-15");
      const b = IsoDate.of("2025-01-15");

      expect(a.equals(b)).toBe(true);
      expect(b.equals(a)).toBe(true);
    });

    it("returns false for different dates", () => {
      const a = IsoDate.of("2025-01-15");
      const b = IsoDate.of("2025-01-16");

      expect(a.equals(b)).toBe(false);
    });
  });

  describe("comparison", () => {
    it("isBefore returns true when date is earlier", () => {
      const a = IsoDate.of("2025-01-01");
      const b = IsoDate.of("2025-01-31");

      expect(a.isBefore(b)).toBe(true);
      expect(b.isBefore(a)).toBe(false);
    });

    it("isAfter returns true when date is later", () => {
      const a = IsoDate.of("2025-02-01");
      const b = IsoDate.of("2025-01-31");

      expect(a.isAfter(b)).toBe(true);
      expect(b.isAfter(a)).toBe(false);
    });

    it("isBefore and isAfter return false for equal dates", () => {
      const a = IsoDate.of("2025-01-15");
      const b = IsoDate.of("2025-01-15");

      expect(a.isBefore(b)).toBe(false);
      expect(a.isAfter(b)).toBe(false);
    });
  });
});
