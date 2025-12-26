// test/unit/domain/merchant/MerchantName.test.ts
import { MerchantName } from "../../../../../dist/domain/merchant/value-objects/MerchantName.js";

describe("MerchantName", () => {
  describe("of()", () => {
    it("creates a MerchantName for a valid name", () => {
      const name = MerchantName.of("Cinemark Brasil");
      expect(name.value).toBe("Cinemark Brasil");
    });

    it("trims and collapses internal whitespace", () => {
      const name = MerchantName.of("  Cinemark   Brasil  ");
      expect(name.value).toBe("Cinemark Brasil");
    });

    it("throws when name has less than 2 characters after normalization", () => {
      expect(() => MerchantName.of("A")).toThrow(
        "MerchantName must have at least 2 characters"
      );
      expect(() => MerchantName.of("   ")).toThrow(
        "MerchantName must have at least 2 characters"
      );
    });

    it("throws when name exceeds 120 characters", () => {
      const long = "a".repeat(121);
      expect(() => MerchantName.of(long)).toThrow(
        "MerchantName must have at most 120 characters"
      );
    });
  });
});
