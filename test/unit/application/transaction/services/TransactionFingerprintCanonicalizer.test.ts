import { DefaultTransactionFingerprintCanonicalizer } from "../../../../../dist/application/transaction/services/TransactionFingerprintCanonicalizer.js"
import type { NormalizedTransactionDTO } from "../../../../../dist/application/transaction/dtos/NormalizedTransactionDTO.js"

describe("DefaultTransactionFingerprintCanonicalizer", () => {
  let canonicalizer: DefaultTransactionFingerprintCanonicalizer;

  beforeEach(() => {
    canonicalizer = new DefaultTransactionFingerprintCanonicalizer();
  });

  it("produces a stable canonical JSON string", () => {
    const tx: NormalizedTransactionDTO = {
      date: "2025-01-15",
      amount: "123.45",
      currency: "brl",
      merchantName: "Amazon",
    };

    const result = canonicalizer.canonicalize(tx);

    expect(result).toBe(
      JSON.stringify({
        date: "2025-01-15",
        amount: "123.45",
        currency: "BRL",
        merchantName: "amazon",
      })
    );
  });

  it("normalizes extra whitespace in all fields", () => {
    const tx: NormalizedTransactionDTO = {
      date: " 2025-01-15 ",
      amount: "  123.45  ",
      currency: "  brl ",
      merchantName: "  Amazon   Store  ",
    };

    const result = canonicalizer.canonicalize(tx);

    expect(JSON.parse(result)).toEqual({
      date: "2025-01-15",
      amount: "123.45",
      currency: "BRL",
      merchantName: "amazon store",
    });
  });

  it("uppercases currency and lowercases merchant name", () => {
    const tx: NormalizedTransactionDTO = {
      date: "2025-01-15",
      amount: "100",
      currency: "Usd",
      merchantName: "NeTFlIx",
    };

    const result = canonicalizer.canonicalize(tx);

    expect(JSON.parse(result)).toEqual({
      date: "2025-01-15",
      amount: "100",
      currency: "USD",
      merchantName: "netflix",
    });
  });

  it("omits merchantName when empty or whitespace-only", () => {
    const tx: NormalizedTransactionDTO = {
      date: "2025-01-15",
      amount: "100",
      currency: "BRL",
      merchantName: "   ",
    };

    const result = canonicalizer.canonicalize(tx);

    expect(JSON.parse(result)).toEqual({
      date: "2025-01-15",
      amount: "100",
      currency: "BRL",
      merchantName: undefined,
    });
  });

  it("treats missing merchantName as undefined", () => {
    const tx: NormalizedTransactionDTO = {
      date: "2025-01-15",
      amount: "100",
      currency: "BRL",
      merchantName: "",
    };

    const result = canonicalizer.canonicalize(tx);

    expect(JSON.parse(result)).toEqual({
      date: "2025-01-15",
      amount: "100",
      currency: "BRL",
      merchantName: undefined,
    });
  });

  it("returns identical output for semantically equal transactions", () => {
    const tx1: NormalizedTransactionDTO = {
      date: "2025-01-15",
      amount: "100",
      currency: "brl",
      merchantName: "Amazon Store",
    };

    const tx2: NormalizedTransactionDTO = {
      date: " 2025-01-15 ",
      amount: " 100 ",
      currency: "BRL",
      merchantName: "  amazon   store ",
    };

    const c1 = canonicalizer.canonicalize(tx1);
    const c2 = canonicalizer.canonicalize(tx2);

    expect(c1).toBe(c2);
  });
});
