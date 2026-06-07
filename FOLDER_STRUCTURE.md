# Oya Deliver Folder Structure

## Root

- `index.html`
- `package.json`
- `package-lock.json`
- `vite.config.js`
- `tailwind.config.js`
- `eslint.config.js`
- `README.md`
- `PROJECT_PROGRESS.md`
- `FOLDER_STRUCTURE.md`
- `public/`
- `scripts/`
- `src/`

## public/

- `_redirects`
- `images/`

## src/

- `App.jsx`
- `main.jsx`
- `index.css`
- `assets/`
- `components/`
  - `forms/`
    - `CheckoutForm.jsx`
    - `ContactForm.jsx`
    - `LoginForm.jsx`
    - `RegisterForm.jsx`
  - `layout/`
    - `Footer.jsx`
    - `Layout.jsx`
    - `Navbar.jsx`
  - `ui/`
    - `CartItem.jsx`
    - `EmptyState.jsx`
    - `ErrorMessage.jsx`
    - `Loader.jsx`
    - `OrderCard.jsx`
    - `ProductCard.jsx`
    - `ProductCardSkeleton.jsx`
    - `ProtectedRoute.jsx`
- `context/`
  - `AuthContext.jsx`
  - `CartContext.jsx`
- `data/`
  - `categories.json`
  - `products.json`
  - `seedData.js`
- `firebase/`
  - `config.js`
- `hooks/`
  - `useFetch.js`
  - `useLocalStorage.js`
- `pages/`
  - `CartPage.jsx`
  - `CheckoutPage.jsx`
  - `Error404Page.jsx`
  - `LandingPage.jsx`
  - `LoginPage.jsx`
  - `OrderHistoryPage.jsx`
  - `OrderStatusPage.jsx`
  - `PagePlaceholder.jsx`
  - `PaymentPage.jsx`
  - `ProductDetailPage.jsx`
  - `ProductsPage.jsx`
  - `RegisterPage.jsx`
  - `TrackingPage.jsx`
  - `UserProfilePage.jsx`
- `utils/`
  - `formatPrice.js`
  - `generateOrderId.js`
  - `validate.js`

## Notes

- `src/components/` contains reusable UI elements and page-level layout components.
- `src/context/` stores app state providers for authentication and cart data.
- `src/pages/` contains route pages for the storefront, auth, checkout, profile, and order flows.
- `src/data/` currently contains local JSON product and category data.
- `firebase/config.js` is present even though auth has been migrated to Supabase.
