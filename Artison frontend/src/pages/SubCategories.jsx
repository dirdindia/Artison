import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import api from "@/api";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

export default function SubCategories() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const categoryName = searchParams.get("categoryName") || "Category";

  const [subCategories, setSubCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [canScroll, setCanScroll] = useState(false);
  
  const scrollRef = useRef(null);
  const limit = 20;

  useEffect(() => {
    const fetchSubCategories = async () => {
      setLoading(true);
      try {
        let url = `/subcategories?page=${page}&limit=${limit}`;
        if (categoryId) url += `&category=${categoryId}`;

        const res = await api.get(url);
        if (res.data && res.data.data) {
          setSubCategories(res.data.data);
          if (res.data.data.length > 0) {
            setHoveredCategory(res.data.data[0]);
          }
          if (res.data.pagination) {
            setTotalPages(res.data.pagination.totalPages);
          }
        }
      } catch (err) {
        console.error("Failed to fetch sub-categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubCategories();
  }, [page, categoryId]);

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
  }, [subCategories]);

  return (
    <AppShell title={`${categoryName} - Sub Collections`}>
      <div className="w-full flex flex-col md:flex-row bg-background">
        
        {/* Left Side: Typography List (Categories + Inline Subcategories) - STICKY */}
        <div className="w-full md:w-1/2 md:sticky md:top-0 md:h-[calc(100vh-80px)] relative flex flex-col bg-background border-r border-border/50 z-20">
          <div 
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex-1 flex flex-col px-8 md:px-16 lg:px-24 py-10 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] z-10"
          >
            <h1 className="text-xs lg:text-sm uppercase tracking-widest text-muted-foreground mb-8 md:mb-12 sticky top-0 bg-background/90 py-2 backdrop-blur-sm z-20">
              {categoryName}
            </h1>
          
            {loading ? (
               <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mt-20"></div>
            ) : subCategories.length === 0 ? (
               <div className="text-muted-foreground text-xl text-center mt-20">No sub-collections found.</div>
            ) : (
              <div className="flex flex-col gap-6 md:gap-8 pb-8 md:pb-20 justify-center min-h-[50%]">
                {subCategories.map((c) => (
                  <Link
                    key={c._id || c.name}
                    to={`/explore?subCategory=${c._id}&subCategoryName=${encodeURIComponent(c.name)}`}
                    onMouseEnter={() => setHoveredCategory(c)}
                    onClick={(e) => {
                      // On touch devices, first tap shows image. Second tap navigates.
                      if (hoveredCategory?._id !== c._id) {
                        e.preventDefault();
                        setHoveredCategory(c);
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
              {hoveredCategory && hoveredCategory.image ? (
                <motion.div
                  key={hoveredCategory._id}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
                  className="absolute inset-0 flex items-center justify-center p-8 md:p-16"
                >
                  <img 
                    src={hoveredCategory.image} 
                    alt={hoveredCategory.name}
                    className="max-w-full max-h-full object-contain drop-shadow-xl"
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
          {hoveredCategory && (
            <div className="min-h-[30vh] md:min-h-[40vh] w-full flex flex-col justify-center p-8 md:p-16 border-t border-border/30 bg-background/50">
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">{hoveredCategory.name}</h2>
              {hoveredCategory.description && (
                <p className="text-muted-foreground mt-4 md:mt-6 text-base md:text-xl leading-relaxed">
                  {hoveredCategory.description}
                </p>
              )}
              <Link 
                to={`/explore?subCategory=${hoveredCategory._id}&subCategoryName=${encodeURIComponent(hoveredCategory.name)}`} 
                className="mt-8 md:mt-10 text-primary font-medium hover:text-primary/80 flex items-center gap-3 w-fit text-lg md:text-xl group bg-primary/5 hover:bg-primary/10 px-6 py-3 rounded-full transition-colors"
              >
                Explore Products <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
