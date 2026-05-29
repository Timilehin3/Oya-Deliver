import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';
import { db, firebaseConfigured } from '../firebase/config';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
const DELIVERY_FEE = 1500;

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_ITEMS':
      return action.payload;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, dispatch] = useReducer(cartReducer, []);

  const cartRef = useMemo(() => {
    if (!user) return null;
    return doc(db, 'carts', user.uid);
  }, [user]);

  useEffect(() => {
    if (!firebaseConfigured || !db || !cartRef) {
      dispatch({ type: 'SET_ITEMS', payload: [] });
      return undefined;
    }
    const unsub = onSnapshot(cartRef, (snap) => {
      dispatch({ type: 'SET_ITEMS', payload: snap.exists() ? snap.data().items ?? [] : [] });
    });
    return unsub;
  }, [cartRef]);

  const persist = async (nextItems) => {
    if (!db || !cartRef) return;
    await setDoc(cartRef, { items: nextItems, updatedAt: new Date().toISOString() });
  };

  const addToCart = async (product, quantity = 1) => {
    if (!user) throw new Error('LOGIN_REQUIRED');
    const existing = items.find((i) => i.id === product.id);
    const next = existing
      ? items.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i,
        )
      : [...items, { ...product, quantity }];
    await persist(next);
  };

  const removeFromCart = async (productId) => {
    await persist(items.filter((i) => i.id !== productId));
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      await removeFromCart(productId);
      return;
    }
    await persist(
      items.map((i) => (i.id === productId ? { ...i, quantity } : i)),
    );
  };

  const clearCart = async () => {
    if (!cartRef) return;
    await deleteDoc(cartRef);
  };

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
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
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
