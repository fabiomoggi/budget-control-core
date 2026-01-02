import type { ImportTransactionsInputDTO, ImportTransactionsOutputDTO } from "../dtos/ImportTransactionsDTO.js";
import type { NormalizedTransactionDTO } from "../dtos/NormalizedTransactionDTO.js";

export interface TransactionImportRepositoryPort {
  importMany(params: {
    userId: ImportTransactionsInputDTO["userId"];
    bank: ImportTransactionsInputDTO["bank"];
    accountType: ImportTransactionsInputDTO["accountType"];
    source: ImportTransactionsInputDTO["source"];
    format: ImportTransactionsInputDTO["format"];

    items: Array<{
      fingerprint: string;
      canonical: string;
      transaction: NormalizedTransactionDTO;
    }>;
  }): Promise<ImportTransactionsOutputDTO>;
}
