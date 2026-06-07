import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCreditCard, FiLock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import supabase, { supabaseConfigured } from "../supabase/client";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";
import EmptyState from "../components/ui/EmptyState";

/* ─── helpers ─────────────────────────────────────────────────────────── */
function generateId(prefix) {
  return `${prefix}_${Math.random().toString(36).substring(2, 11)}`;
}

function getAttempt(key) {
  try {
    const raw = localStorage.getItem(`payment_attempt_${key}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveAttempt(key, data) {
  try {
    localStorage.setItem(`payment_attempt_${key}`, JSON.stringify(data));
  } catch {}
}

/* ─── animated checkmark ──────────────────────────────────────────────── */
function SuccessAnimation() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm animate-fadeIn">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-oya-green/20 animate-ping" />
          <div className="relative w-20 h-20 rounded-full bg-oya-green flex items-center justify-center shadow-lg animate-bounceIn">
            <FiCheckCircle className="w-10 h-10 text-white" />
          </div>
        </div>
        <p className="text-2xl font-bold text-oya-teal">Payment successful!</p>
        <p className="text-sm text-oya-teal/60">Redirecting you to your order…</p>
      </div>
    </div>
  );
}

/* ─── processing overlay ──────────────────────────────────────────────── */
function ProcessingOverlay() {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 bg-white rounded-2xl p-10 shadow-2xl">
        <svg
          className="animate-spin w-10 h-10 text-oya-green"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p className="text-base font-semibold text-oya-teal">Processing payment…</p>
      </div>
    </div>
  );
}

/* ─── card network detection ─────────────────────────────────────────── */
function detectNetwork(rawDigits) {
  if (/^4/.test(rawDigits)) return "visa";
  if (/^5[1-5]|^2[2-7]/.test(rawDigits)) return "mastercard";
  if (/^(5061|6500|6501|6507|6509)/.test(rawDigits)) return "verve";
  return null;
}

// Verve can be 16–19 digits; others are 16
function maxCardLength(network) {
  return network === "verve" ? 19 : 16;
}

// Group into 4-digit blocks (works for any length up to 19)
function formatCardNumber(val, network) {
  const max = maxCardLength(network);
  const digits = val.replace(/\D/g, "").slice(0, max);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(val) {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

/* ─── network logos ───────────────────────────────────────────────────── */
function VisaLogo() {
  return (
    <svg viewBox="0 0 38 24" className="h-6 w-auto" aria-label="Visa">
      <rect width="38" height="24" rx="4" fill="#1A1F71" />
      <text x="5" y="17" fontFamily="Arial" fontWeight="bold" fontSize="13" fill="#FFFFFF" letterSpacing="-0.5">VISA</text>
    </svg>
  );
}

function MastercardLogo() {
  return (
    <svg viewBox="0 0 38 24" className="h-6 w-auto" aria-label="Mastercard">
      <rect width="38" height="24" rx="4" fill="#252525" />
      <circle cx="14" cy="12" r="8" fill="#EB001B" />
      <circle cx="24" cy="12" r="8" fill="#F79E1B" />
      <path d="M19 6.8a8 8 0 010 10.4A8 8 0 0119 6.8z" fill="#FF5F00" />
    </svg>
  );
}

function VerveLogo() {
  return (
    <svg viewBox="0 0 50 24" className="h-6 w-auto" aria-label="Verve">
      <rect width="50" height="24" rx="4" fill="#1B3A6B" />
      <text x="5" y="17" fontFamily="Arial" fontWeight="900" fontSize="11" fill="#E8A020" letterSpacing="0.5">Verve</text>
    </svg>
  );
}

function NetworkLogo({ network }) {
  if (network === "visa") return <VisaLogo />;
  if (network === "mastercard") return <MastercardLogo />;
  if (network === "verve") return <VerveLogo />;
  // placeholder slots when no network detected
  return (
    <div className="flex gap-1.5">
      <div className="h-6 w-9 rounded bg-slate-200" />
      <div className="h-6 w-9 rounded bg-slate-200" />
      <div className="h-6 w-9 rounded bg-slate-200" />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
const PaymentPage = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { clearCart } = useCart();

  const [checkoutData, setCheckoutData] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | processing | success | failed
  const [failureReason, setFailureReason] = useState("");
  const isProcessingRef = useRef(false);

  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: profile?.name || user?.name || "",
  });

  const rawDigits = card.number.replace(/\D/g, "");
  const detectedNetwork = detectNetwork(rawDigits);
  const cardMaxLen = maxCardLength(detectedNetwork);

  // Sync cardholder name when profile loads
  useEffect(() => {
    if (profile?.name) setCard((c) => ({ ...c, name: profile.name }));
  }, [profile]);

  useEffect(() => {
    const raw = sessionStorage.getItem("checkoutData");
    if (raw) {
      try { setCheckoutData(JSON.parse(raw)); } catch {}
    }
  }, []);

  if (!checkoutData) {
    return (
      <section className="max-w-5xl mx-auto px-4 py-20">
        <EmptyState
          title="Missing checkout details"
          description="We couldn't find your delivery details. Please start checkout again."
          actionLabel="Return to cart"
          actionTo="/cart"
        />
      </section>
    );
  }

  const { items, totals } = checkoutData;

  /* ── payment handler ─────────────────────────────────────────────────── */
  const handlePayment = async (e) => {
    e.preventDefault();

    // race-condition guard
    if (isProcessingRef.current || status === "processing") return;
    isProcessingRef.current = true;
    setStatus("processing");
    setFailureReason("");

    const orderRef = generateId("OYA");
    const idempotencyKey = `idem_${orderRef}_${Date.now()}_${generateId("r")}`;
    const attemptId = generateId("pay");

    // idempotency check
    const existing = getAttempt(idempotencyKey);
    if (existing) {
      if (existing.status === "succeeded") {
        setStatus("success");
        setTimeout(() => navigate("/order-status", { state: { orderRef: existing.order_ref } }), 1500);
        return;
      }
      if (existing.status === "processing") {
        setStatus("failed");
        setFailureReason("Payment already in progress. Please wait.");
        isProcessingRef.current = false;
        return;
      }
    }

    // create attempt record
    const attempt = {
      id: attemptId,
      idempotency_key: idempotencyKey,
      order_ref: orderRef,
      amount: totals.total,
      status: "processing",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    saveAttempt(idempotencyKey, attempt);

    // simulate 2s payment delay
    await new Promise((r) => setTimeout(r, 2000));

    // 90% success / 10% failure
    const succeeded = Math.random() < 0.9;

    if (!succeeded) {
      const reasons = [
        "Insufficient funds",
        "Card declined by issuer",
        "Transaction limit exceeded",
      ];
      const reason = reasons[Math.floor(Math.random() * reasons.length)];
      saveAttempt(idempotencyKey, { ...attempt, status: "failed", updated_at: new Date().toISOString() });
      setStatus("failed");
      setFailureReason(reason);
      isProcessingRef.current = false;
      return;
    }

    // push to Supabase
    try {
      if (supabaseConfigured && supabase) {
        // resolve user's integer row id from auth_id
        let userRowId = null;
        if (user?.uid) {
          const { data: userRow } = await supabase
            .from("users")
            .select("id")
            .eq("auth_id", user.uid)
            .maybeSingle();
          userRowId = userRow?.id ?? null;
        }

        const orderPayload = {
          user_id: userRowId,
          order_ref: orderRef,
          status: "pending",
          total: totals.total,
          delivery_fee: totals.deliveryFee,
          address: {
            name: checkoutData.name,
            email: checkoutData.email,
            phone: checkoutData.phone,
            address: checkoutData.address,
            apartment: checkoutData.apartment,
            city: checkoutData.city,
            region: checkoutData.region,
            postalCode: checkoutData.postalCode,
            instructions: checkoutData.instructions,
          },
          metadata: { subtotal: totals.subtotal, item_count: items.length },
        };

        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .insert(orderPayload)
          .select()
          .single();

        if (orderError) throw orderError;

        const orderItemsPayload = items.map((item) => ({
          order_id: orderData.id,
          product_id: String(item.id),
          title: item.name,
          price: item.price,
          quantity: item.quantity,
          meta: { category: item.category, unit: item.unit },
        }));

        const { error: itemsError } = await supabase.from("order_items").insert(orderItemsPayload);
        if (itemsError) throw itemsError;
      }

      await clearCart();
      sessionStorage.removeItem("checkoutData");

      saveAttempt(idempotencyKey, { ...attempt, status: "succeeded", order_ref: orderRef, updated_at: new Date().toISOString() });
      setStatus("success");
      setTimeout(() => navigate("/order-status", { state: { orderRef } }), 1500);
    } catch (err) {
      console.error("Order failed:", err);
      saveAttempt(idempotencyKey, { ...attempt, status: "failed", updated_at: new Date().toISOString() });
      setStatus("failed");
      setFailureReason(err?.message || "Unexpected error. Please try again.");
      isProcessingRef.current = false;
    }
  };

  const isProcessing = status === "processing";

  return (
    <>
      {/* overlays */}
      {status === "processing" && <ProcessingOverlay />}
      {status === "success" && <SuccessAnimation />}

      <section className="max-w-7xl mx-auto px-4 py-14">
        {/* step indicator */}
        <div className="rounded-lg border border-oya-teal/10 bg-oya-paper p-5 mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-oya-teal/80">Step 3 of 3</p>
              <p className="mt-2 text-sm text-oya-teal/70">Complete your payment to finalize the order.</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-oya-teal/70">
              <span className="rounded-full border border-oya-teal/10 bg-white px-3 py-1">Cart</span>
              <span className="rounded-full border border-oya-teal/10 bg-white px-3 py-1">Delivery</span>
              <span className="rounded-full bg-oya-teal px-3 py-1 text-white">Payment</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row">
          {/* ── left: payment form ──────────────────────────────────────── */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-oya-teal/70">Checkout</p>
                <h1 className="mt-2 text-3xl font-bold text-oya-teal">Payment details</h1>
                <p className="mt-2 text-sm text-oya-teal/70 max-w-2xl">
                  This is a simulated payment. No real charges will be made.
                </p>
              </div>
              <Link
                to="/checkout"
                className="inline-flex items-center gap-2 text-sm font-semibold text-oya-green hover:text-oya-teal transition-colors"
              >
                <FiArrowLeft className="w-4 h-4" />
                Back
              </Link>
            </div>

            <div className="rounded-lg border border-oya-teal/10 bg-white p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3 text-oya-teal">
                  <FiCreditCard className="w-6 h-6" />
                  <span className="font-semibold text-base">Credit or Debit Card</span>
                </div>
                <div className="transition-all duration-300">
                  <NetworkLogo network={detectedNetwork} />
                </div>
              </div>

              <form onSubmit={handlePayment} className="grid gap-5">
                {/* card number */}
                <label className="block text-sm font-semibold text-oya-teal">
                  Card number
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={card.number}
                      onChange={(e) =>
                        setCard((c) => ({
                          ...c,
                          number: formatCardNumber(e.target.value, detectedNetwork),
                        }))
                      }
                      placeholder={detectedNetwork === "verve" ? "0000 0000 0000 0000 000" : "0000 0000 0000 0000"}
                      maxLength={cardMaxLen + Math.floor(cardMaxLen / 4) - 1}
                      required
                      disabled={isProcessing}
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-16 text-sm text-slate-900 outline-none transition focus:border-oya-green focus:ring-2 focus:ring-oya-green/20 disabled:bg-slate-50"
                    />
                    {detectedNetwork && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <NetworkLogo network={detectedNetwork} />
                      </div>
                    )}
                  </div>
                  {detectedNetwork && (
                    <p className="mt-1.5 text-xs text-oya-green font-medium capitalize">
                      {detectedNetwork === "mastercard" ? "Mastercard" : detectedNetwork.charAt(0).toUpperCase() + detectedNetwork.slice(1)} detected
                    </p>
                  )}
                </label>

                {/* expiry + cvv */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-semibold text-oya-teal">
                    Expiry date
                    <input
                      type="text"
                      inputMode="numeric"
                      value={card.expiry}
                      onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                      disabled={isProcessing}
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-oya-green focus:ring-2 focus:ring-oya-green/20 disabled:bg-slate-50"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-oya-teal">
                    CVV
                    <input
                      type="text"
                      inputMode="numeric"
                      value={card.cvv}
                      onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) }))}
                      placeholder="123"
                      maxLength={3}
                      required
                      disabled={isProcessing}
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-oya-green focus:ring-2 focus:ring-oya-green/20 disabled:bg-slate-50"
                    />
                  </label>
                </div>

                {/* cardholder name */}
                <label className="block text-sm font-semibold text-oya-teal">
                  Cardholder name
                  <input
                    type="text"
                    value={card.name}
                    onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
                    placeholder="Full name on card"
                    required
                    disabled={isProcessing}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-oya-green focus:ring-2 focus:ring-oya-green/20 disabled:bg-slate-50"
                  />
                </label>

                {/* failure message */}
                {status === "failed" && (
                  <div className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    <FiAlertCircle className="mt-0.5 w-4 h-4 shrink-0" />
                    <span>Payment failed: {failureReason}</span>
                  </div>
                )}

                <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
                  <FiLock className="w-3.5 h-3.5" />
                  Payments are encrypted and securely processed.
                </div>

                {/* pay button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full rounded-lg px-5 py-3.5 text-sm font-semibold text-white transition-all ${
                    isProcessing
                      ? "bg-slate-400 cursor-not-allowed opacity-50"
                      : "bg-oya-green hover:bg-oya-teal"
                  }`}
                >
                  {isProcessing ? "Processing payment…" : `Pay ${formatPrice(totals.total)}`}
                </button>
              </form>
            </div>
          </div>

          {/* ── right: order summary ─────────────────────────────────────── */}
          <aside className="space-y-6 lg:w-[360px]">
            <div className="rounded-lg border border-oya-teal/10 bg-white p-6">
              <h2 className="text-lg font-bold text-oya-teal mb-5">Order summary</h2>
              <div className="space-y-3 text-sm text-oya-teal/70 max-h-56 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-2">
                    <span className="truncate">{item.name} × {item.quantity}</span>
                    <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-3 text-sm text-oya-teal/70 border-t border-oya-teal/10 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery fee</span>
                  <span>{formatPrice(totals.deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-oya-teal pt-2 border-t border-oya-teal/10">
                  <span>Total</span>
                  <span>{formatPrice(totals.total)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-oya-green/20 bg-oya-green/5 p-5 text-sm text-oya-teal/70 space-y-2">
              <p className="font-semibold text-oya-teal flex items-center gap-2">
                <FiLock className="w-4 h-4 text-oya-green" /> Secure checkout
              </p>
              <p>Your card details are never stored and this is a simulated payment for demonstration.</p>
            </div>
          </aside>
        </div>
      </section>

      {/* CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-bounceIn { animation: bounceIn 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both; }
      `}</style>
    </>
  );
};

export default PaymentPage;
