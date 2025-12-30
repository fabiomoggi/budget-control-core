// src/domain/transaction/entities/Transaction.ts
import { EntityId } from "../../common/value-objects/EntityId.js";
import { IsoDate } from "../../common/value-objects/IsoDate.js";
import { Money } from "../../common/value-objects/Money.js";

export class Transaction {
  private constructor(
    public readonly id: EntityId,
    public readonly userId: EntityId,
    public readonly date: IsoDate,
    public readonly money: Money,
    public readonly categoryId?: EntityId
  ) {
    Object.freeze(this);
  }

  static create(params: {
    id: EntityId;
    userId: EntityId;
    date: IsoDate;
    money: Money;
    categoryId?: EntityId;
  }): Transaction {
    // No VO validation here — they are valid by construction
    return new Transaction(
      params.id,
      params.userId,
      params.date,
      params.money,
      params.categoryId
    );
  }
}
