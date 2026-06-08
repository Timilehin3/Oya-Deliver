import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import React, { Suspense, lazy } from "react";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import Loader from "./components/ui/Loader";

import AdminRoute from "./components/layout/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";

// Route-level code-splitting
const LandingPage = lazy(() => import("./pages/LandingPage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const OrderStatusPage = lazy(() => import("./pages/OrderStatusPage"));
const TrackingPage = lazy(() => import("./pages/TrackingPage"));
const OrderHistoryPage = lazy(() => import("./pages/OrderHistoryPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const AdminCatalogPage = lazy(() => import("./pages/admin/AdminCatalogPage"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const AdminOrdersPage = lazy(() => import("./pages/admin/AdminOrdersPage"));
const Error404Page = lazy(() => import("./pages/Error404Page"));

function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1e3a4d",
            color: "#faf8f5",
          },
        }}
      />
      <Suspense fallback={<Loader fullScreen={false} />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />

            <Route
              path="cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="payment"
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="order-status/:orderId"
              element={
                <ProtectedRoute>
                  <OrderStatusPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="tracking/:orderId"
              element={
                <ProtectedRoute>
                  <TrackingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="history"
              element={
                <ProtectedRoute>
                  <OrderHistoryPage />
                </ProtectedRoute>
              }
            />

            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <UserProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Admin Nested Routes */}
            <Route
              path="admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Navigate to="/admin/catalog" replace />} />
              <Route path="catalog" element={<AdminCatalogPage />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="customers" element={<div className="text-oya-teal p-4 font-semibold">Customers (Under Construction)</div>} />
              <Route path="settings" element={<div className="text-oya-teal p-4 font-semibold">Settings (Under Construction)</div>} />
            </Route>

            <Route path="*" element={<Error404Page />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
