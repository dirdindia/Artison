import { Link, useLocation } from "react-router-dom";
import { Home, Compass, ShoppingBag, User, Search, Bell, Settings, LogOut, Package, Instagram, Twitter, Facebook, Mail } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppShell({ children, title }) {
  const { cart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { pathname } = useLocation();
  const cartCount = cart.reduce((n, c) => n + c.qty, 0);

  const tabs = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/explore", icon: Compass, label: "Explore" },
    { to: "/cart", icon: ShoppingBag, label: "Cart" },
    { to: isAuthenticated ? "/profile" : "/login", icon: User, label: isAuthenticated ? "Profile" : "Sign In" }
  ];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background shadow-card md:max-w-none md:shadow-none">
      {/* Mobile header */}
      <header className="sticky top-0 z-30 bg-background/85 px-5 pt-5 pb-3 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <img src="/logo.png" alt="logo" className="h-10 w-10 shrink-0 object-contain mix-blend-multiply" />
            <div className="min-w-0">
              <div className="font-display text-lg font-bold leading-none">कलाkosh</div>
              <div className="truncate text-[10px] uppercase tracking-widest text-muted-foreground">{title ?? "Curated Art"}</div>
            </div>
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <button className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-foreground/70"><Search className="h-4 w-4" /></button>
            <button className="relative grid h-9 w-9 place-items-center rounded-full bg-secondary text-foreground/70">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            </button>
          </div>
        </div>
      </header>

      {/* Desktop header */}
      <header className="sticky top-0 z-30 hidden border-b border-border/60 bg-background/85 backdrop-blur-xl md:block">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-8 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="logo" className="h-12 w-12 object-contain transition-transform hover:scale-110 mix-blend-multiply" />
            <div>
              <div className="font-display text-xl font-bold leading-none">कलाkosh</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Original Art Marketplace</div>
            </div>
          </Link>
          <nav className="flex items-center gap-1">
            {tabs.map((t) => {
              if (t.label === "Profile" || t.label === "Sign In") return null; // Handled below
              const active = pathname === t.to;
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-foreground text-background" : "text-foreground/70 hover:bg-secondary"}`
                  }>
                  {t.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-4">
            <div className="flex w-56 items-center gap-2 rounded-full bg-secondary px-4 py-2 lg:w-72 transition-shadow focus-within:ring-2 focus-within:ring-ring">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input placeholder="Search art, artists…" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            </div>
            
            <Link to="/cart" className="relative grid h-10 w-10 place-items-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 &&
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-sm">
                  {cartCount}
                </span>
              }
            </Link>

            <div className="h-6 w-px bg-border mx-1" />

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus-visible:outline-none rounded-full ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <Avatar className="h-10 w-10 border border-border shadow-sm transition-transform hover:scale-105">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-gradient-warm text-primary-foreground font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors">
                  Sign In
                </Link>
                <Link to="/signup" className="hidden lg:inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background shadow-soft transition hover:scale-[1.02] hover:shadow-md">
                  Join कलाkosh
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pb-28 md:pb-16">
        <div className="md:mx-auto md:w-full md:max-w-7xl md:px-8 md:pt-6">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md border-t border-border bg-background/95 pb-safe-or-2 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-around px-4 py-2">
          {tabs.map((t) => {
            const active = pathname === t.to || (t.label === "Sign In" && pathname === "/login");
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`relative flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-medium transition-colors ${
                active ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground/80"}`
                }>
                
                <div className="relative">
                  {t.label === "Profile" && isAuthenticated ? (
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-gradient-warm text-primary-foreground text-[10px]">
                        {user?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                  {t.to === "/cart" && cartCount > 0 &&
                  <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground ring-2 ring-background">
                      {cartCount}
                    </span>
                  }
                </div>
                <span>{t.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Comprehensive Premium Footer */}
      <footer className="mt-auto border-t border-border/60 bg-card hidden md:block">
        <div className="mx-auto w-full max-w-7xl px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* SubCategory & Newsletter */}
            <div className="col-span-1 md:col-span-1 lg:col-span-1 space-y-4">
              <Link to="/" className="flex items-center gap-2.5">
                <img src="/logo.png" alt="logo" className="h-14 w-14 object-contain mix-blend-multiply" />
                <span className="font-display text-xl font-bold">कलाkosh</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The premier destination for discovering, collecting, and selling extraordinary original artwork.
              </p>
              <form className="mt-4 flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
                <label className="text-xs font-semibold uppercase tracking-wider text-foreground">Subscribe to our newsletter</label>
                <div className="flex gap-2">
                  <input type="email" placeholder="Email address" className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                  <button className="rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-background hover:bg-foreground/90 transition-colors">Join</button>
                </div>
              </form>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Explore</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link to="/explore" className="hover:text-primary transition-colors">All Artworks</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors">Featured Artists</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">New Arrivals</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Exhibitions</a></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Support</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Shipping & Delivery</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Returns & Refunds</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              </ul>
            </div>

            {/* Social & Legal */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Connect</h3>
              <div className="flex items-center gap-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Mail className="h-5 w-5" /></a>
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} कलाkosh Inc. All rights reserved.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
