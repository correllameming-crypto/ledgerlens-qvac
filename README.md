# LedgerLens

LedgerLens is a local-first accounting study companion powered by Tether's QVAC SDK.

It helps accounting students analyze business transactions, understand journal entries, and learn the accounting equation.

## Features

- AI-powered accounting transaction analysis
- Journal entry explanations
- Debit and credit reasoning
- Accounting concept explanations
- Student study tips
- Accounting equation guidance
- Local-first AI inference with QVAC
- Accounting guardrails for common beginner mistakes

## QVAC SDK

LedgerLens uses **Tether's QVAC SDK version 0.19.1**.

The application uses:

- `loadModel`
- `completion`

The QVAC model is loaded and used locally on the user's device.

No external AI API key is required for the inference workflow.

## Requirements

- Node.js
- npm
- A computer capable of running the QVAC model

## Installation

Clone the repository:

```bash
git clone https://github.com/correllameming-crypto/ledgerlens-qvac.git
cd ledgerlens-qvac