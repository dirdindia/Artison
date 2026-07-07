import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import api from "@/api";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [subCategoriesCache, setSubCategoriesCache] = useState({});
  const [hoveredSubCategory, setHoveredSubCategory] = useState(null);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);

  const [canScroll, setCanScroll] = useState(false);
  const scrollRef = useRef(null);
  const limit = 20;

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/categories?page=${page}&limit=${limit}`);
        if (res.data && res.data.data) {
          setCategories(res.data.data);
          if (res.data.data.length > 0) {
            handleCategoryHover(res.data.data[0]);
          }
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

  const handleCategoryHover = async (c) => {
    if (hoveredCategory?._id === c._id) return;
    
    setHoveredCategory(c);
    setHoveredSubCategory(null);

    if (!subCategoriesCache[c._id]) {
      setLoadingSubCategories(true);
      try {
        const res = await api.get(`/subcategories?category=${c._id}&limit=50`);
        if (res.data && res.data.data) {
          setSubCategoriesCache(prev => ({ ...prev, [c._id]: res.data.data }));
        }
      } catch (err) {
        console.error("Failed to fetch sub-categories", err);
      } finally {
        setLoadingSubCategories(false);
      }
    }
  };

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = scrollRef.current;
      setCanScroll(scrollHeight - scrollTop > clientHeight + 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories, hoveredCategory]);

  const activeItem = hoveredSubCategory || hoveredCategory;
  const exploreUrl = hoveredSubCategory 
    ? `/explore?subCategory=${hoveredSubCategory._id}&subCategoryName=${encodeURIComponent(hoveredSubCategory.name)}`
    : (hoveredCategory ? `/explore?category=${hoveredCategory._id}&categoryName=${encodeURIComponent(hoveredCategory.name)}` : "#");
  const exploreText = hoveredSubCategory ? "Explore Products" : "Explore Category";

  return (
    <AppShell title="Collections">
      <div className="w-full flex flex-col md:flex-row bg-background">
        
        {/* Left Side: Typography List (Categories + Inline Subcategories) - STICKY */}
        <div className="w-full md:w-1/2 md:sticky md:top-0 md:h-[calc(100vh-80px)] relative flex flex-col bg-background border-r border-border/50 z-20">
          
          {/* Header outside scroll area */}
          <div className="px-8 md:px-16 lg:px-24 pt-10 pb-4 shrink-0 bg-background z-20">
            <h1 className="text-xs lg:text-sm uppercase tracking-widest text-muted-foreground">Collections</h1>
          </div>

          <div 
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex-1 flex flex-col px-8 md:px-16 lg:px-24 pb-10 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] z-10"
          >
          
            {loading ? (
               <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mt-20"></div>
            ) : (
              <div className="flex flex-col gap-6 md:gap-8 pb-8 md:pb-20">
                {categories.map((c) => (
                  <div key={c._id || c.name} className="flex flex-col">
                    <Link
                      to={`/explore?category=${c._id}&categoryName=${encodeURIComponent(c.name)}`}
                      onMouseEnter={() => handleCategoryHover(c)}
                      onClick={(e) => {
                        // On touch devices, first tap opens the subcategories. Second tap navigates.
                        if (hoveredCategory?._id !== c._id) {
                          e.preventDefault();
                          handleCategoryHover(c);
                        }
                      }}
                      className={`font-display text-2xl sm:text-3xl md:text-4xl font-bold transition-all duration-500 ease-out inline-block w-fit ${
                        hoveredCategory?._id === c._id 
                        ? 'text-foreground translate-x-4 md:translate-x-6' 
                        : 'text-muted-foreground/40 hover:text-foreground/70'
                      }`}
                    >
                      {c.name}
                    </Link>
                    
                    {/* Inline Sub-Categories Dropdown */}
                    <AnimatePresence>
                      {hoveredCategory?._id === c._id && subCategoriesCache[c._id]?.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="flex flex-col gap-4 pl-10 md:pl-12 overflow-hidden"
                        >
                          {subCategoriesCache[c._id].map(sub => (
                            <Link
                              key={sub._id}
                              to={`/explore?subCategory=${sub._id}&subCategoryName=${encodeURIComponent(sub.name)}`}
                              onMouseEnter={() => setHoveredSubCategory(sub)}
                              className={`font-display text-lg sm:text-xl md:text-2xl transition-all duration-300 inline-block w-fit ${
                                hoveredSubCategory?._id === sub._id 
                                ? 'text-primary translate-x-3 font-semibold' 
                                : 'text-muted-foreground/60 hover:text-foreground/90 font-medium'
                              }`}
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center gap-4 text-muted-foreground">
                     <button 
                       onClick={() => setPage(p => Math.max(1, p - 1))} 
                       disabled={page === 1}
                       className="hover:text-foreground disabled:opacity-30 transition-colors"
                     >
                       <ChevronLeft className="h-6 w-6"/>
                     </button>
                     <span className="text-sm font-medium tracking-widest uppercase">Page {page} / {totalPages}</span>
                     <button 
                       onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                       disabled={page === totalPages}
                       className="hover:text-foreground disabled:opacity-30 transition-colors"
                     >
                       <ChevronRight className="h-6 w-6"/>
                     </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Down Arrow indicator */}
          {canScroll && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce pointer-events-none z-20 text-muted-foreground/40 hidden md:block">
              <ChevronDown className="h-6 w-6" />
            </div>
          )}
        </div>

        {/* Right Side: Image Reveal & Description - SCROLLS WITH PAGE */}
        <div className="w-full md:w-1/2 flex flex-col bg-background min-h-0 md:min-h-[calc(100vh-80px)]">
          
          {/* Top part: Full Height Image (100vh on Desktop, 50vh on Mobile) */}
          <div className="h-[55vh] md:h-[calc(100vh-80px)] w-full relative p-4 md:p-12 lg:p-16 flex-shrink-0">
            <AnimatePresence mode="wait">
              {activeItem && activeItem.image ? (
                <motion.div
                  key={activeItem._id}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
                  className="absolute inset-0 flex items-center justify-center p-8 md:p-16"
                >
                  <img 
                    src={activeItem.image} 
                    alt={activeItem.name}
                    className="w-full h-full object-cover rounded-3xl shadow-2xl"
                  />
                </motion.div>
              ) : (
                <motion.div 
                  key="fallback"
                  className="absolute inset-0 flex items-center justify-center text-9xl opacity-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  🎨
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Bottom part: Text (Appears when you scroll down) */}
          {activeItem && (
            <div className="min-h-[30vh] md:min-h-[40vh] w-full flex flex-col justify-center p-8 md:p-16 border-t border-border/30 bg-background/50">
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">{activeItem.name}</h2>
              {activeItem.description && (
                <p className="text-muted-foreground mt-4 md:mt-6 text-base md:text-xl leading-relaxed">
                  {activeItem.description}
                </p>
              )}
              <Link 
                to={exploreUrl}
                className="mt-8 md:mt-10 text-primary font-medium hover:text-primary/80 flex items-center gap-3 w-fit text-lg md:text-xl group bg-primary/5 hover:bg-primary/10 px-6 py-3 rounded-full transition-colors"
              >
                {exploreText} <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
