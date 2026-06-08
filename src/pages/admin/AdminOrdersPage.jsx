import React, { useState, useEffect } from "react";
import { FiEye, FiCheck, FiX, FiClock, FiTruck, FiPackage } from "react-icons/fi";
import toast from "react-hot-toast";
import supabase from "../../supabase/client";
import { formatPrice } from "../../utils/formatPrice";
import Modal from "../../components/ui/Modal";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  async function fetchOrders() {
    setLoading(true);
    try {
      let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
      
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStatus(orderId, newStatus) {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);
      
      if (error) throw error;
      toast.success(`Order marked as ${newStatus}`);
      
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update order status.");
    }
  }

  async function handleViewDetails(order) {
    setSelectedOrder(order);
    setIsModalOpen(true);
    setItemsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", order.id);
        
      if (error) throw error;
      setOrderItems(data || []);
    } catch (err) {
      console.error("Failed to load items:", err);
      toast.error("Failed to load order items.");
    } finally {
      setItemsLoading(false);
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700"><FiClock className="w-3 h-3" /> Pending</span>;
      case "processing":
        return <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700"><FiPackage className="w-3 h-3" /> Processing</span>;
      case "shipped":
        return <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700"><FiTruck className="w-3 h-3" /> Shipped</span>;
      case "delivered":
        return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700"><FiCheck className="w-3 h-3" /> Delivered</span>;
      case "cancelled":
        return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700"><FiX className="w-3 h-3" /> Cancelled</span>;
      default:
        return <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-oya-teal">Orders Management</h1>
          <p className="text-sm text-oya-teal/60">View and update customer orders.</p>
        </div>
        
        <div className="flex gap-2">
          {["all", "pending", "processing", "shipped", "delivered"].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? "bg-oya-teal text-white"
                  : "bg-white border border-oya-teal/10 text-oya-teal hover:bg-oya-teal/5"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-oya-teal/10 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-oya-teal">
            <thead className="bg-oya-teal/5 text-oya-teal/70 border-b border-oya-teal/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Order Ref</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-oya-teal/10">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-oya-teal/60">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-oya-teal/60">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-oya-teal/5 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-oya-teal">{order.order_ref}</td>
                    <td className="px-6 py-4 text-oya-teal/70">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-oya-teal/80">
                      {order.address?.name || "N/A"}<br/>
                      <span className="text-xs text-oya-teal/50">{order.address?.email || "N/A"}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="inline-flex items-center gap-1 rounded bg-oya-teal/5 px-2 py-1 text-xs font-semibold text-oya-teal hover:bg-oya-teal/10 transition"
                      >
                        <FiEye className="w-3 h-3" /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Order Details">
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-oya-teal/60 uppercase tracking-wider">Order Ref</h3>
                <p className="mt-1 font-mono text-oya-teal">{selectedOrder.order_ref}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-oya-teal/60 uppercase tracking-wider">Status</h3>
                <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-oya-teal/60 uppercase tracking-wider">Customer</h3>
                <p className="mt-1 text-oya-teal">{selectedOrder.address?.name}</p>
                <p className="text-xs text-oya-teal/70">{selectedOrder.address?.phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-oya-teal/60 uppercase tracking-wider">Address</h3>
                <p className="mt-1 text-sm text-oya-teal">
                  {selectedOrder.address?.address}, {selectedOrder.address?.city}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-oya-teal/60 uppercase tracking-wider mb-2">Order Items</h3>
              {itemsLoading ? (
                <div className="text-sm text-oya-teal/60 text-center py-4">Loading items...</div>
              ) : (
                <div className="border border-oya-teal/10 rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left text-oya-teal">
                    <thead className="bg-oya-teal/5">
                      <tr>
                        <th className="px-4 py-2 font-semibold">Item</th>
                        <th className="px-4 py-2 font-semibold text-center">Qty</th>
                        <th className="px-4 py-2 font-semibold text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-oya-teal/10">
                      {orderItems.map(item => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">{item.title}</td>
                          <td className="px-4 py-3 text-center">{item.quantity}</td>
                          <td className="px-4 py-3 text-right">{formatPrice(item.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-oya-teal/10 flex justify-end gap-2">
              {selectedOrder.status === "pending" && (
                <button onClick={() => handleUpdateStatus(selectedOrder.id, "processing")} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Mark Processing</button>
              )}
              {selectedOrder.status === "processing" && (
                <button onClick={() => handleUpdateStatus(selectedOrder.id, "shipped")} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium">Mark Shipped</button>
              )}
              {selectedOrder.status === "shipped" && (
                <button onClick={() => handleUpdateStatus(selectedOrder.id, "delivered")} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium">Mark Delivered</button>
              )}
              {selectedOrder.status !== "cancelled" && selectedOrder.status !== "delivered" && (
                <button onClick={() => handleUpdateStatus(selectedOrder.id, "cancelled")} className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium">Cancel Order</button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrdersPage;
