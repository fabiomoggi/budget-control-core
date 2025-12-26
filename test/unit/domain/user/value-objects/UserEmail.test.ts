import { UserEmail } from "../../../../../dist/domain/user/value-objects/UserEmail.js";

describe("UserEmail", () => {
  describe("of()", () => {
    it("creates a UserEmail for a valid email", () => {
      const email = UserEmail.of("fabio.moggi@email.com");
      expect(email.value).toBe("fabio.moggi@email.com");
    });

    it("normalizes email to lowercase", () => {
      const email = UserEmail.of("Fabio.Moggi@Email.COM");
      expect(email.value).toBe("fabio.moggi@email.com");
    });

    it("trims leading and trailing whitespace", () => {
      const email = UserEmail.of("  fabio@email.com  ");
      expect(email.value).toBe("fabio@email.com");
    });

    it("throws for missing @ symbol", () => {
      expect(() => UserEmail.of("fabio.email.com")).toThrow(
        "Invalid email address"
      );
    });

    it("throws for missing domain", () => {
      expect(() => UserEmail.of("fabio@")).toThrow(
        "Invalid email address"
      );
    });

    it("throws for missing local part", () => {
      expect(() => UserEmail.of("@email.com")).toThrow(
        "Invalid email address"
      );
    });

    it("throws for whitespace-only input", () => {
      expect(() => UserEmail.of("   ")).toThrow(
        "Invalid email address"
      );
    });
  });
});
