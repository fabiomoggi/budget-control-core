import { EntityId } from "../../common/value-objects/EntityId.js";
import { IsoDate } from "../../common/value-objects/IsoDate.js";
import { MerchantAlias } from "../value-objects/MerchantAlias.js";
import { MerchantName } from "../value-objects/MerchantName.js";

export class Merchant {
  private constructor(
    public readonly id: EntityId,
    public readonly name: MerchantName,
    public readonly aliases: ReadonlyArray<MerchantAlias>,
    public readonly createdAt: IsoDate,
    public readonly updatedAt: IsoDate
  ) {}

  static create(params: {
    id: EntityId;
    name: MerchantName;
    createdAt: IsoDate;
    updatedAt: IsoDate;
    aliases?: ReadonlyArray<MerchantAlias>;
  }): Merchant {
    const aliases = Merchant.dedupeAliases(params.aliases ?? []);
    return new Merchant(
      params.id,
      params.name,
      aliases,
      params.createdAt,
      params.updatedAt
    );
  }

  updateName(newName: MerchantName, updatedAt: IsoDate): Merchant {
    return new Merchant(
      this.id,
      newName,
      this.aliases,
      this.createdAt,
      updatedAt
    );
  }

  addAlias(alias: MerchantAlias, updatedAt: IsoDate): Merchant {
    const next = Merchant.dedupeAliases([...this.aliases, alias]);
    return new Merchant(this.id, this.name, next, this.createdAt, updatedAt);
  }

  removeAlias(alias: MerchantAlias, updatedAt: IsoDate): Merchant {
    const next = this.aliases.filter((a) => !a.equals(alias));
    return new Merchant(this.id, this.name, next, this.createdAt, updatedAt);
  }

  private static dedupeAliases(
    aliases: ReadonlyArray<MerchantAlias>
  ): ReadonlyArray<MerchantAlias> {
    const result: MerchantAlias[] = [];
    for (const alias of aliases) {
      if (!result.some((a) => a.equals(alias))) {
        result.push(alias);
      }
    }
    return result;
  }
}
