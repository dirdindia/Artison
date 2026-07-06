import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import api from "@/api";

export default function Explore() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const categoryName = searchParams.get("categoryName");
  const subCategoryId = searchParams.get("subCategory");
  const subCategoryName = searchParams.get("subCategoryName");

  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Filter States
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  
  const [selectedCategories, setSelectedCategories] = useState(categoryId ? [categoryId] : []);
  const [selectedSubCategories, setSelectedSubCategories] = useState(subCategoryId ? [subCategoryId] : []);
  
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  
  // On desktop open by default, on mobile closed by default
  const [showFilters, setShowFilters] = useState(window.innerWidth >= 768);

  const limit = 12; // Adjusted for better grid fit

  // Fetch filter options
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catRes, subCatRes] = await Promise.all([
          api.get('/categories?limit=100'),
          api.get('/subcategories?limit=500')
        ]);
        if (catRes.data.success) setCategories(catRes.data.data);
        if (subCatRes.data.success) setSubCategories(subCatRes.data.data);
      } catch (err) {
        console.error("Failed to fetch filters", err);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    // reset page on filter change
    setPage(1);
  }, [selectedCategories, selectedSubCategories, minPrice, maxPrice, q]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/products?page=${page}&limit=${limit}`;
        if (selectedCategories.length > 0) url += `&category=${selectedCategories.join(',')}`;
        if (selectedSubCategories.length > 0) url += `&subCategory=${selectedSubCategories.join(',')}`;
        if (q) url += `&search=${q}`;
        if (minPrice) url += `&minPrice=${minPrice}`;
        if (maxPrice) url += `&maxPrice=${maxPrice}`;
        
        const res = await api.get(url);
        if (res.data && res.data.data) {
          const formattedProducts = res.data.data.map(p => ({
            id: p._id,
            title: p.name,
            artist: p.subCategory ? p.subCategory.name : "Unknown Artist",
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
    
    const timer = setTimeout(() => {
      fetchProducts();
    }, 400);
    
    return () => clearTimeout(timer);
  }, [page, selectedCategories, selectedSubCategories, minPrice, maxPrice, q]);

  const toggleCategory = (id) => {
    setSelectedCategories(prev => {
      const isChecked = prev.includes(id);
      if (isChecked) {
        // If unchecking category, also uncheck its subcategories
        const subCatsToRemove = subCategories.filter(sc => sc.category?._id === id || sc.category === id).map(sc => sc._id);
        setSelectedSubCategories(subPrev => subPrev.filter(scId => !subCatsToRemove.includes(scId)));
        return prev.filter(c => c !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const toggleSubCategory = (id) => {
    setSelectedSubCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <AppShell title={subCategoryName ? `Explore ${subCategoryName}` : categoryName ? `Explore ${categoryName}` : "Explore"}>
      <div className="px-5 py-6">
        
        <div className="flex items-center gap-2 mb-6 md:mb-8">
          <div className="flex flex-1 items-center gap-2 rounded-2xl bg-card px-4 py-3 shadow-soft">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search art, artists…"
              className="w-full bg-transparent text-sm md:text-base outline-none placeholder:text-muted-foreground" />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl shadow-soft transition-colors ${showFilters ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'}`}
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`w-full md:w-64 shrink-0 ${showFilters ? 'block' : 'hidden'}`}>
            <div className="sticky top-24 bg-card p-5 rounded-2xl shadow-soft">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg font-bold">Filters</h3>
                {showFilters && (
                  <button onClick={() => setShowFilters(false)} className="">
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                )}
              </div>
              
              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold text-sm uppercase text-muted-foreground mb-3">Categories</h4>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                  {categories.map(c => {
                    const isChecked = selectedCategories.includes(c._id);
                    const categorySubCats = subCategories.filter(sc => sc.category?._id === c._id || sc.category === c._id);
                    
                    return (
                      <div key={c._id} className="flex flex-col gap-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={isChecked}
                            onChange={() => toggleCategory(c._id)}
                            className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                          />
                          <span className="text-sm font-medium">{c.name}</span>
                        </label>
                        
                        {/* Subcategories */}
                        {isChecked && categorySubCats.length > 0 && (
                          <div className="ml-6 space-y-1 mt-1">
                            {categorySubCats.map(sc => (
                              <label key={sc._id} className="flex items-center gap-2 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={selectedSubCategories.includes(sc._id)}
                                  onChange={() => toggleSubCategory(sc._id)}
                                  className="rounded border-gray-300 text-primary/70 focus:ring-primary/70 h-3.5 w-3.5"
                                />
                                <span className="text-xs text-muted-foreground">{sc.name}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold text-sm uppercase text-muted-foreground mb-3">Price Range (₹)</h4>
                
                <div className="mb-4">
                  <input 
                    type="range" 
                    min="0" 
                    max="100000" 
                    step="500"
                    value={maxPrice || 100000}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>₹0</span>
                    <span>₹{maxPrice || '100000'}+</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                  <span className="text-muted-foreground">-</span>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {(subCategoryName || categoryName) && (
              <div className="mb-6 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent p-6 border-l-4 border-primary">
                <h1 className="font-display text-3xl font-bold">{subCategoryName || categoryName}</h1>
                <p className="mt-1 text-muted-foreground">Discover exquisite products in this {subCategoryName ? 'sub-category' : 'category'}.</p>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <>
                <p className="text-xs text-muted-foreground mb-4">{products.length} artworks on this page</p>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
                  {products.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
                {products.length === 0 && (
                  <div className="mt-12 text-center text-sm text-muted-foreground bg-card p-10 rounded-2xl shadow-soft flex flex-col items-center gap-3">
                    <span className="text-4xl">🔍</span>
                    <p>No artworks found matching your filters.</p>
                  </div>
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
          </main>
        </div>
      </div>
    </AppShell>
  );
}
