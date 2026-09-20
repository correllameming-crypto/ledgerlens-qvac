import readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("");
console.log("======================================");
console.log("       LEDGERLENS CMD MODE");
console.log("======================================");
console.log("");
console.log("Enter an accounting transaction.");
console.log("Type 'exit' to quit.");
console.log("");

function analyzeTransaction(transaction) {
  const text = transaction.toLowerCase();

  if (
    text.includes("supplies") &&
    text.includes("on account")
  ) {
    return `
JOURNAL ENTRY

Debit: Supplies — ₱10,000
Credit: Accounts Payable — ₱10,000

WHY

The Supplies asset increases because the business purchased supplies.

Accounts Payable increases because the purchase was made on account.
This means the business owes the supplier and payment has not yet been made.

ACCOUNTING CONCEPT

Purchase on account.

The transaction increases an asset and a liability by the same amount.

STUDENT TIP

When you see "on account," remember that the business has not paid cash yet.
Debit the asset received and credit the liability owed to the supplier.
`;
  }

  if (
    text.includes("cash") &&
    text.includes("owner") &&
    (text.includes("invested") || text.includes("investment"))
  ) {
    return `
JOURNAL ENTRY

Debit: Cash
Credit: Owner's Capital

WHY

Cash increases because the owner invested money into the business.

Owner's Capital increases because the owner contributed resources to the business.

ACCOUNTING CONCEPT

Owner investment.

The transaction increases both an asset and owner's equity.
`;
  }

  return `
ACCOUNTING ANALYSIS

LedgerLens received:

"${transaction}"

This CMD version currently has built-in accounting study guidance
for common beginner transactions.

Try:

"The business purchased ₱10,000 of supplies on account."

or:

"The owner invested ₱50,000 cash into the business."
`;
}

function ask() {
  rl.question("Transaction: ", (transaction) => {
    if (transaction.trim().toLowerCase() === "exit") {
      console.log("\nLedgerLens closed.");
      rl.close();
      return;
    }

    console.log(analyzeTransaction(transaction));
    ask();
  });
}

ask();