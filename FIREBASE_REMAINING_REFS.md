# Remaining Firebase References — Migration Status

**Date:** 2026-06-06  
**Status:** Most Firestore API calls already removed; only config fallback references remain.

---

## Summary

After scanning `src/` for Firestore API usages (`getDoc`, `setDoc`, `onSnapshot`, `collection`, `addDoc`, `deleteDoc`, `doc`, `getFirestore`), **no active Firestore operations were found**. The migration is largely complete.

**Remaining references** are purely for backward-compatibility and configuration fallback.

---

## Detailed Inventory

### 1. **`src/firebase/config.js`** ✋ _Still Active_

**Status:** Exports `firebaseConfigured` flag for fallback checks; actual Firebase initialization kept but not used in app logic.

**Current Content:**

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  /* env-gated config */
};
export const firebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY
);

let app, auth, db;
if (firebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db };
```

**Why kept:**

- Exported `firebaseConfigured` flag used in form UI to detect "neither Supabase nor Firebase" state.
- Env-gated initialization; safe to leave in place.

**Migration path:**

- **Option A (Recommended):** Keep as-is; mark deprecated in comments since app prefers Clerk + Supabase.
- **Option B:** Remove entirely once forms updated to check only `supabaseConfigured && clerkPublishableKey`.

**Recommendation:** Leave for now; safe and provides fallback detection logic.

---

### 2. **`src/components/forms/LoginForm.jsx`** — Fallback Check

**Line 7:** Imports `firebaseConfigured`

```javascript
import { firebaseConfigured } from "../../firebase/config";
```

**Lines 65, 85, 108, 138, 144:** Used in conditional checks

```javascript
{!(supabaseConfigured || firebaseConfigured) && (
  <ErrorMessage>Backend is not configured...</ErrorMessage>
)}

disabled={!(supabaseConfigured || firebaseConfigured) || loading}
```

**Status:** ✅ No Firestore API calls; purely a fallback guard.  
**Action:** Can leave as-is or simplify to `!supabaseConfigured` (if Firebase is fully deprecated).

---

### 3. **`src/components/forms/RegisterForm.jsx`** — Fallback Check

**Line 7:** Imports `firebaseConfigured`

```javascript
import { firebaseConfigured } from "../../firebase/config";
```

**Lines 88, 111, 133, 155, 178, 214, 250:** Used in conditional checks

```javascript
{!(supabaseConfigured || firebaseConfigured) && (
  <ErrorMessage>Supabase or Firebase keys...</ErrorMessage>
)}

disabled={!(supabaseConfigured || firebaseConfigured) || loading}
```

**Status:** ✅ No Firestore API calls; purely a fallback guard.  
**Action:** Can leave as-is or simplify to `!supabaseConfigured`.

---

## Firestore API Usage Audit

### ✅ Already Migrated

| API / Pattern                 | Previous File             | Migrated To                                 | Status      |
| ----------------------------- | ------------------------- | ------------------------------------------- | ----------- |
| `onSnapshot(collection(...))` | CartContext               | Supabase realtime `.on('postgres_changes')` | ✅ Complete |
| `setDoc(doc(...), data)`      | AuthContext               | Supabase `.insert()` / `.update()`          | ✅ Complete |
| `getDoc(doc(...))`            | AuthContext, CheckoutPage | Supabase `.select()`                        | ✅ Complete |
| Cart persistence              | CartContext               | Supabase `.upsert()`                        | ✅ Complete |
| User profile sync             | AuthContext               | Supabase `users` table + Clerk              | ✅ Complete |

### ❌ Not Found / Never Used

No active usage of: `addDoc`, `deleteDoc`, `getDocs`, Firestore queries with `where`, `orderBy`, etc.

---

## Recommended Next Steps

### **Phase 1 (Immediate)** — Clean Config

**Option A: Deprecate Firebase gracefully (Recommended)**

- Add `@deprecated` JSDoc to `src/firebase/config.js` exports
- Keep file in place; update message to "Firebase imports deprecated; use Supabase instead"
- No code changes needed

**Option B: Remove Firebase entirely**

- Delete `src/firebase/config.js`
- Update `LoginForm.jsx` & `RegisterForm.jsx` to check only `supabaseConfigured`
- Remove Firebase imports from `package.json` and reinstall

### **Phase 2 (Optional)** — Clean Dependencies

Run:

```bash
npm uninstall firebase @firebase/app @firebase/auth @firebase/firestore
npm install
```

Then verify no import errors:

```bash
npm run build
```

### **Phase 3 (Production)** — Environment Variables

Remove or mark obsolete in `.env`:

```
# VITE_FIREBASE_API_KEY=
# VITE_FIREBASE_AUTH_DOMAIN=
# VITE_FIREBASE_PROJECT_ID=
# ... etc
```

---

## Conclusion

**Migration Status: ~95% Complete**

- ✅ AuthContext: Using Clerk + Supabase
- ✅ CartContext: Using Supabase localStorage merge
- ✅ No active Firestore API calls in app logic
- ⏳ Firebase config still present for fallback detection (safe to leave or remove)
- ⏳ Firebase packages still installed (can be removed)

**Recommended action:** Keep `src/firebase/config.js` for now; it's minimal and provides fallback logic. Plan full removal in a follow-up PR after confirming Supabase is stable in production.
