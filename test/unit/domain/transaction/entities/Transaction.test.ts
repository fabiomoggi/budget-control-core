import { Transaction } from "../../../../../dist/domain/transaction/entities/Transaction.js";
import { EntityId } from "../../../../../dist/domain/common/value-objects/EntityId.js";
import { IsoDate } from "../../../../../dist/domain/common/value-objects/IsoDate.js";
import { Money } from "../../../../../dist/domain/common/value-objects/Money.js";

describe("Transaction entity", () => {
  const id = EntityId.of("3fa85f64-5717-4562-b3fc-2c963f66afa6");
  const userId = EntityId.of("a8098c1a-f86e-4f7c-8f7f-8f6d9f2a3c11");
  const date = IsoDate.of("2025-12-30");
  const money = Money.of(123.45, "BRL");

  it("creates a transaction with required fields", () => {
    const tx = Transaction.create({
      id,
      userId,
      date,
      money,
    });

    expect(tx.id.equals(id)).toBe(true);
    expect(tx.userId.equals(userId)).toBe(true);
    expect(tx.date.equals(date)).toBe(true);
    expect(tx.money).toBe(money);
    expect(tx.categoryId).toBeUndefined();
  });

  it("creates a transaction with optional categoryId", () => {
    const categoryId = EntityId.of("c56a4180-65aa-42ec-a945-5fd21dec0538");

    const tx = Transaction.create({
      id,
      userId,
      date,
      money,
      categoryId,
    });

    expect(tx.categoryId?.equals(categoryId)).toBe(true);
  });

  it("is immutable after creation", () => {
    const tx = Transaction.create({
      id,
      userId,
      date,
      money,
    });

    expect(Object.isFrozen(tx)).toBe(true);

    expect(() => {
      (tx as unknown as Record<string, unknown>).money = Money.of(1, "BRL");
    }).toThrow();
  });
});
