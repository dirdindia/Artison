import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import api from "@/api";

export default function Explore() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const categoryName = searchParams.get("categoryName");

  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 10;

  useEffect(() => {
    // reset page on filter change
    setPage(1);
  }, [categoryId, q]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/products?page=${page}&limit=${limit}`;
        if (categoryId) url += `&category=${categoryId}`;
        if (q) url += `&search=${q}`;
        
        const res = await api.get(url);
        if (res.data && res.data.data) {
          // Map backend schema to what ProductCard expects
          const formattedProducts = res.data.data.map(p => ({
            id: p._id,
            title: p.name,
            artist: p.brand ? p.brand.name : "Unknown Artist",
            price: p.price,
            image: p.image || "https://placehold.co/400x500",
            category: p.category ? p.category.name : "Art"
          }));
          setProducts(formattedProducts);
          if (res.data.pagination) {
            setTotalPages(res.data.pagination.totalPages);
          }
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    
    // add small debounce for search
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [page, categoryId, q]);

  return (
    <AppShell title={categoryName ? `Explore ${categoryName}` : "Explore"}>
      <div className="px-5">
        {categoryName && (
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent p-6 border-l-4 border-primary">
            <h1 className="font-display text-3xl font-bold">{categoryName}</h1>
            <p className="mt-1 text-muted-foreground">Discover exquisite products in this category.</p>
          </div>
        )}

        <div className="flex items-center gap-2 mb-6">
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

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading products...</div>
        ) : (
          <>
            <p className="mt-4 text-xs text-muted-foreground mb-3">{products.length} artworks on this page</p>

            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-5 lg:grid-cols-5">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
            {products.length === 0 && (
              <div className="mt-12 text-center text-sm text-muted-foreground">No artworks found.</div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-4 pb-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 rounded-full bg-card px-4 py-2 text-sm font-medium shadow-soft transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                <span className="text-sm font-medium text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 rounded-full bg-card px-4 py-2 text-sm font-medium shadow-soft transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}