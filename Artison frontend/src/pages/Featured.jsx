import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import api from "@/api";

export default function Featured() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products?tags=Featured&limit=${limit}&page=${page}`);
        if (res.data?.success && res.data.data) {
          setProducts(res.data.data);
          if (res.data.pagination) {
            setTotalPages(res.data.pagination.totalPages);
          }
        }
      } catch (error) {
        console.error("Error fetching featured products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, [page]);

  return (
    <AppShell title="Featured Works">
      <div className="px-5 py-6 max-w-7xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Link to="/" className="grid h-10 w-10 place-items-center rounded-full bg-card shadow-soft hover:bg-accent transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-display text-3xl font-bold">Featured Works</h1>
            <p className="text-muted-foreground mt-1">Hand-picked selections from our curators.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
             <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
              {products.map((p) => <ProductCard key={p._id || p.id} product={p} />)}
            </div>

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
