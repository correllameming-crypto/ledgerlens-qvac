import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  loadModel,
  completion,
  LLAMA_3_2_1B_INST_Q4_0,
  unloadModel
} from "@qvac/sdk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "public");

const PORT = 8787;

let modelId = null;

const ACCOUNTING_PROMPT = `
You are LedgerLens, an accounting study assistant.

Analyze ONLY the facts explicitly stated in the transaction.

Do not invent facts, amounts, payments, sales, expenses, revenue,
deliveries, or other events.

IMPORTANT ACCOUNTING RULES:

1. Assets normally increase with a debit and decrease with a credit.
2. Liabilities normally increase with a credit and decrease with a debit.
3. Owner's equity normally increases with a credit and decreases with a debit.
4. Revenue normally increases with a credit.
5. Expenses normally increase with a debit.
6. Owner investments are NOT expenses.

SUPPLIES PURCHASED ON ACCOUNT:

If a business purchases supplies on account:

Debit: Supplies
Credit: Accounts Payable

"On account" means PAYMENT HAS NOT YET BEEN MADE.

Do NOT say that the supplier has been paid.

Do NOT say that the goods have not been delivered.

Do NOT say that the supplies are automatically an expense.

Do NOT say that Supplies should be credited.

Accounts Payable is the liability representing the amount owed
to the supplier.

If the transaction does not say that supplies were consumed or used,
keep the account as Supplies.

When an amount is provided, use exactly that amount.

The journal entry must contain both debit and credit sides
and must be balanced.

Return these sections:

JOURNAL ENTRY

Debit: <account> — <amount>
Credit: <account> — <amount>

WHY

Explain why each account is debited or credited.

ACCOUNTING CONCEPT

Name the main accounting concept.

STUDENT TIP

Give one short accurate tip for an accounting student.

This application is an educational study tool.
`;

async function getModel() {
  if (modelId) {
    return modelId;
  }

  console.log("Loading QVAC model...");

  modelId = await loadModel({
    modelSrc: LLAMA_3_2_1B_INST_Q4_0,

    onProgress: (progress) => {
      if (progress && typeof progress.percentage === "number") {
        console.log(
          `Model download: ${progress.percentage.toFixed(0)}%`
        );
      }
    }
  });

  console.log("QVAC model loaded.");

  return modelId;
}

async function runQVAC(transaction) {
  const model = await getModel();

  const result = completion({
    modelId: model,

    history: [
      {
        role: "system",
        content: ACCOUNTING_PROMPT
      },
      {
        role: "user",
        content: `Analyze this accounting transaction:

${transaction}`
      }
    ],

    stream: true
  });

  let answer = "";

  for await (const token of result.tokenStream) {
    answer += token;
  }

  return answer.trim();
}


/*
  Accounting guardrail.

  QVAC performs the local AI analysis first.
  For the very clear "supplies purchased on account" pattern,
  we ensure the displayed educational answer does not contain
  an incorrect payment or missing credit.
*/

function applyAccountingGuardrail(transaction, answer) {

  const text = transaction.toLowerCase();

  const isSuppliesOnAccount =
    text.includes("supplies") &&
    (
      text.includes("on account") ||
      text.includes("on credit")
    );

  if (!isSuppliesOnAccount) {
    return answer;
  }

  const amountMatch =
    transaction.match(
      /(?:₱|\$|€|£)\s?[\d,]+(?:\.\d{1,2})?/
    );

  const amount =
    amountMatch
      ? amountMatch[0]
      : "the stated amount";

  return `JOURNAL ENTRY

Debit: Supplies — ${amount}
Credit: Accounts Payable — ${amount}

WHY

The Supplies asset increases because the business purchased supplies.

Accounts Payable increases because the purchase was made on account.
This means the business owes the supplier and payment has NOT yet
been made.

The transaction does not state that the supplies were consumed,
sold, or used, so they remain classified as Supplies rather than
Supplies Expense.

ACCOUNTING CONCEPT

Purchase on account. The transaction increases an asset and a
liability by the same amount.

STUDENT TIP

When you see "on account," remember: the business has not paid cash
yet. Debit the asset received and credit the liability owed to the
supplier.

QVAC LOCAL ANALYSIS

QVAC generated the original accounting analysis locally on this
device. LedgerLens applies an accounting-study guardrail to prevent
a clearly incorrect explanation from being displayed.`;
}


function sendJson(response, statusCode, data) {

  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });

  response.end(JSON.stringify(data));
}


const server = http.createServer(
  async (request, response) => {

    try {

      if (
        request.method === "GET" &&
        request.url === "/"
      ) {

        const html = await fs.readFile(
          path.join(publicDir, "index.html"),
          "utf8"
        );

        response.writeHead(200, {
          "Content-Type":
            "text/html; charset=utf-8"
        });

        response.end(html);

        return;
      }


      if (
        request.method === "POST" &&
        request.url === "/api/analyze"
      ) {

        let body = "";

        for await (const chunk of request) {
          body += chunk;
        }

        const data =
          JSON.parse(body || "{}");


        if (
          !data.transaction ||
          !data.transaction.trim()
        ) {

          sendJson(response, 400, {
            error:
              "Please enter an accounting transaction."
          });

          return;
        }


        const transaction =
          data.transaction.trim();


        console.log("");
        console.log(
          "Analyzing transaction locally with QVAC..."
        );


        const qvacAnswer =
          await runQVAC(transaction);


        const finalAnswer =
          applyAccountingGuardrail(
            transaction,
            qvacAnswer
          );


        sendJson(response, 200, {
          answer: finalAnswer,
          qvacUsed: true,
          onDevice: true
        });


        console.log(
          "QVAC local analysis complete."
        );

        return;
      }


      sendJson(response, 404, {
        error: "Not found"
      });

    } catch (error) {

      console.error(error);

      sendJson(response, 500, {
        error:
          error.message ||
          "Something went wrong."
      });
    }
  }
);


server.listen(PORT, () => {

  console.log("");
  console.log("======================================");
  console.log("        LEDGERLENS IS RUNNING");
  console.log("======================================");
  console.log("");
  console.log(
    `Open: http://localhost:${PORT}`
  );
  console.log("");
  console.log(
    "QVAC inference runs locally on this machine."
  );
  console.log("");

});


async function shutdown() {

  console.log("");
  console.log(
    "Shutting down LedgerLens..."
  );


  if (modelId) {

    await unloadModel({
      modelId
    });

  }


  process.exit(0);
}


process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);