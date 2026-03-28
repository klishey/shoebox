# Shoebox Monorepo

## Claude Code Rules (Read this first before doing anything)

1. **Always read this entire file** before writing any code or answering questions.
2. **Always update the Progress checklist** in this file after completing a step.
3. **Always create a feature markdown file** inside the relevant app's `docs/features/` folder when a new feature is built. See the Feature Docs section below for the required template.
4. **Never skip steps** — complete them in the order listed unless explicitly told otherwise.
5. **Ask before adding** any library or tool not already listed in the Tech Stack section.
6. **Never assume** — if something is unclear, ask before writing code.

---

## Project Overview

An e-commerce monorepo for a shoe store built with TanStack Start, deployed on Vercel.
We are starting with the customer-facing frontend (`shoebox-app`) using mock data before connecting a real backend.

**Owner:** klishey
**GitHub:** https://github.com/klishey/shoebox

---

## Tech Stack

| Layer | Technology |
|---|---|
| Monorepo tooling | Turborepo + pnpm workspaces |
| Frontend (all apps) | TanStack Start + React |
| Styling | TailwindCSS |
| Language | TypeScript |
| Deployment | Vercel |
| Database (later) | Neon (PostgreSQL) |
| ORM (later) | Drizzle ORM |
| Backend framework (later) | Hono |

---

## Folder Structure

```
shoebox/
├── CLAUDE.md                          ← you are here
├── apps/
│   ├── shoebox-app/                   # Customer-facing frontend (START HERE)
│   │   ├── docs/
│   │   │   └── features/             # One markdown file per completed feature
│   │   └── app/
│   │       ├── routes/
│   │       ├── components/
│   │       └── mock-data/
│   ├── shoebox-studio-app/            # Admin frontend (later)
│   └── shoebox-service-app/           # Backend API (later)
├── packages/
│   ├── ui/                            # Shared UI components
│   ├── types/                         # Shared TypeScript types
│   └── utils/                         # Shared utilities
├── .github/
│   └── workflows/
│       └── shoebox-app.yml
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

## Feature Docs

Every completed feature must have a markdown file saved at:
```
apps/shoebox-app/docs/features/FEATURE_NAME.md
```

Use this exact template:

```md
# Feature: [Feature Name]

## What it does
Short description of what this feature does for the user.

## Files changed
- `app/routes/...`
- `app/components/...`

## How it works
Brief explanation of the logic.

## Mock data used
Yes / No — describe if applicable.

## TODO (connect to real API later)
- [ ] Replace mock data with real API endpoint
```

---

## Phase 1 — Monorepo Foundation

### Files to create

**`package.json`** (root)
```json
{
  "name": "shoebox",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck"
  },
  "devDependencies": {
    "turbo": "latest",
    "typescript": "^5"
  },
  "packageManager": "pnpm@9.0.0"
}
```

**`pnpm-workspace.yaml`**
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**`turbo.json`**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".output/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "typecheck": {}
  }
}
```

**`.gitignore`**
```
node_modules
.turbo
dist
.output
.env
.env.local
*.env
```

---

## Phase 2 — Shared Packages

### `packages/types`

```ts
// packages/types/src/product.ts
export type Product = {
  id: string
  name: string
  brand: string
  price: number
  images: string[]
  sizes: string[]
  category: string
  inStock: boolean
  description: string
}

export type CartItem = {
  product: Product
  size: string
  quantity: number
}

export type Order = {
  id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  createdAt: string
}
```

### `packages/utils`

```ts
// packages/utils/src/format.ts
export const formatPrice = (price: number): string =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(price)

export const formatDate = (date: string): string =>
  new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium',
  }).format(new Date(date))
```

### `packages/ui`

Shared components used across `shoebox-app` and `shoebox-studio-app`:
- `Button`
- `Card`
- `Badge`
- `Input`

### Package naming convention

All packages use the `@shoebox/` prefix:

```ts
import { Product } from '@shoebox/types'
import { formatPrice } from '@shoebox/utils'
import { Button } from '@shoebox/ui'
```

---

## Phase 3 — shoebox-app Routes

| Route | Page | Notes |
|---|---|---|
| `/` | Homepage | Hero banner, featured products, categories |
| `/products` | Catalog | Grid of ProductCards, filter by size/brand |
| `/products/$productId` | Product Detail | Images, size picker, Add to Cart |
| `/cart` | Cart | List of CartItems, subtotal, go to checkout |
| `/checkout` | Checkout | Form UI only — no payment yet |

### Mock data

```ts
// apps/shoebox-app/app/mock-data/products.ts
import type { Product } from '@shoebox/types'

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Air Stride Pro',
    brand: 'Nike',
    price: 4999,
    images: ['/images/shoe-1.jpg'],
    sizes: ['7', '8', '9', '10', '11'],
    category: 'Running',
    inStock: true,
    description: 'Lightweight running shoe for everyday use.',
  },
]
```

---

## Phase 4 — GitHub Actions CI

```yaml
# .github/workflows/shoebox-app.yml
name: shoebox-app CI

on:
  push:
    paths:
      - 'apps/shoebox-app/**'
      - 'packages/**'
  pull_request:
    paths:
      - 'apps/shoebox-app/**'
      - 'packages/**'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm turbo typecheck --filter=shoebox-app
      - run: pnpm turbo build --filter=shoebox-app
```

---

## Progress

> Claude Code: update the checkboxes below as each step is completed.

### Phase 1 — Monorepo Foundation
- [x] Step 1 — GitHub repo created and cloned locally
- [x] Step 2 — `package.json` (root) created
- [x] Step 3 — `pnpm-workspace.yaml` created
- [x] Step 4 — `turbo.json` created
- [x] Step 5 — `.gitignore` created
- [ ] Step 6 — `turbo dev --filter=shoebox-app` runs successfully

### Phase 2 — Shared Packages
- [ ] Step 7 — `packages/types` created with Product, CartItem, Order types
- [ ] Step 8 — `packages/utils` created with formatPrice, formatDate
- [ ] Step 9 — `packages/ui` created with Button, Card, Badge, Input

### Phase 3 — shoebox-app
- [ ] Step 10 — shoebox-app scaffolded with TanStack Start
- [ ] Step 11 — `mock-data/products.ts` created
- [ ] Step 12 — `/` Homepage route built
- [ ] Step 13 — `/products` Catalog route built
- [ ] Step 14 — `/products/$productId` Product Detail route built
- [ ] Step 15 — `/cart` Cart route built
- [ ] Step 16 — `/checkout` Checkout route built (UI only)
- [ ] Step 17 — `Navbar.tsx` component built
- [ ] Step 18 — `ProductCard.tsx` component built
- [ ] Step 19 — `CartDrawer.tsx` component built
- [ ] Step 20 — `Footer.tsx` component built

### Phase 4 — CI/CD
- [ ] Step 21 — GitHub Actions workflow created for shoebox-app

---

## What is NOT in scope yet

Do not build these until told to:

- Real API calls to `shoebox-service-app`
- Authentication / login / user accounts
- Payment processing (Stripe, PayMongo, etc.)
- `shoebox-service-app` backend (Hono + Drizzle + Neon)
- `shoebox-studio-app` admin panel
- Image uploads / CDN

---

## Commands Reference

```bash
# Run only shoebox-app in dev mode
turbo dev --filter=shoebox-app

# Build only shoebox-app
turbo build --filter=shoebox-app

# Or cd in and run directly
cd apps/shoebox-app
pnpm dev

# Install a dependency in a specific app
pnpm --filter=shoebox-app add <package-name>

# Install a shared dev dependency at the root
pnpm add -D <package-name> -w
```