import { useState } from "react";
import { SlidersHorizontal, Search } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { products, categories } from "@/data/products";

export default function Explore() {
  const [active, setActive] = useState("All");
  const [q, setQ] = useState("");

  const filtered = products.filter(
    (p) =>
    (active === "All" || p.category === active) && (
    q === "" || p.title.toLowerCase().includes(q.toLowerCase()) || p.artist.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <AppShell title="Explore">
      <div className="px-5">
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-2xl bg-card px-3 py-2.5 shadow-soft">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search art, artists…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            
          </div>
          <button className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-foreground text-background shadow-soft">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {["All", ...categories.map((c) => c.name)].map((c) =>
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition ${
            active === c ? "bg-primary text-primary-foreground shadow-soft" : "bg-card text-foreground/70"}`
            }>
            
              {c}
            </button>
          )}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">{filtered.length} artworks</p>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-5 lg:grid-cols-5">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        {filtered.length === 0 &&
        <div className="mt-12 text-center text-sm text-muted-foreground">No artworks match your search.</div>
        }
      </div>
    </AppShell>);

}