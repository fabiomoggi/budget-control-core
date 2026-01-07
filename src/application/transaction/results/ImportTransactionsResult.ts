export interface ImportTransactionsResult {
  inserted: number;
  merged: number;
  skipped: number;
  collisions: number;
}