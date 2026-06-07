import { useLocation, Link, Navigate } from "react-router-dom";
import { FiCheckCircle, FiArrowRight, FiPackage } from "react-icons/fi";

const OrderStatusPage = () => {
  const location = useLocation();
  const { orderRef } = location.state || {};

  if (!orderRef) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-oya-green/10 rounded-full flex items-center justify-center text-oya-green">
          <FiCheckCircle className="w-10 h-10" />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-oya-teal mb-4">
        Payment Successful!
      </h1>
      
      <p className="text-oya-teal/70 mb-8 max-w-md mx-auto">
        Thank you for your order. We are preparing your fresh groceries for delivery. 
        You will receive an email confirmation shortly.
      </p>

      <div className="bg-oya-paper border border-oya-teal/10 rounded-xl p-6 mb-8 inline-block text-left w-full max-w-sm">
        <p className="text-sm font-semibold text-oya-teal/70 uppercase tracking-wider mb-1">
          Order Reference
        </p>
        <p className="text-xl font-bold text-oya-teal flex items-center gap-2">
          <FiPackage className="text-oya-green" />
          {orderRef}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/order-history"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border border-oya-teal/20 rounded-lg text-sm font-semibold text-oya-teal hover:bg-oya-teal/5 transition-colors"
        >
          View Order History
        </Link>
        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-oya-green text-white rounded-lg text-sm font-semibold hover:bg-oya-teal transition-colors"
        >
          Continue Shopping
          <FiArrowRight />
        </Link>
      </div>
    </section>
  );
};

export default OrderStatusPage;
