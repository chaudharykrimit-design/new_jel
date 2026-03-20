import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import {
  LayoutDashboard, Package, ShoppingCart, Users, MessageSquare, Settings, LogOut, ChevronLeft, Gem
} from "lucide-react";

const nav = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { to: "/admin/customers", icon: Users, label: "Customers" },
  { to: "/admin/messages", icon: MessageSquare, label: "Messages" },
  { to: "/admin/reviews", icon: MessageSquare, label: "Reviews" },
  { to: "/admin/videos", icon: LayoutDashboard, label: "Videos" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

const AdminLayout = () => {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) navigate("/login");
  }, [user, isAdmin, isLoading, navigate]);

  if (isLoading || !user || !isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-secondary-foreground flex flex-col fixed inset-y-0 left-0 z-40">
        <div className="p-5 border-b border-muted-foreground/10">
          <div className="flex items-center gap-2">
            <Gem className="w-5 h-5 text-primary" />
            <span className="font-display text-lg">
              <span className="gold-text font-bold">AURUM</span>
              <span className="font-light ml-1 text-sm">ADMIN</span>
            </span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {nav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-xs tracking-wider uppercase font-body transition-colors rounded-sm ${
                  isActive ? "bg-primary/20 text-primary font-semibold" : "text-secondary-foreground/60 hover:text-secondary-foreground hover:bg-noir-light/30"
                }`
              }
            >
              <item.icon className="w-4 h-4" /> {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-muted-foreground/10">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-3 py-2.5 w-full text-xs tracking-wider uppercase font-body text-secondary-foreground/60 hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> View Store
          </button>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="flex items-center gap-2 px-3 py-2.5 w-full text-xs tracking-wider uppercase font-body text-secondary-foreground/60 hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64">
        <header className="bg-background border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div /> {/* spacer */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-body font-semibold text-foreground">{user.name}</p>
              <p className="text-[10px] text-muted-foreground font-body">{user.email}</p>
            </div>
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-xs font-body font-semibold text-primary">{user.name[0]}</span>
            </div>
          </div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
