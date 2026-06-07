import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiClock, 
  FiMapPin, 
  FiArrowLeft,
  FiShoppingBag
} from "react-icons/fi";
import supabase, { supabaseConfigured } from "../supabase/client";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../utils/formatPrice";

const TrackingPage = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchOrderDetails = async () => {
      if (!supabaseConfigured || !orderId) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from("orders")
          .select(`
            *,
            order_items (*)
          `)
          .eq("order_ref", orderId)
          .maybeSingle();

        if (fetchError) throw fetchError;
        
        if (!data) {
          throw new Error("Order not found or you don't have permission to view it.");
        }

        if (mounted) {
          setOrder(data);
        }
      } catch (err) {
        console.error("Tracking Error:", err);
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOrderDetails();

    return () => {
      mounted = false;
    };
  }, [orderId]);

  // Timeline configuration
  const timelineSteps = [
    { id: "pending", label: "Order Placed", icon: FiPackage },
    { id: "processing", label: "Processing", icon: FiClock },
    { id: "out for delivery", label: "Out for Delivery", icon: FiTruck },
    { id: "delivered", label: "Delivered", icon: FiCheckCircle },
  ];

  // Helper to determine step completion
  const getStepStatus = (stepId, currentStatus) => {
    const statusOrder = ["pending", "processing", "out for delivery", "delivered"];
    const currentIndex = statusOrder.indexOf(currentStatus?.toLowerCase() || "pending");
    const stepIndex = statusOrder.indexOf(stepId);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  // Render Loader
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded"></div>
        <div className="h-48 w-full bg-oya-paper rounded-2xl border border-slate-100"></div>
        <div className="h-32 w-full bg-oya-paper rounded-2xl border border-slate-100"></div>
      </div>
    );
  }

  // Render Error
  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 text-rose-500 mb-6">
          <FiPackage className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Order Not Found</h1>
        <p className="text-slate-500 mb-8">{error || "We couldn't locate this order."}</p>
        <Link 
          to="/history"
          className="inline-flex items-center gap-2 text-oya-green font-semibold hover:text-oya-teal"
        >
          <FiArrowLeft /> Back to Order History
        </Link>
      </div>
    );
  }

  const currentStatus = order.status || "pending";

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Navigation */}
        <Link 
          to="/history"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-oya-teal transition-colors mb-6"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Order History
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-oya-teal">Tracking Order #{order.order_ref}</h1>
          <p className="text-slate-500 text-sm mt-1">
            Placed on {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(order.created_at))}
          </p>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white rounded-2xl border border-oya-teal/10 p-6 sm:p-8 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-oya-teal mb-8">Delivery Status</h2>
          
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-5 left-6 sm:left-[50%] sm:-translate-x-1/2 w-0.5 h-[calc(100%-2.5rem)] sm:w-[calc(100%-4rem)] sm:h-0.5 bg-slate-100 -z-10"></div>
            
            <div className="flex flex-col sm:flex-row justify-between gap-8 sm:gap-4 relative z-10">
              {timelineSteps.map((step) => {
                const status = getStepStatus(step.id, currentStatus);
                const StepIcon = step.icon;
                
                return (
                  <div key={step.id} className="flex sm:flex-col items-center gap-4 sm:gap-3 text-left sm:text-center flex-1">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shrink-0 transition-colors ${
                        status === "completed" ? "bg-oya-green text-white" :
                        status === "current" ? "bg-oya-teal text-white ring-4 ring-oya-teal/10" :
                        "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <StepIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`font-semibold text-sm ${status === "upcoming" ? "text-slate-400" : "text-slate-800"}`}>
                        {step.label}
                      </div>
                      {status === "current" && (
                        <div className="text-xs text-oya-green font-medium mt-0.5">Current Status</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Delivery Details */}
          <div className="bg-white rounded-2xl border border-oya-teal/10 p-6 shadow-sm">
            <h3 className="flex items-center gap-2 font-bold text-oya-teal mb-4">
              <FiMapPin className="text-oya-green" /> Delivery Details
            </h3>
            {order.address ? (
              <div className="text-sm text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">{order.address.fullName || "Customer"}</p>
                <p>{order.address.street}</p>
                <p>{order.address.city}, {order.address.state} {order.address.zipCode}</p>
                <p className="pt-2 text-slate-500">{order.address.phone}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Address details unavailable.</p>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl border border-oya-teal/10 p-6 shadow-sm">
            <h3 className="flex items-center gap-2 font-bold text-oya-teal mb-4">
              <FiShoppingBag className="text-oya-green" /> Order Summary
            </h3>
            
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div className="flex gap-2 text-slate-600">
                    <span className="font-medium">{item.quantity}x</span>
                    <span className="line-clamp-1">{item.title}</span>
                  </div>
                  <div className="text-slate-800 font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>{formatPrice(order.total - (order.delivery_fee || 0))}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery Fee</span>
                <span>{formatPrice(order.delivery_fee || 0)}</span>
              </div>
              <div className="flex justify-between font-bold text-oya-teal pt-2">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrackingPage;
