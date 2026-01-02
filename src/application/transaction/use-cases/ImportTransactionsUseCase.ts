import type { ImportTransactionsInputDTO, ImportTransactionsOutputDTO } from "../dtos/ImportTransactionsDTO.js";
import type { TransactionFingerprintGeneratorPort } from "../ports/TransactionFingerprintGeneratorPort.js" 
import type { TransactionImportRepositoryPort } from "../ports/TransactionImportRepositoryPort.js";

import {
  DefaultTransactionFingerprintCanonicalizer,
  type TransactionFingerprintCanonicalizer,
} from "../services/TransactionFingerprintCanonicalizer.js";

export class ImportTransactionsUseCase {
  private readonly canonicalizer: TransactionFingerprintCanonicalizer;

  constructor(
    private readonly fingerprintGenerator: TransactionFingerprintGeneratorPort,
    private readonly repository: TransactionImportRepositoryPort,
    canonicalizer?: TransactionFingerprintCanonicalizer
  ) {
    this.canonicalizer =
      canonicalizer ?? new DefaultTransactionFingerprintCanonicalizer();
  }

  async execute(input: ImportTransactionsInputDTO): Promise<ImportTransactionsOutputDTO> {
    this.assertValidInput(input);

    const items = input.transactions.map((tx) => {
      const canonical = this.canonicalizer.canonicalize(tx);
      const fingerprint = this.fingerprintGenerator.generate(canonical);
      return { fingerprint, canonical, transaction: tx };
    });

    return this.repository.importMany({
      userId: input.userId,
      bank: input.bank,
      accountType: input.accountType,
      source: input.source,
      format: input.format,
      items,
    });
  }

  private assertValidInput(input: ImportTransactionsInputDTO): void {
    if (!input?.userId) throw new Error("ImportTransactionsInputDTO.userId is required");
    if (!input?.bank) throw new Error("ImportTransactionsInputDTO.bank is required");
    if (!input?.accountType) throw new Error("ImportTransactionsInputDTO.accountType is required");
    if (!input?.source) throw new Error("ImportTransactionsInputDTO.source is required");
    if (!input?.format) throw new Error("ImportTransactionsInputDTO.format is required");

    if (!Array.isArray(input.transactions)) {
      throw new Error("ImportTransactionsInputDTO.transactions must be an array");
    }
  }
}
