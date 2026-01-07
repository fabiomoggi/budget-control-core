import type { EntityIdDTO } from "../../common/dtos/EntityIdDTO.js";
import type { TransactionSource } from "../commands/ImportTransactionsCommand.js";
import type { ImportTransactionItem } from "../contracts/ImportTransactionItem.js";
import type { ImportTransactionsResult } from "../results/ImportTransactionsResult.js";

export interface ImportTransactionsRepositoryPort {
  importMany(params: {
    userId: EntityIdDTO;
    bank: string;
    accountType: string;
    source: TransactionSource;
    fileName?: string;
    items: ImportTransactionItem[];
  }): Promise<ImportTransactionsResult>;
}



  // importMany(params: {
  //   userId: ImportTransactionsInputDTO["userId"];
  //   bank: ImportTransactionsInputDTO["bank"];
  //   accountType: ImportTransactionsInputDTO["accountType"];
  //   source: ImportTransactionsInputDTO["source"];
  //   format: ImportTransactionsInputDTO["format"];

  //   items: Array<{
  //     fingerprint: string;
  //     canonical: string;
  //     transaction: NormalizedTransactionDTO;
  //   }>;
  // }): Promise<ImportTransactionsOutputDTO>;
