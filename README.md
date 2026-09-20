cd C:\Users\ADMIN\Desktop\ledgerlens-qvac

(
echo # LedgerLens
echo.
echo LedgerLens is a local-first accounting study companion powered by Tether's QVAC SDK.
echo.
echo It helps accounting students analyze business transactions, understand journal entries, and learn the accounting equation.
echo.
echo ## Features
echo.
echo - AI-powered accounting transaction analysis
echo - Journal entry explanations
echo - Debit and credit reasoning
echo - Accounting concept explanations
echo - Student study tips
echo - Accounting equation guidance
echo - Local-first AI inference with QVAC
echo - Accounting guardrails for common beginner mistakes
echo.
echo ## QVAC SDK
echo.
echo LedgerLens uses **Tether's QVAC SDK version 0.19.1**.
echo.
echo The application uses:
echo.
echo - `loadModel`
echo - `completion`
echo.
echo The QVAC model is loaded and used locally on the user's device.
echo.
echo No external AI API key is required for the inference workflow.
echo.
echo ## Requirements
echo.
echo - Node.js
echo - npm
echo - A computer capable of running the QVAC model
echo.
echo ## Installation
echo.
echo Clone the repository:
echo.
echo ```bash
echo git clone https://github.com/correllameming-crypto/ledgerlens-qvac.git
echo cd ledgerlens-qvac
echo ```
echo.
echo Install the project dependencies:
echo.
echo ```bash
echo npm install
echo ```
echo.
echo ## Run
echo.
echo Start the LedgerLens application:
echo.
echo ```bash
echo npm start
echo ```
echo.
echo The `npm start` command runs:
echo.
echo ```bash
echo node server.mjs
echo ```
echo.
echo Keep the terminal open while the application is running.
echo.
echo If the application provides a local URL in the terminal, open that URL in your web browser.
echo.
echo ## CLI
echo.
echo LedgerLens also provides a CLI command:
echo.
echo ```bash
echo npm run cli
echo ```
echo.
echo The CLI command runs:
echo.
echo ```bash
echo node cli.mjs
echo ```
echo.
echo ## SDK Version
echo.
echo The QVAC SDK version used by this project is:
echo.
echo ```text
echo QVAC SDK: 0.19.1
echo ```
echo.
echo ## Local-First AI
echo.
echo LedgerLens uses local-first AI inference through the QVAC SDK. The QVAC model is loaded and used locally on the user's device.
echo.
echo No external AI API key is required for the inference workflow.
echo.
echo ## Accounting Guardrails
echo.
echo LedgerLens includes accounting guardrails designed to help students avoid common beginner mistakes when working with:
echo.
echo - Business transactions
echo - Journal entries
echo - Debits and credits
echo - The accounting equation
echo.
echo ## License
echo.
echo This project is licensed under the MIT License.
) > README.md

echo README.md has been updated successfully.