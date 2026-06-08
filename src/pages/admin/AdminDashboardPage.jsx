import React, { useEffect, useState } from "react";
import { FiDollarSign, FiShoppingBag, FiUsers, FiAlertCircle } from "react-icons/fi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import supabase from "../../supabase/client";
import { formatPrice } from "../../utils/formatPrice";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    activeOrders: 0,
    totalCustomers: 0,
    lowStockCount: 0,
  });
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

        // Fetch Orders
        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select("total, created_at, status");
        
        if (ordersError) throw ordersError;

        // Fetch Users
        const { count: usersCount, error: usersError } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true });
        
        if (usersError) throw usersError;

        // Fetch Low Stock Products
        const { count: lowStockCount, error: productsError } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .lte("stock_quantity", 10);
        
        if (productsError) throw productsError;

        // Process Stats
        const validOrders = orders || [];
        const totalSales = validOrders.reduce((sum, order) => sum + (order.total || 0), 0);
        const activeOrders = validOrders.filter(o => o.status === "pending" || o.status === "processing").length;

        setStats({
          totalSales,
          activeOrders,
          totalCustomers: usersCount || 0,
          lowStockCount: lowStockCount || 0,
        });

        // Process Chart Data (Sales over last 7 days)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d.toISOString().split("T")[0];
        });

        const chartData = last7Days.map(date => {
          const dayOrders = validOrders.filter(o => o.created_at?.startsWith(date));
          const dayTotal = dayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
          return {
            name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            sales: dayTotal
          };
        });

        // If no real data, show a flat chart rather than crashing or showing nothing
        setSalesData(chartData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-oya-teal border-t-oya-green"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Sales",
      value: formatPrice(stats.totalSales),
      icon: <FiDollarSign className="w-6 h-6" />,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Active Orders",
      value: stats.activeOrders.toString(),
      icon: <FiShoppingBag className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers.toString(),
      icon: <FiUsers className="w-6 h-6" />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockCount.toString(),
      icon: <FiAlertCircle className="w-6 h-6" />,
      color: "bg-rose-100 text-rose-600",
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-oya-teal">Dashboard</h1>
        <p className="mt-1 text-sm text-oya-teal/60">Overview of your store's performance.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className="rounded-xl border border-oya-teal/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-oya-teal/60">{stat.title}</p>
                <p className="mt-2 text-3xl font-bold text-oya-teal">{stat.value}</p>
              </div>
              <div className={`rounded-lg p-3 ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="rounded-xl border border-oya-teal/10 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-oya-teal mb-6">Revenue Overview (Last 7 Days)</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ba360" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ba360" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [formatPrice(value), "Sales"]}
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#0ba360" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorSales)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
