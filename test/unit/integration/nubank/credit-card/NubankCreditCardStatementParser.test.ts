import { NubankCreditCardStatementParser } from
  "../../../../../dist/integration/nubank/credit-card/NubankCreditCardStatementParser.js";

describe("NubankCreditCardStatementParser (real Nubank CC OFX sample)", () => {
  it("parses Nubank credit-card OFX and returns normalized transactions", () => {
    const ofx = `
OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:USASCII
CHARSET:1252
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE
<OFX>
<SIGNONMSGSRSV1>
<SONRS>
<STATUS>
<CODE>0</CODE>
<SEVERITY>INFO</SEVERITY>
</STATUS>
<DTSERVER>20251126165607[0:GMT]</DTSERVER>
<LANGUAGE>POR</LANGUAGE>
<FI>
<ORG>NU PAGAMENTOS S.A.</ORG>
<FID>260</FID>
</FI>
</SONRS>
</SIGNONMSGSRSV1>
<CREDITCARDMSGSRSV1>
<CCSTMTTRNRS>
<TRNUID>1001</TRNUID>
<STATUS>
<CODE>0</CODE>
<SEVERITY>INFO</SEVERITY>
</STATUS>
<CCSTMTRS>
<CURDEF>BRL</CURDEF>
<CCACCTFROM>
<ACCTID>56d4b5c9-c448-4270-ba9b-a7956eea8308</ACCTID>
</CCACCTFROM>
<BANKTRANLIST>
<DTSTART>20251124000000[-3:BRT]</DTSTART>
<DTEND>20251225000000[-3:BRT]</DTEND>
<STMTTRN>
<TRNTYPE>DEBIT</TRNTYPE>
<DTPOSTED>20251126000000[-3:BRT]</DTPOSTED>
<TRNAMT>-160.00</TRNAMT>
<FITID>69268d50-5bbb-4d75-9310-92bcb54b3d2c</FITID>
<MEMO>Conta Vivo</MEMO>
</STMTTRN>
<STMTTRN>
<TRNTYPE>DEBIT</TRNTYPE>
<DTPOSTED>20251126000000[-3:BRT]</DTPOSTED>
<TRNAMT>-317.40</TRNAMT>
<FITID>69268d4c-43a7-4dff-a245-f53a3a729144</FITID>
<MEMO>Conta Vivo</MEMO>
</STMTTRN>
<STMTTRN>
<TRNTYPE>DEBIT</TRNTYPE>
<DTPOSTED>20251126000000[-3:BRT]</DTPOSTED>
<TRNAMT>-270.49</TRNAMT>
<FITID>6926242d-4581-4deb-9301-8eede08c395a</FITID>
<MEMO>Supermercado Superbom</MEMO>
</STMTTRN>
<STMTTRN>
<TRNTYPE>DEBIT</TRNTYPE>
<DTPOSTED>20251126000000[-3:BRT]</DTPOSTED>
<TRNAMT>-301.03</TRNAMT>
<FITID>69262788-f3ea-4c38-9128-d7d4a4bcc90b</FITID>
<MEMO>Postobelassis</MEMO>
</STMTTRN>
<STMTTRN>
<TRNTYPE>DEBIT</TRNTYPE>
<DTPOSTED>20251124000000[-3:BRT]</DTPOSTED>
<TRNAMT>-78.00</TRNAMT>
<FITID>69238d2e-4cf9-4f80-bc0b-869a38d81b42</FITID>
<MEMO>Heisenburger</MEMO>
</STMTTRN>
<STMTTRN>
<TRNTYPE>DEBIT</TRNTYPE>
<DTPOSTED>20251124000000[-3:BRT]</DTPOSTED>
<TRNAMT>-60.76</TRNAMT>
<FITID>69230d9a-7504-4f73-b6df-5079b37e2c97</FITID>
<MEMO>Casa Avenida</MEMO>
</STMTTRN>
<STMTTRN>
<TRNTYPE>DEBIT</TRNTYPE>
<DTPOSTED>20251124000000[-3:BRT]</DTPOSTED>
<TRNAMT>-725.00</TRNAMT>
<FITID>691dca8e-4dff-4038-b792-d6585992290a</FITID>
<MEMO>K2arcondicionado - Parcela 2/4</MEMO>
</STMTTRN>
<STMTTRN>
<TRNTYPE>DEBIT</TRNTYPE>
<DTPOSTED>20251124000000[-3:BRT]</DTPOSTED>
<TRNAMT>-134.90</TRNAMT>
<FITID>683b7d50-d6c8-4c06-890d-9f8dc0ca8493</FITID>
<MEMO>Sm Patio Higienopolis - Parcela 7/10</MEMO>
</STMTTRN>
</BANKTRANLIST>
<LEDGERBAL>
<BALAMT>-2047.58</BALAMT>
<DTASOF>20251225000000[-3:BRT]</DTASOF>
</LEDGERBAL>
</CCSTMTRS>
</CCSTMTTRNRS>
</CREDITCARDMSGSRSV1>
</OFX>
    `.trim();

    const parser = new NubankCreditCardStatementParser();
    const result = parser.parseOfx({ file: Buffer.from(ofx, "utf-8") });

    console.log("Parsed transactions:", result);

    // Count: 8 STMTTRN blocks
    expect(result).toHaveLength(8);

    // Currency from CURDEF
    for (const tx of result) {
      expect(tx.currency).toBe("BRL");
    }

    // Spot-check first tx
    expect(result[0]).toEqual({
      date: "2025-11-26",
      amount: "-160.00",
      currency: "BRL",
      merchantName: "Conta Vivo",
      sourceRef: "69268d50-5bbb-4d75-9310-92bcb54b3d2c",
    });

    // Spot-check 3rd tx
    expect(result[2]).toEqual({
      date: "2025-11-26",
      amount: "-270.49",
      currency: "BRL",
      merchantName: "Supermercado Superbom",
      sourceRef: "6926242d-4581-4deb-9301-8eede08c395a",
    });

    // Spot-check last tx
    expect(result[7]).toEqual({
      date: "2025-11-24",
      amount: "-134.90",
      currency: "BRL",
      merchantName: "Sm Patio Higienopolis - Parcela 7/10",
      sourceRef: "683b7d50-d6c8-4c06-890d-9f8dc0ca8493",
    });
  });
});
