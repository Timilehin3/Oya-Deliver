import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { FiPackage, FiCalendar, FiClock, FiCheckCircle, FiChevronRight } from "react-icons/fi";
import supabase, { supabaseConfigured } from "../supabase/client";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../utils/formatPrice";
import EmptyState from "../components/ui/EmptyState";

const OrderHistoryPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchOrders = async () => {
      if (!user?.uid || !supabaseConfigured) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        // Fetch the user's integer ID from the users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id")
          .eq("auth_id", user.uid)
          .maybeSingle();

        if (userError) throw userError;
        
        if (!userData) {
          if (mounted) {
            setOrders([]);
            setLoading(false);
          }
          return;
        }

        // Fetch orders and their nested order_items
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select(`
            *,
            order_items (*)
          `)
          .eq("user_id", userData.id)
          .order("created_at", { ascending: false });

        if (ordersError) throw ordersError;

        if (mounted) {
          setOrders(ordersData || []);
        }
      } catch (err) {
        console.error("Failed to fetch order history:", err);
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (!authLoading) {
      fetchOrders();
    }

    return () => {
      mounted = false;
    };
  }, [user, authLoading]);

  // Handle unauthenticated state
  if (!authLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  // Format date helper
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Status styling helper
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return { color: "text-oya-green", bg: "bg-oya-green/10", icon: FiCheckCircle };
      case "pending":
      case "processing":
        return { color: "text-amber-600", bg: "bg-amber-100", icon: FiClock };
      default:
        return { color: "text-slate-600", bg: "bg-slate-100", icon: FiPackage };
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-14">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-oya-teal">Order History</h1>
        <p className="mt-2 text-sm text-oya-teal/70">
          View and track all your past grocery orders.
        </p>
      </div>

      {loading || authLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex flex-col sm:flex-row gap-4 p-6 bg-oya-paper rounded-xl border border-oya-teal/10">
              <div className="flex-1 space-y-3">
                <div className="h-5 w-32 bg-slate-200 rounded"></div>
                <div className="h-4 w-48 bg-slate-200 rounded"></div>
              </div>
              <div className="h-10 w-24 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-rose-700">
          <p className="font-semibold">Failed to load order history</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="You haven't placed any grocery orders with us yet."
          actionLabel="Start shopping"
          actionTo="/"
        />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status || "pending");
            const StatusIcon = statusConfig.icon;
            const itemsSummary = order.order_items
              ?.slice(0, 3)
              .map((item) => `${item.title} (x${item.quantity})`)
              .join(", ");
            const hasMoreItems = order.order_items?.length > 3;

            return (
              <div
                key={order.id}
                className="bg-white border border-oya-teal/10 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-lg font-bold text-oya-teal">
                        Order #{order.order_ref}
                      </h2>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusConfig.bg} ${statusConfig.color}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {order.status || "Pending"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-oya-teal/60">
                      <div className="flex items-center gap-1.5">
                        <FiCalendar className="w-4 h-4" />
                        {formatDate(order.created_at)}
                      </div>
                      <div className="font-semibold text-oya-teal">
                        {formatPrice(order.total)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Future-proofing for order details page / modal */}
                  <button className="inline-flex items-center gap-1 text-sm font-semibold text-oya-green hover:text-oya-teal transition-colors">
                    View Details
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-4 border-t border-oya-teal/5">
                  <p className="text-sm text-oya-teal/80 line-clamp-2">
                    <span className="font-semibold">Items:</span> {itemsSummary}
                    {hasMoreItems && " ...and more"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default OrderHistoryPage;
