export class UserEmail {
  private constructor(public readonly value: string) {}

  static of(value: string): UserEmail {
    const normalized = value.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalized)) {
      throw new Error("Invalid email address");
    }

    return new UserEmail(normalized);
  }
}
