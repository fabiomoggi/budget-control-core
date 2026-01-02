import type { EntityIdDTO } from "../../common/dtos/EntityIdDTO.js";
import type { NormalizedTransactionDTO } from "./NormalizedTransactionDTO.js";


export type TransactionsFormat = "OFX" | "CSV" | "API" | "UNKNOWN";
export type TransactionsSource = "OFX" | "CSV" | "API";

export interface ImportTransactionsInputDTO {
  userId: EntityIdDTO;

  source: TransactionsSource;     // "OFX" | "CSV" | "API"
  format: TransactionsFormat;       // "OFX" | "CSV" | "API" | "UNKNOWN"

  bank: string;                     // provenance (not domain)
  accountType: string;              // provenance (not domain)

  fileName?: string;

  transactions: NormalizedTransactionDTO[];
}

export interface ImportTransactionsOutputDTO {
  inserted: number;
  merged: number; // attached new source ref to an existing tx
  skipped: number; // exact duplicates (same source ref already existed)
  collisions: number; // potential same fingerprint but mismatching core fields
}
