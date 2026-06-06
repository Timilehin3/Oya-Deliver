# Oya Deliver

Grocery delivery platform built with React, Vite, Tailwind CSS, and **Supabase** (Postgres) for backend data. Frontend auth can be provided by **Clerk** (optional). Firebase is supported as a legacy fallback in some components but the repository is being migrated to Supabase.

## Stack

- React 19 + Vite
- React Router v7
- Tailwind CSS v4
- Supabase (Postgres) + Clerk (optional frontend auth)
- react-hot-toast, react-icons

## Setup

```bash
npm install
cp .env.example .env
# Add Supabase keys (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) and optional Clerk publishable key
npm run dev
```

### Supabase (recommended) and Clerk (optional frontend auth)

1. Create a project at https://app.supabase.com and get `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
2. Add the keys to your `.env` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. (Optional) Create a Clerk application for frontend auth and add `VITE_CLERK_PUBLISHABLE_KEY`.
4. Create required tables using the migration SQL in `MIGRATE_TO_SUPABASE.md` or via the SQL editor in Supabase.
5. Create demo users (see `src/data/seedData.js` or use the Supabase Auth panel).

### Database tables (Supabase / Postgres)

| Table         | Primary Key                 | Purpose                                                 |
| ------------- | --------------------------- | ------------------------------------------------------- |
| `users`       | `id` (serial) or `clerk_id` | Profile, address, role (sync with Clerk via `clerk_id`) |
| `carts`       | `id` (serial)               | Cart metadata (user_id, created_at)                     |
| `cart_items`  | `id` (serial)               | Line items for carts (cart_id, product_id, qty, price)  |
| `orders`      | `id` (serial)               | Orders & tracking status                                |
| `order_items` | `id` (serial)               | Line items for orders                                   |

Product catalog is loaded from `src/data/products.json` with prices in **Nigerian Naira (₦)**. Delivery fee is ₦1,500.

## Build progress

- Phase 0 — layout, routing, Firebase contexts
- Phase 1 — landing page
- Phase 2 — products listing with search and filters
- Phases 3–11 — in progress (placeholders)

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run preview` — preview production build

## Brand assets

- Navbar: `src/assets/oyadeliver_both_textandbird.png`
- Footer / favicon: `src/assets/Oyadeliver_logo.png` → `public/favicon.png`
- Loader: `src/assets/oyadeliver-loading.webm`

## Build phases

Development follows a page-by-page plan (Phase 0 layout → Phase 11 404). Pause for review after each phase.
