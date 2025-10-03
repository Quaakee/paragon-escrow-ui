# Paragon Escrow - Frontend

React-based web interface for the Paragon Escrow platform on BSV blockchain.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 7** - Build tool
- **Material-UI v7** - UI components
- **React Router v7** - Navigation
- **Zustand** - Client state
- **React Query v5** - Server state & caching
- **React Hook Form + Zod** - Forms & validation
- **@bsv/sdk v1.8.0** - BSV blockchain SDK
- **scrypt-ts v1.4.5** - Smart contract integration

## Prerequisites

- Node.js 18+
- MetaNet Desktop wallet (localhost:3321)
- Backend running (imports backend entities)

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Opens at `http://localhost:3000`

## Available Scripts

```bash
npm run dev          # Start dev server (hot reload)
npm run build        # Production build (skips tsc)
npm run build:check  # Production build with TypeScript check
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Project Structure

```
src/
├── components/       # Shared components
│   ├── common/       # ErrorBoundary, LoadingSpinner
│   ├── layout/       # Layout, Header
│   └── wallet/       # WalletConnect
├── features/         # Feature modules
│   └── seeker/       # Seeker dashboard (✅ complete)
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── types/
│       └── utils/
├── services/         # Backend integration
│   ├── blockchain/   # SeekerService, FurnisherService, PlatformService
│   └── wallet/       # WalletService
├── stores/           # Zustand stores
├── utils/            # Utilities (formatting, validation)
├── config/           # Global config
└── types/            # TypeScript types
```

## Features

### ✅ Seeker Dashboard (Phase 3 Complete)

- Create work contracts
- View/filter/sort contracts
- Review and accept bids
- Approve completed work
- Raise disputes
- Cancel contracts (before bid acceptance)

### 🔜 Coming Soon

- Furnisher Dashboard
- Platform Dashboard

## Configuration

Environment variables (optional):

```env
VITE_BSV_NETWORK=testnet
VITE_WALLET_URL=http://localhost:3321
VITE_TOPIC_MANAGER=tm_escrow
VITE_LOOKUP_SERVICE=ls_escrow
```

## Usage

1. **Connect Wallet**: Click "Connect Wallet" → Approve in MetaNet Desktop
2. **Select Role**: Choose Seeker/Furnisher/Platform
3. **Create Contract** (Seeker):
   - Work description (first line = title)
   - Bounty amount (satoshis)
   - Deadline
4. **Sign Transaction**: Approve in MetaNet Desktop

## Key Patterns

- **BRC-100 Compliant**: All transactions via `wallet.createAction()`
- **Overlay Network**: Contracts stored via TopicManager/LookupService
- **Service Layer**: Frontend wraps backend entities
- **Hex/ASCII Conversion**: All user text converted from hex for display

## Known Issues

1. **Phantom Bids**: sCrypt contracts use `FixedArray<Bid, 4>` - placeholders filtered in frontend
2. **Production Build**: Polyfill issues - use dev mode
3. **Updates**: 30-second polling (not real-time)

## Troubleshooting

**Wallet won't connect?**
- MetaNet Desktop running on localhost:3321?
- Protocol name has no hyphens (BRC-42 compliance)

**Contracts showing hex?**
- Refresh browser
- Check console for errors

**Build errors?**
- Use `npm run build` (skips TypeScript check)
- Or `npm run build:check` for detailed errors

## Development Notes

- Material-UI v7 uses `<Grid size={{ xs: 12 }}>` not `xs={12}`
- All imports use `@/` alias paths
- Services import backend entities from `../../../../backend/src/...`
- Use `hexToAscii()` for all user-entered text display
- Use `getRealBidsCount()` instead of `contract.record.bids.length`
