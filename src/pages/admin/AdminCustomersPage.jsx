import React, { useState, useEffect } from "react";
import { FiMail, FiPhone, FiCalendar, FiShoppingBag } from "react-icons/fi";
import toast from "react-hot-toast";
import supabase from "../../supabase/client";
import { formatPrice } from "../../utils/formatPrice";

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        setLoading(true);
        // Fetch all users
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (usersError) throw usersError;

        // Fetch all orders to map order counts and total spent
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("user_id, total");
          
        if (ordersError) throw ordersError;

        // Combine data
        const enrichedCustomers = (usersData || []).map(user => {
          const userOrders = (ordersData || []).filter(o => o.user_id === user.id);
          const totalSpent = userOrders.reduce((sum, order) => sum + (order.total || 0), 0);
          return {
            ...user,
            orderCount: userOrders.length,
            totalSpent
          };
        });

        setCustomers(enrichedCustomers);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
        toast.error("Failed to load customers.");
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-oya-teal">Customers</h1>
        <p className="mt-1 text-sm text-oya-teal/60">View registered customers and their purchase history.</p>
      </div>

      <div className="rounded-xl border border-oya-teal/10 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-oya-teal">
            <thead className="bg-oya-teal/5 text-oya-teal/70 border-b border-oya-teal/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Contact</th>
                <th className="px-6 py-4 font-semibold text-center">Orders</th>
                <th className="px-6 py-4 font-semibold text-right">Total Spent</th>
                <th className="px-6 py-4 font-semibold text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-oya-teal/10">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-oya-teal/60">Loading customers...</td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-oya-teal/60">No customers found. (Users will appear here once they register and the auth trigger is active)</td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-oya-teal/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-oya-teal">{customer.name || customer.full_name || "Unknown"}</div>
                      {customer.role === 'admin' && (
                        <span className="mt-1 inline-block rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-700">
                          Admin
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-oya-teal/80">
                        <FiMail className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{customer.email || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-oya-teal/60 mt-1">
                        <FiPhone className="w-3.5 h-3.5 shrink-0" />
                        <span>{customer.phone || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-oya-teal/5 px-3 py-1 text-sm font-semibold text-oya-teal">
                        <FiShoppingBag className="w-4 h-4 text-oya-teal/50" />
                        {customer.orderCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold">
                      {formatPrice(customer.totalSpent)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-oya-teal/70">
                        <FiCalendar className="w-3.5 h-3.5 shrink-0" />
                        <span>{new Date(customer.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomersPage;
