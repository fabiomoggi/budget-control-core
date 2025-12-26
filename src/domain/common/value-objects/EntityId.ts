const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class EntityId {
  private constructor(public readonly value: string) {}

  static of(value: string): EntityId {
    const normalized = value.trim();

    if (!UUID_V4_REGEX.test(normalized)) {
      throw new Error("EntityId must be a valid UUIDv4");
    }

    return new EntityId(normalized);
  }

  equals(other: EntityId): boolean {
    return this.value === other.value;
  }
}
