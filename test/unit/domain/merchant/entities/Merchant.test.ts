// test/unit/domain/merchant/Merchant.test.ts
import { Merchant } from "../../../../../dist/domain/merchant/entities/Merchant.js";
import { EntityId } from "../../../../../dist/domain/common/value-objects/EntityId.js";
import { IsoDate } from "../../../../../dist/domain/common/value-objects/IsoDate.js";
import { MerchantName } from "../../../../../dist/domain/merchant/value-objects/MerchantName.js";
import { MerchantAlias } from "../../../../../dist/domain/merchant/value-objects/MerchantAlias.js";

describe("Merchant", () => {
  const id = EntityId.of("550e8400-e29b-41d4-a716-446655440000");
  const createdAt = IsoDate.of("2025-01-01");
  const updatedAt = IsoDate.of("2025-01-01");

  describe("create()", () => {
    it("creates a Merchant with required fields and empty aliases by default", () => {
      const merchant = Merchant.create({
        id,
        name: MerchantName.of("Cinemark Brasil"),
        createdAt,
        updatedAt,
      });

      expect(merchant.id.equals(id)).toBe(true);
      expect(merchant.name.value).toBe("Cinemark Brasil");
      expect(merchant.createdAt.value).toBe("2025-01-01");
      expect(merchant.updatedAt.value).toBe("2025-01-01");
      expect(merchant.aliases).toEqual([]);
    });

    it("deduplicates aliases case-insensitively on create()", () => {
      const merchant = Merchant.create({
        id,
        name: MerchantName.of("Cinemark Brasil"),
        createdAt,
        updatedAt,
        aliases: [
          MerchantAlias.of("CINEMARK BRASIL"),
          MerchantAlias.of("cinemark brasil"), // duplicate
          MerchantAlias.of("Cinemark - Shopping Eldorado"),
        ],
      });

      expect(merchant.aliases).toHaveLength(2);
      expect(merchant.aliases.map((a) => a.value)).toEqual([
        "CINEMARK BRASIL",
        "Cinemark - Shopping Eldorado",
      ]);
    });
  });

  describe("updateName()", () => {
    it("returns a new Merchant with updated name and updatedAt (immutable)", () => {
      const merchant = Merchant.create({
        id,
        name: MerchantName.of("Cinemark Brasil"),
        createdAt,
        updatedAt,
        aliases: [MerchantAlias.of("CINEMARK BRASIL")],
      });

      const nextUpdatedAt = IsoDate.of("2025-01-02");
      const updated = merchant.updateName(
        MerchantName.of("Cinemark"),
        nextUpdatedAt
      );

      expect(updated).not.toBe(merchant);

      // changed fields
      expect(updated.name.value).toBe("Cinemark");
      expect(updated.updatedAt.value).toBe("2025-01-02");

      // unchanged fields
      expect(updated.id.equals(merchant.id)).toBe(true);
      expect(updated.createdAt.value).toBe(merchant.createdAt.value);
      expect(updated.aliases).toEqual(merchant.aliases);

      // original unchanged
      expect(merchant.name.value).toBe("Cinemark Brasil");
      expect(merchant.updatedAt.value).toBe("2025-01-01");
    });
  });

  describe("addAlias()", () => {
    it("returns a new Merchant with the alias added and updatedAt updated", () => {
      const merchant = Merchant.create({
        id,
        name: MerchantName.of("Cinemark Brasil"),
        createdAt,
        updatedAt,
      });

      const nextUpdatedAt = IsoDate.of("2025-01-03");
      const updated = merchant.addAlias(
        MerchantAlias.of("CINEMARK BRASIL"),
        nextUpdatedAt
      );

      expect(updated).not.toBe(merchant);
      expect(updated.aliases).toHaveLength(1);
      expect(updated.aliases[0]?.value).toBe("CINEMARK BRASIL");
      expect(updated.updatedAt.value).toBe("2025-01-03");

      // original unchanged
      expect(merchant.aliases).toEqual([]);
      expect(merchant.updatedAt.value).toBe("2025-01-01");
    });

    it("does not add duplicates (case-insensitive) and still returns a new instance", () => {
      const merchant = Merchant.create({
        id,
        name: MerchantName.of("Cinemark Brasil"),
        createdAt,
        updatedAt,
        aliases: [MerchantAlias.of("CINEMARK BRASIL")],
      });

      const nextUpdatedAt = IsoDate.of("2025-01-04");
      const updated = merchant.addAlias(
        MerchantAlias.of("cinemark brasil"), // duplicate
        nextUpdatedAt
      );

      expect(updated).not.toBe(merchant);
      expect(updated.aliases).toHaveLength(1);
      expect(updated.aliases[0]?.value).toBe("CINEMARK BRASIL");
      expect(updated.updatedAt.value).toBe("2025-01-04");
    });
  });

  describe("removeAlias()", () => {
    it("removes an alias case-insensitively and updates updatedAt", () => {
      const merchant = Merchant.create({
        id,
        name: MerchantName.of("Cinemark Brasil"),
        createdAt,
        updatedAt,
        aliases: [
          MerchantAlias.of("CINEMARK BRASIL"),
          MerchantAlias.of("Cinemark - Shopping Eldorado"),
        ],
      });

      const nextUpdatedAt = IsoDate.of("2025-01-05");
      const updated = merchant.removeAlias(
        MerchantAlias.of("cinemark brasil"),
        nextUpdatedAt
      );

      expect(updated).not.toBe(merchant);
      expect(updated.aliases).toHaveLength(1);
      expect(updated.aliases[0]?.value).toBe("Cinemark - Shopping Eldorado");
      expect(updated.updatedAt.value).toBe("2025-01-05");

      // original unchanged
      expect(merchant.aliases).toHaveLength(2);
    });

    it("is idempotent when alias does not exist (returns new instance, same aliases)", () => {
      const merchant = Merchant.create({
        id,
        name: MerchantName.of("Cinemark Brasil"),
        createdAt,
        updatedAt,
        aliases: [MerchantAlias.of("CINEMARK BRASIL")],
      });

      const nextUpdatedAt = IsoDate.of("2025-01-06");
      const updated = merchant.removeAlias(
        MerchantAlias.of("Non-existing alias"),
        nextUpdatedAt
      );

      expect(updated).not.toBe(merchant);
      expect(updated.aliases).toEqual(merchant.aliases);
      expect(updated.updatedAt.value).toBe("2025-01-06");
    });
  });
});
