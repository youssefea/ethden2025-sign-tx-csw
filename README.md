# Sign Message using Smart Wallet

This is a fork of a [repo](https://github.com/wilsoncusack/wagmi-scw) that has examples of signing messages using a smart wallet.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-wagmi`](https://github.com/wevm/wagmi/tree/main/packages/create-wagmi) and updated for Smart Wallet.

## Key components

There are three components for signing messages:

- [SignMessage](src/components/SignMessage.tsx): This shows you how to sign a simple message using Coinbase Smart Wallet. The verification is done on the server side by using the `verify` API to be found in `src/app/api/verify/route.ts`.
- [TypedSign](src/components/TypedSign.tsx): This shows you how to sign a typed message using Coinbase Smart Wallet. The verification is done on the client side.
- [Permit2](src/components/Permit2.tsx): This shows you how to sign a permit2 message using Coinbase Smart Wallet. The verification is done on the client side.

## Setup

To run:

1. install bun `curl -fsSL <https://bun.sh/install> | bash`
2. install packages `bun i`
3. run next app `bun run dev`

To use:

1. click "Coinbase wallet" button
2. create a new wallet, or use an existing one
3. transact! Click "mint" and use your new smart wallet on Base Sepolia.
