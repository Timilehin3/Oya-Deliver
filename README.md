# Oya Deliver

Grocery delivery platform built with React, Vite, Tailwind CSS, and **Firebase** (Auth + Firestore).

## Stack

- React 19 + Vite
- React Router v7
- Tailwind CSS v4
- Firebase Auth & Firestore
- react-hot-toast, react-icons

## Setup

```bash
npm install
cp .env.example .env
# Add Firebase web app config from Firebase Console → Project settings
npm run dev
```

### Firebase

1. Create a project at [Firebase Console](https://console.firebase.google.com).
2. Enable **Authentication → Email/Password**.
3. Create a **Firestore** database.
4. Copy web app keys into `.env`.
5. Create demo users (see `src/data/seedData.js`):
   - `user@test.com` / `password123`
   - `admin@oya.com` / `admin123`

### Firestore collections (used by the app)

| Collection | Document ID | Purpose |
|------------|-------------|---------|
| `users` | `{uid}` | Profile, address, role |
| `carts` | `{uid}` | Cart line items |
| `orders` | `{orderId}` | Orders & tracking status |

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
