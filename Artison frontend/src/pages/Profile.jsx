import { Settings, Palette, Heart, Package, LogOut, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { products } from "@/data/products";

export default function Profile() {
  const myWorks = products.slice(0, 3);

  return (
    <AppShell title="Profile">
      <div className="px-5">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-warm p-5 text-primary-foreground shadow-card">
          <div className="absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-gold/30 blur-2xl" />
          <div className="flex items-center gap-3">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=70" alt="You" className="h-16 w-16 shrink-0 rounded-full object-cover ring-4 ring-background/30" />
            <div className="min-w-0">
              <div className="truncate font-display text-xl font-bold">Ananya Verma</div>
              <div className="truncate text-xs text-primary-foreground/85">Painter · Mumbai, IN</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <Stat n="24" l="Works" />
            <Stat n="12.4k" l="Followers" />
            <Stat n="₹4.2L" l="Earned" />
          </div>
        </div>

        <button className="mt-5 w-full rounded-2xl bg-foreground py-3 text-sm font-semibold text-background shadow-soft">
          + Upload new artwork
        </button>

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">My listings</h3>
            <button className="text-xs font-medium text-primary">Manage</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {myWorks.map((p) =>
            <div key={p.id} className="aspect-square overflow-hidden rounded-xl bg-canvas shadow-soft">
                <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-1.5">
          <MenuItem icon={Palette} label="My artworks" />
          <MenuItem icon={Package} label="Orders" />
          <MenuItem icon={Heart} label="Saved" />
          <MenuItem icon={Settings} label="Settings" />
          <MenuItem icon={LogOut} label="Sign out" danger />
        </div>
      </div>
    </AppShell>);

}

function Stat({ n, l }) {
  return (
    <div className="rounded-xl bg-background/15 px-2 py-2 backdrop-blur">
      <div className="font-display text-base font-bold">{n}</div>
      <div className="text-[10px] uppercase tracking-wider text-primary-foreground/80">{l}</div>
    </div>);

}

function MenuItem({ icon: Icon, label, danger }) {
  return (
    <button className="flex w-full items-center gap-3 rounded-2xl bg-card p-3 text-left shadow-soft transition hover:bg-accent">
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${danger ? "bg-destructive/10 text-destructive" : "bg-accent text-accent-foreground"}`}>
        <Icon className="h-4 w-4" />
      </div>
      <span className={`flex-1 text-sm font-medium ${danger ? "text-destructive" : ""}`}>{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>);

}