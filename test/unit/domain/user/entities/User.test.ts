// test/unit/domain/user/User.test.ts
import { User } from "../../../../../dist/domain/user/entities/User.js";
import { EntityId } from "../../../../../dist/domain/common/value-objects/EntityId.js";
import { IsoDate } from "../../../../../dist/domain/common/value-objects/IsoDate.js";
import { UserFullName } from "../../../../../dist/domain/user/value-objects/UserFullName.js";
import { UserEmail } from "../../../../../dist/domain/user/value-objects/UserEmail.js";

describe("User", () => {
  const id = EntityId.of("550e8400-e29b-41d4-a716-446655440000");
  const createdAt = IsoDate.of("2025-01-15");

  const fullName = UserFullName.of("Fabio Moggi");
  const email = UserEmail.of("fabio.moggi@email.com");

  describe("create()", () => {
    it("creates a user with id, fullName, email, and createdAt", () => {
      const user = User.create({ id, fullName, email, createdAt });

      expect(user.id.equals(id)).toBe(true);
      expect(user.fullName.value).toBe("Fabio Moggi");
      expect(user.email.value).toBe("fabio.moggi@email.com");
      expect(user.createdAt.value).toBe("2025-01-15");
    });
  });

  describe("updateName()", () => {
    it("returns a new User instance with updated name (immutable)", () => {
      const user = User.create({ id, fullName, email, createdAt });
      const newName = UserFullName.of("Fabio R. Moggi");

      const updated = user.updateName(newName);

      // new instance
      expect(updated).not.toBe(user);

      // updated field
      expect(updated.fullName.value).toBe("Fabio R. Moggi");

      // unchanged fields
      expect(updated.id.equals(user.id)).toBe(true);
      expect(updated.email.value).toBe(user.email.value);
      expect(updated.createdAt.value).toBe(user.createdAt.value);

      // original unchanged
      expect(user.fullName.value).toBe("Fabio Moggi");
    });
  });

  describe("updateEmail()", () => {
    it("returns a new User instance with updated email (immutable)", () => {
      const user = User.create({ id, fullName, email, createdAt });
      const newEmail = UserEmail.of("fabio.moggi+new@email.com");

      const updated = user.updateEmail(newEmail);

      // new instance
      expect(updated).not.toBe(user);

      // updated field
      expect(updated.email.value).toBe("fabio.moggi+new@email.com");

      // unchanged fields
      expect(updated.id.equals(user.id)).toBe(true);
      expect(updated.fullName.value).toBe(user.fullName.value);
      expect(updated.createdAt.value).toBe(user.createdAt.value);

      // original unchanged
      expect(user.email.value).toBe("fabio.moggi@email.com");
    });
  });
});
