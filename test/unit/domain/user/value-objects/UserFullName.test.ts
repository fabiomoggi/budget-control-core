import { UserFullName } from "../../../../../dist/domain/user/value-objects/UserFullName.js";

describe("UserFullName", () => {
  describe("of()", () => {
    it("creates a UserFullName for a valid full name", () => {
      const name = UserFullName.of("Fabio Moggi");
      expect(name.value).toBe("Fabio Moggi");
    });

    it("trims leading and trailing whitespace", () => {
      const name = UserFullName.of("  Fabio Moggi  ");
      expect(name.value).toBe("Fabio Moggi");
    });

    it("throws if name is shorter than 3 characters", () => {
      expect(() => UserFullName.of("Al")).toThrow(
        "User full name must have at least 3 characters"
      );
    });

    it("throws if name does not contain a space (single word)", () => {
      expect(() => UserFullName.of("Fabio")).toThrow(
        "User full name must include at least first and last name"
      );
    });

    it("throws if name is only whitespace", () => {
      expect(() => UserFullName.of("   ")).toThrow();
    });
  });
});
