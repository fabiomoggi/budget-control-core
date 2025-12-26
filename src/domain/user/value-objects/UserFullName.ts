export class UserFullName {
  private constructor(public readonly value: string) {}

  static of(value: string): UserFullName {
    const normalized = value.trim();

    if (normalized.length < 3) {
      throw new Error("User full name must have at least 3 characters");
    }

    if (!normalized.includes(" ")) {
      throw new Error(
        "User full name must include at least first and last name"
      );
    }

    return new UserFullName(normalized);
  }
}
