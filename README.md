# Oya Deliver

Oya Deliver is a student-built grocery delivery web app made with React, Vite, and Tailwind CSS. The site is designed to show how a simple e-commerce flow can work with product browsing, authentication, cart management, checkout, and order history.

This project is a learning exercise intended to demonstrate frontend routing, state management, and integration with Supabase Auth. The product catalog is loaded from local JSON data, while authentication and backend state are wired through Supabase.

## What this website does

- Shows a landing page with featured categories and product highlights.
- Lets users view products, filter by category, and search by name.
- Supports product detail pages with quantity selection.
- Provides a cart page where users can review items before checkout.
- Includes login and register pages for signed-in user experience.
- Offers order tracking, order history, and user profile pages.
- Uses protected routing so only signed-in users can access checkout and orders.

## How to use it

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Create a `.env` file and add Supabase connection keys.
4. Start the dev server with `npm run dev`.
5. Open the app in your browser and explore the product pages.
6. Use the login/register flow to sign in and access protected pages.

## Project stack

- React 19 + Vite
- React Router v7
- Tailwind CSS v4
- Supabase Auth for authentication
- Local data from `src/data/products.json` and `src/data/categories.json`
- Reusable UI components in `src/components/`

## Setup

```bash
npm install
cp .env.example .env
# Add Supabase keys below
npm run dev
```

Then edit `.env` with:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Supabase setup (recommended)

1. Create a project at https://app.supabase.com.
2. Copy your `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
3. Add them to `.env` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Optionally use Supabase Auth to create demo users.

## Notes for students

- The product catalog is currently static and stored in `src/data/products.json`.
- Authentication is handled in `src/context/AuthContext.jsx`.
- Cart state is managed in `src/context/CartContext.jsx`.
- Pages are located in `src/pages/` and route definitions live in `src/App.jsx`.
- The app uses `React.lazy` and `Suspense` for route-level code splitting.

## Available scripts

- `npm run dev` — start the local development server
- `npm run build` — build the app for production
- `npm run preview` — preview the production build locally

## Project structure overview

- `src/pages/` — page-level route components
- `src/components/` — reusable shared UI components
- `src/context/` — app providers for auth and cart state
- `src/data/` — static product and category data
- `src/utils/` — helper utilities such as price formatting

## Current status

This project is in active development. Core navigation and auth flows are available, and the app is being migrated to use Supabase for authentication.

> Note: Some legacy Firebase files remain in the repo, but the app is migrating toward Supabase as the main backend provider.
