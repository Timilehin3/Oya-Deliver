import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import CartItem from '../components/ui/CartItem';
import EmptyState from '../components/ui/EmptyState';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';

const CartPage = () => {
  const navigate = useNavigate();
  const {
    items,
    cartSubtotal,
    cartTotal,
    deliveryFee,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const [updatingId, setUpdatingId] = useState(null);

  const handleQuantityChange = async (itemId, quantity) => {
    setUpdatingId(itemId);
    try {
      await updateQuantity(itemId, quantity);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (itemId) => {
    setUpdatingId(itemId);
    try {
      await removeFromCart(itemId);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!items.length) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add groceries to your cart and come back here to review your order."
        image="/images/empty-cart.svg"
        actionLabel="Shop groceries"
        actionTo="/products"
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <p className="text-sm font-semibold text-oya-green uppercase tracking-[0.25em]">
            Your Basket
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-oya-teal">Cart summary</h1>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-oya-teal hover:text-oya-green"
        >
          <FiArrowLeft className="w-4 h-4" />
          Continue shopping
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
              updating={updatingId === item.id}
            />
          ))}
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-oya-teal/10 bg-white p-6">
            <h2 className="text-xl font-extrabold text-oya-teal mb-5">Order summary</h2>
            <div className="space-y-4 text-oya-teal/70">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery fee</span>
                <span>{formatPrice(items.length ? deliveryFee : 0)}</span>
              </div>
              <div className="border-t border-oya-teal/10 pt-4 flex items-center justify-between text-lg font-bold text-oya-teal">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="mt-6 w-full rounded-xl bg-oya-green px-5 py-3 text-sm font-bold text-white hover:bg-oya-teal transition-colors"
            >
              Proceed to checkout
            </button>

            <button
              type="button"
              onClick={() => clearCart()}
              className="mt-3 w-full rounded-xl border border-oya-teal/10 bg-oya-paper px-5 py-3 text-sm font-semibold text-oya-teal hover:bg-oya-teal/10 transition-colors"
            >
              Clear cart
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
