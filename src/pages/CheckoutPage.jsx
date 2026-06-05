import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import EmptyState from "../components/ui/EmptyState";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";
import { isEmail, isZip, required } from "../utils/validate";

const CheckoutPage = () => {
  const { user, profile } = useAuth();
  const { items, cartCount, cartSubtotal, cartTotal, deliveryFee } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: profile?.name || "",
    email: user?.email || "",
    phone: profile?.phone || "",
    address: "",
    apartment: "",
    city: "",
    region: "",
    postalCode: "",
    instructions: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: profile?.name || prev.name,
      phone: profile?.phone || prev.phone,
      email: user?.email || prev.email,
    }));
  }, [profile, user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!required(form.name)) {
      nextErrors.name = "Enter the recipient name.";
    }
    if (!isEmail(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!required(form.phone)) {
      nextErrors.phone = "Enter a phone number.";
    }
    if (!required(form.address)) {
      nextErrors.address = "Enter your delivery address.";
    }
    if (!required(form.city)) {
      nextErrors.city = "Enter your city.";
    }
    if (!required(form.region)) {
      nextErrors.region = "Enter your state or province.";
    }
    if (!required(form.postalCode)) {
      nextErrors.postalCode = "Enter your postal code.";
    } else if (!isZip(form.postalCode)) {
      nextErrors.postalCode = "Enter a valid postal code.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    const checkoutData = {
      ...form,
      items,
      totals: {
        subtotal: cartSubtotal,
        deliveryFee: items.length ? deliveryFee : 0,
        total: cartTotal,
      },
    };
    sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    navigate("/payment");
  };

  if (!items.length) {
    return (
      <section className="max-w-5xl mx-auto px-4 py-20">
        <EmptyState
          title="Your cart is empty"
          description="Add items before you proceed to checkout."
          actionLabel="Browse groceries"
          actionTo="/products"
        />
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      <div className="rounded-lg border border-oya-teal/10 bg-oya-paper p-5 mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-oya-teal/80">
              Step 2 of 3
            </p>
            <p className="mt-2 text-sm text-oya-teal/70">
              Confirm your delivery details before payment.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-oya-teal/70">
            <span className="rounded-full border border-oya-teal/10 bg-white px-3 py-1">
              Cart
            </span>
            <span className="rounded-full bg-oya-teal px-3 py-1 text-white">
              Delivery
            </span>
            <span className="rounded-full border border-oya-teal/10 bg-white px-3 py-1">
              Payment
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-oya-teal/70">Checkout</p>
              <h1 className="mt-2 text-3xl font-bold text-oya-teal">
                Delivery details
              </h1>
              <p className="mt-2 text-sm text-oya-teal/70 max-w-2xl">
                Confirm your address and contact information before moving to
                payment.
              </p>
            </div>
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 text-sm font-semibold text-oya-green hover:text-oya-teal transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to cart
            </Link>
          </div>

          <div className="rounded-lg border border-oya-teal/10 bg-white p-6">
            <form onSubmit={handleSubmit} className="grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-oya-teal">
                  Name
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-oya-green focus:ring-2 focus:ring-oya-green/20"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-rose-600">{errors.name}</p>
                  )}
                </label>

                <label className="block text-sm font-semibold text-oya-teal">
                  Email
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-oya-green focus:ring-2 focus:ring-oya-green/20"
                    disabled
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-rose-600">{errors.email}</p>
                  )}
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-oya-teal">
                  Phone
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-oya-green focus:ring-2 focus:ring-oya-green/20"
                    placeholder="0801 234 5678"
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-rose-600">{errors.phone}</p>
                  )}
                </label>

                <label className="block text-sm font-semibold text-oya-teal">
                  Postal code
                  <input
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-oya-green focus:ring-2 focus:ring-oya-green/20"
                    placeholder="10001"
                  />
                  {errors.postalCode && (
                    <p className="mt-2 text-sm text-rose-600">
                      {errors.postalCode}
                    </p>
                  )}
                </label>
              </div>

              <label className="block text-sm font-semibold text-oya-teal">
                Street address
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-oya-green focus:ring-2 focus:ring-oya-green/20"
                  placeholder="123 Market Street"
                />
                {errors.address && (
                  <p className="mt-2 text-sm text-rose-600">{errors.address}</p>
                )}
              </label>

              <label className="block text-sm font-semibold text-oya-teal">
                Apartment, suite, etc. (optional)
                <input
                  name="apartment"
                  value={form.apartment}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-oya-green focus:ring-2 focus:ring-oya-green/20"
                  placeholder="Apartment 4B"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-oya-teal">
                  City
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-oya-green focus:ring-2 focus:ring-oya-green/20"
                    placeholder="Lagos"
                  />
                  {errors.city && (
                    <p className="mt-2 text-sm text-rose-600">{errors.city}</p>
                  )}
                </label>

                <label className="block text-sm font-semibold text-oya-teal">
                  State / province
                  <input
                    name="region"
                    value={form.region}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-oya-green focus:ring-2 focus:ring-oya-green/20"
                    placeholder="Lagos State"
                  />
                  {errors.region && (
                    <p className="mt-2 text-sm text-rose-600">
                      {errors.region}
                    </p>
                  )}
                </label>
              </div>

              <label className="block text-sm font-semibold text-oya-teal">
                Delivery instructions (optional)
                <textarea
                  name="instructions"
                  value={form.instructions}
                  onChange={handleChange}
                  rows={4}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-oya-green focus:ring-2 focus:ring-oya-green/20"
                  placeholder="Leave the package at the gate if nobody is home."
                />
              </label>

              {errors.form && (
                <p className="rounded-lg border border-rose-200 bg-rose-100 px-4 py-3 text-sm text-rose-700">
                  {errors.form}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-oya-green px-5 py-3 text-sm font-semibold text-white hover:bg-oya-teal transition-colors"
              >
                Continue to payment
              </button>
            </form>
          </div>
        </div>

        <aside className="space-y-6 lg:w-[360px]">
          <div className="rounded-lg border border-oya-teal/10 bg-white p-6">
            <h2 className="text-lg font-bold text-oya-teal">Order summary</h2>
            <div className="mt-5 space-y-4 text-sm text-oya-teal/70">
              <div className="flex items-center justify-between">
                <span>Items</span>
                <span>{cartCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery fee</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <div className="border-t border-oya-teal/10 pt-4 flex items-center justify-between text-base font-bold text-oya-teal">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-oya-teal/10 bg-white p-6">
            <h2 className="text-lg font-bold text-oya-teal">Order details</h2>
            <p className="mt-3 text-sm text-oya-teal/70">
              Your delivery address and contact information are required to
              complete the order. Review everything before continuing.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default CheckoutPage;
