// test/unit/domain/merchant/MerchantAlias.test.ts
import { MerchantAlias } from "../../../../../dist/domain/merchant/value-objects/MerchantAlias.js";

describe("MerchantAlias", () => {
  describe("of()", () => {
    it("creates a MerchantAlias for a valid alias", () => {
      const alias = MerchantAlias.of("CINEMARK BRASIL");
      expect(alias.value).toBe("CINEMARK BRASIL");
    });

    it("trims and collapses internal whitespace", () => {
      const alias = MerchantAlias.of("  CINEMARK   BRASIL  ");
      expect(alias.value).toBe("CINEMARK BRASIL");
    });

    it("throws when alias has less than 2 characters after normalization", () => {
      expect(() => MerchantAlias.of("A")).toThrow(
        "MerchantAlias must have at least 2 characters"
      );
      expect(() => MerchantAlias.of("   ")).toThrow(
        "MerchantAlias must have at least 2 characters"
      );
    });

    it("throws when alias exceeds 120 characters", () => {
      const long = "a".repeat(121);
      expect(() => MerchantAlias.of(long)).toThrow(
        "MerchantAlias must have at most 120 characters"
      );
    });
  });

  describe("equals()", () => {
    it("treats aliases as equal ignoring case", () => {
      const a = MerchantAlias.of("CINEMARK BRASIL");
      const b = MerchantAlias.of("cinemark brasil");
      expect(a.equals(b)).toBe(true);
      expect(b.equals(a)).toBe(true);
    });

    it("returns false for different aliases", () => {
      const a = MerchantAlias.of("CINEMARK BRASIL");
      const b = MerchantAlias.of("CINEMARK SHOPPING");
      expect(a.equals(b)).toBe(false);
    });
  });
});
