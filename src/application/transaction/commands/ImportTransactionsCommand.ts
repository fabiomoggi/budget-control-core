import type { EntityIdDTO } from "../../common/dtos/EntityIdDTO.js";
import type { NormalizedTransaction } from "../contracts/NormalizedTransaction.js";

export type TransactionSource = "OFX" | "CSV" | "API" | "UNKNOWN";

export interface ImportTransactionsCommand {
    userId: EntityIdDTO;
    source: TransactionSource;     // "OFX" | "CSV" | "API"
    bank: string;                     // provenance (not domain)
    accountType: string;              // provenance (not domain)
    fileName?: string;
    transactions: NormalizedTransaction[];
}