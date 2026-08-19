import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, Image as ImageIcon, ShoppingBag, DollarSign, Settings, LogOut, Menu, X, Paintbrush, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ArtistLayout() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { name: "Dashboard", path: "/artist/dashboard", icon: LayoutDashboard },
    { name: "My Artworks", path: "/artist/artworks", icon: ImageIcon },
    { name: "Orders", path: "/artist/orders", icon: ShoppingBag },
    { name: "Earnings", path: "/artist/earnings", icon: DollarSign },
    { name: "Settings", path: "/artist/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-canvas overflow-hidden relative">
      {/* Sidebar Wrapper for Desktop */}
      <div 
        className={`
          hidden md:block z-50 h-full shrink-0 bg-background border-border overflow-hidden
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-0 border-r-0' : 'w-64 border-r'}
        `}
      >
        <aside className="flex flex-col w-64 bg-background h-full shrink-0">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <Paintbrush className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg leading-none">Creator Studio</h2>
            <p className="text-xs text-muted-foreground mt-1">by Kalakosh</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-border shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-muted-foreground">{user?.name?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
        </aside>
      </div>

      {/* Toggle button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-5 z-50 hidden md:flex items-center justify-center w-8 h-8 bg-background border border-border rounded-full shadow-sm text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300 ease-in-out cursor-pointer"
        style={{ 
          left: isCollapsed ? '0px' : '16rem', 
          transform: isCollapsed ? 'translateX(0.5rem)' : 'translateX(-50%)' 
        }}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Mobile Header & Sidebar Overlay */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-20 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <Paintbrush className="w-4 h-4" />
          </div>
          <h2 className="font-display font-bold text-lg">Studio</h2>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-foreground">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-10 bg-background pt-16 flex flex-col h-[100dvh]">
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-4 rounded-xl text-base font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
          <div className="p-6 border-t border-border">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-3 px-4 py-4 w-full rounded-xl text-base font-medium bg-red-50 text-red-600 transition-all cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto pt-16 md:pt-0">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
