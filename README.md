# LedgerLens

LedgerLens is a local-first accounting study companion powered by Tether's QVAC SDK.

It helps accounting students analyze basic business transactions, understand journal entries, and see how transactions affect the accounting equation.

## What it does

LedgerLens takes an accounting transaction such as:

> The business purchased ₱10,000 of supplies on account.

It provides:

- Journal entry
- Explanation of the debit and credit
- Accounting concept
- Student tip
- Accounting equation impact

## QVAC

LedgerLens uses Tether's QVAC SDK to run AI inference locally on the user's machine.

The project uses:

- `@qvac/sdk` version `0.19.1`
- `loadModel`
- `completion`

The QVAC model is downloaded locally the first time it is used.

No external AI API key is required for the AI inference.

## Requirements

- Node.js
- npm
- A computer capable of running the QVAC model

## Installation

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
cd ledgerlens-qvac