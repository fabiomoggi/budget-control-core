import type { ImportTransactionsCommand } from "../commands/ImportTransactionsCommand.js"
import type { ImportTransactionsResult } from "../results/ImportTransactionsResult.js"

import type { TransactionFingerprintGeneratorPort } from "../ports/TransactionFingerprintGeneratorPort.js"
import type { ImportTransactionsRepositoryPort } from "../ports/ImportTransactionsRepositoryPort.js";

import {
  DefaultTransactionFingerprintCanonicalizer,
} from "../services/TransactionFingerprintCanonicalizer.js";

export class ImportTransactionsUseCase {
  private readonly canonicalizer = new DefaultTransactionFingerprintCanonicalizer();

  constructor(
    private readonly fingerprintGenerator: TransactionFingerprintGeneratorPort,
    private readonly repository: ImportTransactionsRepositoryPort) { }

  async execute(command: ImportTransactionsCommand): Promise<ImportTransactionsResult> {
    this.assertValidInput(command);

    const items = command.transactions.map((tx) => {
      const canonical = this.canonicalizer.canonicalize(tx);
      const fingerprint = this.fingerprintGenerator.generate(canonical);
      return { fingerprint, canonical, transaction: tx };
    });

    return this.repository.importMany({
      userId: command.userId,
      bank: command.bank,
      accountType: command.accountType,
      source: command.source,
      items
    });
  }

  private assertValidInput(command: ImportTransactionsCommand): void {
    if (!command?.userId) throw new Error("ImportTransactionsInputDTO.userId is required");
    if (!command?.bank) throw new Error("ImportTransactionsInputDTO.bank is required");
    if (!command?.accountType) throw new Error("ImportTransactionsInputDTO.accountType is required");
    if (!command?.source) throw new Error("ImportTransactionsInputDTO.source is required");

    if (!Array.isArray(command.transactions)) {
      throw new Error("ImportTransactionsInputDTO.transactions must be an array");
    }
  }
}
