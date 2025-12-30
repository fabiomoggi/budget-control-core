import type { EntityIdDTO } from "../../common/dtos/EntityIdDTO.js";

export type StatementFormatDTO = "OFX" | "CSV" | "API" | "UNKNOWN";
export type TransactionSourceDTO = "OFX" | "CSV" | "API";

export interface ImportStatementInputDTO {
  userId: EntityIdDTO;

  source: TransactionSourceDTO;
  format: StatementFormatDTO;

  fileName?: string;
  file?: Buffer; // optional because API source might not be a file
}

export interface ImportStatementOutputDTO {
  inserted: number;
  merged: number; // attached new source ref to an existing tx
  skipped: number; // exact duplicates (same source ref already existed)
  collisions: number; // potential same fingerprint but mismatching core fields
}