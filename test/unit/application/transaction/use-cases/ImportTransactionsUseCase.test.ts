import { jest } from "@jest/globals";
import { ImportTransactionsUseCase } from "../../../../../dist/application/transaction/use-cases/ImportTransactionsUseCase.js";

import type {
    ImportTransactionsInputDTO,
    ImportTransactionsOutputDTO,
} from "../../../../../dist/application/transaction/dtos/ImportTransactionsDTO.js";

import type { TransactionFingerprintGeneratorPort } from "../../../../../dist/application/transaction/ports/TransactionFingerprintGeneratorPort.js";
import type { TransactionImportRepositoryPort } from "../../../../../dist/application/transaction/ports/TransactionImportRepositoryPort.js";

import type { TransactionFingerprintCanonicalizer } from "../../../../../dist/application/transaction/services/TransactionFingerprintCanonicalizer.js";
import type { NormalizedTransactionDTO } from "../../../../../dist/application/transaction/dtos/NormalizedTransactionDTO.js";

describe("ImportTransactionsUseCase", () => {
    const makeTx = (overrides: Partial<NormalizedTransactionDTO> = {}): NormalizedTransactionDTO =>
    ({
        date: "2025-01-15",
        amount: "100.00",
        currency: "brl",
        merchantName: "Amazon",
        ...overrides,
    } as NormalizedTransactionDTO);

    const makeInput = (
        overrides: Partial<ImportTransactionsInputDTO> = {}
    ): ImportTransactionsInputDTO =>
    ({
        userId: { value: "550e8400-e29b-41d4-a716-446655440000" },
        bank: "Nubank",
        accountType: "CREDIT_CARD",
        source: "OFX",
        format: "OFX",
        transactions: [makeTx()],
        ...overrides,
    } as ImportTransactionsInputDTO);

    const makeSut = (opts?: {
        canonicalizer?: TransactionFingerprintCanonicalizer;
        fingerprintGenerator?: TransactionFingerprintGeneratorPort;
        repository?: TransactionImportRepositoryPort;
    }) => {
        const fingerprintGenerator: TransactionFingerprintGeneratorPort =
            opts?.fingerprintGenerator ??
            ({
                generate: jest.fn((canonical: string) => `fp(${canonical})`),
            } as unknown as TransactionFingerprintGeneratorPort);

        const repository: TransactionImportRepositoryPort =
            opts?.repository ??
            ({
                importMany: jest.fn(async () => ({
                    inserted: 1,
                    merged: 0,
                    skipped: 0,
                    collisions: 0,
                })),
            } as unknown as TransactionImportRepositoryPort);

        const canonicalizer =
            opts?.canonicalizer ??
            ({
                canonicalize: jest.fn((tx: NormalizedTransactionDTO) =>
                    JSON.stringify({
                        date: tx.date,
                        amount: tx.amount,
                        currency: tx.currency,
                        merchantName: tx.merchantName,
                    })
                ),
            } as unknown as TransactionFingerprintCanonicalizer);

        const sut = new ImportTransactionsUseCase(
            fingerprintGenerator,
            repository,
            canonicalizer
        );

        return { sut, fingerprintGenerator, repository, canonicalizer };
    };

    it("throws when userId is missing", async () => {
        const { sut } = makeSut();
        const input = makeInput({ userId: undefined as any });

        await expect(sut.execute(input)).rejects.toThrow(
            "ImportTransactionsInputDTO.userId is required"
        );
    });

    it("throws when bank is missing", async () => {
        const { sut } = makeSut();
        const input = makeInput({ bank: "" as any });

        await expect(sut.execute(input)).rejects.toThrow(
            "ImportTransactionsInputDTO.bank is required"
        );
    });

    it("throws when accountType is missing", async () => {
        const { sut } = makeSut();
        const input = makeInput({ accountType: "" as any });

        await expect(sut.execute(input)).rejects.toThrow(
            "ImportTransactionsInputDTO.accountType is required"
        );
    });

    it("throws when source is missing", async () => {
        const { sut } = makeSut();
        const input = makeInput({ source: undefined as any });

        await expect(sut.execute(input)).rejects.toThrow(
            "ImportTransactionsInputDTO.source is required"
        );
    });

    it("throws when format is missing", async () => {
        const { sut } = makeSut();
        const input = makeInput({ format: undefined as any });

        await expect(sut.execute(input)).rejects.toThrow(
            "ImportTransactionsInputDTO.format is required"
        );
    });

    it("throws when transactions is not an array", async () => {
        const { sut } = makeSut();
        const input = makeInput({ transactions: "nope" as any });

        await expect(sut.execute(input)).rejects.toThrow(
            "ImportTransactionsInputDTO.transactions must be an array"
        );
    });

    it("canonicalizes each transaction, generates fingerprints, and calls repository.importMany with mapped items", async () => {
        const tx1 = makeTx({ merchantName: "Amazon" });
        const tx2 = makeTx({ merchantName: "Netflix", amount: "59.90" });

        const canonicalizeMock = jest
            .fn<(tx: NormalizedTransactionDTO) => string>()
            .mockReturnValueOnce("CANON_1")
            .mockReturnValueOnce("CANON_2");

        const canonicalizer: TransactionFingerprintCanonicalizer = {
            canonicalize: canonicalizeMock,
        };

        const generateMock = jest
            .fn<(canonical: string) => string>()
            .mockReturnValueOnce("FP_1")
            .mockReturnValueOnce("FP_2");

        const fingerprintGenerator: TransactionFingerprintGeneratorPort = {
            generate: generateMock,
        };

        const importManyMock = jest.fn<
            (args: any) => Promise<ImportTransactionsOutputDTO>
        >(async () => ({
            inserted: 2,
            merged: 0,
            skipped: 0,
            collisions: 0,
        }));

        const repository: TransactionImportRepositoryPort = {
            importMany: importManyMock,
        };

        const sut = new ImportTransactionsUseCase(
            fingerprintGenerator,
            repository,
            canonicalizer
        );

        const input = makeInput({ transactions: [tx1, tx2] });

        const output = await sut.execute(input);

        expect(canonicalizer.canonicalize).toHaveBeenCalledTimes(2);
        expect(canonicalizer.canonicalize).toHaveBeenNthCalledWith(1, tx1);
        expect(canonicalizer.canonicalize).toHaveBeenNthCalledWith(2, tx2);

        expect(fingerprintGenerator.generate).toHaveBeenCalledTimes(2);
        expect(fingerprintGenerator.generate).toHaveBeenNthCalledWith(1, "CANON_1");
        expect(fingerprintGenerator.generate).toHaveBeenNthCalledWith(2, "CANON_2");

        expect(repository.importMany).toHaveBeenCalledTimes(1);
        expect(repository.importMany).toHaveBeenCalledWith({
            userId: input.userId,
            bank: input.bank,
            accountType: input.accountType,
            source: input.source,
            format: input.format,
            items: [
                { fingerprint: "FP_1", canonical: "CANON_1", transaction: tx1 },
                { fingerprint: "FP_2", canonical: "CANON_2", transaction: tx2 },
            ],
        });

        expect(output).toEqual<ImportTransactionsOutputDTO>({
            inserted: 2,
            merged: 0,
            skipped: 0,
            collisions: 0,
        });
    });


    it("uses DefaultTransactionFingerprintCanonicalizer when no canonicalizer is provided (behavioral smoke test)", async () => {
        const fingerprintGenerator: TransactionFingerprintGeneratorPort = {
            generate: jest.fn(() => "FP"),
        } as any;

        const repository: TransactionImportRepositoryPort = {
            importMany: jest.fn(async () => ({
                inserted: 1,
                merged: 0,
                skipped: 0,
                collisions: 0,
            })),
        } as any;

        // NOTE: no canonicalizer passed -> default should be used internally
        const sut = new ImportTransactionsUseCase(fingerprintGenerator, repository);

        const input = makeInput({
            transactions: [
                makeTx({
                    currency: " brl ",
                    merchantName: "  Amazon   Store ",
                }),
            ],
        });

        await sut.execute(input);

        // We can't access the private canonicalizer directly, but we CAN assert the
        // generator was called with a canonical string that reflects the default normalization.
        expect(fingerprintGenerator.generate).toHaveBeenCalledTimes(1);

        const canonicalArg = (fingerprintGenerator.generate as jest.Mock).mock
            .calls[0][0] as string;

        // Default canonicalizer uppercases currency, lowercases merchant, collapses whitespace.
        expect(canonicalArg).toContain('"currency":"BRL"');
        expect(canonicalArg).toContain('"merchantName":"amazon store"');
    });
});
