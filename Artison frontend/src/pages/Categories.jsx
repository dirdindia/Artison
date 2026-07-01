import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import api from "@/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 12;

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/categories?page=${page}&limit=${limit}`);
        if (res.data && res.data.data) {
          setCategories(res.data.data);
          if (res.data.pagination) {
            setTotalPages(res.data.pagination.totalPages);
          }
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [page]);

  return (
    <AppShell title="All Categories">
      <div className="px-5 py-6 md:px-0">
        <h1 className="font-display text-3xl font-bold mb-6 text-center">All Categories</h1>
        
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((c) => (
                <Link
                  key={c._id || c.name}
                  to={`/explore?category=${c._id}&categoryName=${encodeURIComponent(c.name)}`}
                  className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-card p-6 text-center shadow-soft transition-all duration-300 hover:bg-accent hover:-translate-y-1 hover:shadow-lg"
                >
                  {c.image ? (
                    <img src={c.image} alt={c.name} className="h-16 w-16 md:h-20 md:w-20 object-cover rounded-full shadow-sm" />
                  ) : (
                    <span className="text-4xl md:text-5xl">🎨</span>
                  )}
                  <span className="font-medium text-sm md:text-base">{c.name}</span>
                </Link>
              ))}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-4">
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
