import { NavLink, Outlet } from "react-router-dom";
import { FiBox, FiList, FiUsers, FiSettings, FiGrid } from "react-icons/fi";

const AdminLayout = () => {
  const navItems = [
    { name: "Dashboard", to: "/admin/dashboard", icon: FiGrid },
    { name: "Catalog", to: "/admin/catalog", icon: FiBox },
    { name: "Orders", to: "/admin/orders", icon: FiList },
    { name: "Customers", to: "/admin/customers", icon: FiUsers },
    { name: "Settings", to: "/admin/settings", icon: FiSettings },
  ];

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-oya-paper/50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-oya-teal/10 bg-white hidden md:block">
        <div className="p-6">
          <h2 className="text-xs font-bold text-oya-teal/50 uppercase tracking-wider mb-4">
            Admin Panel
          </h2>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-oya-green/10 text-oya-green"
                      : "text-oya-teal/70 hover:bg-oya-teal/5 hover:text-oya-teal"
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
