import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import supabase, { supabaseConfigured } from "../supabase/client";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
const DELIVERY_FEE = 1500;
const LOCAL_CART_KEY = "cart_guest_items";

function cartReducer(state, action) {
  switch (action.type) {
    case "SET_ITEMS":
      return action.payload;
    default:
      return state;
  }
}

function mergeItems(server = [], local = []) {
  const map = new Map();
  server.forEach((it) => map.set(it.id, { ...it }));
  local.forEach((it) => {
    if (map.has(it.id)) {
      map.set(it.id, {
        ...map.get(it.id),
        quantity: map.get(it.id).quantity + (it.quantity || 0),
      });
    } else {
      map.set(it.id, { ...it });
    }
  });
  return Array.from(map.values());
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, dispatch] = useReducer(cartReducer, []);

  const userId = useMemo(() => (user ? user.uid : null), [user]);

  useEffect(() => {
    let mounted = true;

    const loadLocal = () => {
      try {
        const raw = window.localStorage.getItem(LOCAL_CART_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    };

    if (!supabaseConfigured || !supabase || !userId) {
      // No supabase or not signed in: load guest cart from localStorage
      const localItems = loadLocal();
      if (mounted) dispatch({ type: "SET_ITEMS", payload: localItems });
      return undefined;
    }

    const fetchCart = async () => {
      const localItems = loadLocal();

      const { data, error } = await supabase
        .from("carts")
        .select("items")
        .eq("user_id", userId)
        .single();
      if (error && error.code !== "PGRST116") {
        // ignore not found
      }
      const serverItems = data?.items ?? [];

      // If guest local items exist, merge them into server cart and persist
      let merged = serverItems;
      if (localItems && localItems.length) {
        merged = mergeItems(serverItems, localItems);
        try {
          await supabase
            .from("carts")
            .upsert(
              {
                user_id: userId,
                items: merged,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "user_id" }
            );
          // clear guest cart
          try {
            window.localStorage.removeItem(LOCAL_CART_KEY);
          } catch {}
        } catch (e) {
          // ignore merge errors; fall back to showing merged locally
        }
      }

      if (mounted) dispatch({ type: "SET_ITEMS", payload: merged });
    };

    fetchCart();

    // realtime subscription (listen for updates to this user's cart)
    let channel = null;
    try {
      channel = supabase
        .channel(`public:carts_user_${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "carts",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            const items = payload.new?.items ?? [];
            if (mounted) dispatch({ type: "SET_ITEMS", payload: items });
          }
        )
        .subscribe();
    } catch (e) {
      // realtime not configured; fall back to fetch-on-write
    }

    return () => {
      mounted = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, [userId]);

  const persist = async (nextItems) => {
    if (supabaseConfigured && supabase && userId) {
      const payload = {
        user_id: userId,
        items: nextItems,
        updated_at: new Date().toISOString(),
      };
      try {
        await supabase.from("carts").upsert(payload, { onConflict: "user_id" });
      } catch (e) {
        // swallow; UI already updated optimistically
      }
    } else {
      try {
        window.localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(nextItems));
      } catch {
        // ignore localStorage failures
      }
    }
  };

  const addToCart = async (product, quantity = 1) => {
    const existing = items.find((i) => i.id === product.id);
    const next = existing
      ? items.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      : [...items, { ...product, quantity }];
    dispatch({ type: "SET_ITEMS", payload: next });
    await persist(next);
  };

  const removeFromCart = async (productId) => {
    const next = items.filter((i) => i.id !== productId);
    dispatch({ type: "SET_ITEMS", payload: next });
    await persist(next);
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      await removeFromCart(productId);
      return;
    }
    const next = items.map((i) =>
      i.id === productId ? { ...i, quantity } : i
    );
    dispatch({ type: "SET_ITEMS", payload: next });
    await persist(next);
  };

  const clearCart = async () => {
    const next = [];
    dispatch({ type: "SET_ITEMS", payload: next });
    if (supabaseConfigured && supabase && userId) {
      try {
        await supabase.from("carts").delete().eq("user_id", userId);
      } catch {}
    }
    try {
      window.localStorage.removeItem(LOCAL_CART_KEY);
    } catch {}
  };

  const cartCount = items.reduce((sum, i) => sum + (i.quantity || 0), 0);
  const cartSubtotal = items.reduce(
    (sum, i) => sum + (i.price || 0) * (i.quantity || 0),
    0
  );
  const cartTotal = cartSubtotal + (items.length ? DELIVERY_FEE : 0);

  const value = {
    items,
    cartCount,
    cartSubtotal,
    cartTotal,
    deliveryFee: DELIVERY_FEE,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
