import { EntityId } from "../../../../../dist/domain/common/value-objects/EntityId.js";

describe("EntityId", () => {
  const validV4 = "550e8400-e29b-41d4-a716-446655440000"; // UUIDv4 (version=4, variant=a)

  describe("of()", () => {
    it("creates an EntityId for a valid UUIDv4", () => {
      const id = EntityId.of(validV4);
      expect(id.value).toBe(validV4);
    });

    it("trims whitespace before validation", () => {
      const id = EntityId.of(`  ${validV4}  `);
      expect(id.value).toBe(validV4);
    });

    it("throws for empty string", () => {
      expect(() => EntityId.of("")).toThrow();
      expect(() => EntityId.of("   ")).toThrow();
    });

    it("throws for invalid UUID format", () => {
      expect(() => EntityId.of("not-a-uuid")).toThrow();
      expect(() => EntityId.of("550e8400e29b41d4a716446655440000")).toThrow(); // missing hyphens
      expect(() => EntityId.of("550e8400-e29b-41d4-a716-44665544000")).toThrow(); // too short
    });

    it("throws for non-v4 UUID (wrong version)", () => {
      const v1Like = "550e8400-e29b-11d4-a716-446655440000"; // version=1 (third group starts with 1)
      expect(() => EntityId.of(v1Like)).toThrow();
    });

    it("throws for invalid UUID variant", () => {
      const invalidVariant = "550e8400-e29b-41d4-7716-446655440000"; // variant must start with 8/9/a/b
      expect(() => EntityId.of(invalidVariant)).toThrow();
    });
  });

  describe("equals()", () => {
    it("returns true for same underlying value", () => {
      const a = EntityId.of(validV4);
      const b = EntityId.of(validV4);
      expect(a.equals(b)).toBe(true);
      expect(b.equals(a)).toBe(true);
    });

    it("returns false for different values", () => {
      const a = EntityId.of(validV4);
      const b = EntityId.of("550e8400-e29b-41d4-b716-446655440000"); // also v4
      expect(a.equals(b)).toBe(false);
    });
  });
});
