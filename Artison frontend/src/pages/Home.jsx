import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Palette, Truck, ShieldCheck, Star, Quote, Mail, X, ChevronDown, MessageSquare, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { products, artists } from "@/data/products";
import api from "@/api";

// const stats = [
// { value: "2,400+", label: "Original artworks" },
// { value: "180+", label: "Independent artists" },
// { value: "45+", label: "Countries shipped" },
// { value: "4.9★", label: "Collector rating" }];


const perks = [
{ icon: Palette, title: "Curated weekly", desc: "Our curators handpick every drop so quality stays high." },
{ icon: Truck, title: "Worldwide shipping", desc: "Insured, tracked delivery straight from artist studios." },
{ icon: ShieldCheck, title: "Authenticity guaranteed", desc: "Signed certificate of authenticity with every piece." }];


const testimonials = [
{ name: "Priya S.", role: "Collector, Mumbai", quote: "The quality and authenticity guaranteed by Kalakosh is unmatched. My living room feels alive now." },
{ name: "Arjun M.", role: "Designer, Bengaluru", quote: "I commission 3D art from Riya every quarter. Kalakosh made discovery so easy." },
{ name: "Neha K.", role: "Art Enthusiast, Delhi", quote: "Found the perfect abstract piece for my new office. The direct connection with artists is wonderful." }];

const categoryDescriptions = {
  "Local Art": "Step into the world of timeless craftsmanship, where every brushstroke and pattern carries the soul of a community. Discover authentic folk and tribal art that celebrates heritage, stories, and traditions passed down through generations.",
  "Modern Art": "Bold, expressive, and endlessly imaginative—our Modern Art collection brings fresh perspectives to life. Explore creations that blend creativity with contemporary style, transforming everyday spaces into inspiring works of art.",
  "3D Art": "Experience art that goes beyond the canvas. From striking sculptures to intricate three-dimensional creations, this collection adds depth, texture, and a unique artistic presence to every corner of your space.",
  "Handmade Collection": "Crafted with patience, passion, and a personal touch, every handmade piece is one of a kind. Explore beautifully created décor, gifts, and lifestyle products that celebrate the beauty of human craftsmanship and thoughtful design."
};

const factsData = [
  { title: "Sohrai Art – Nature's Canvas", desc: "Created with natural earth pigments, Sohrai Art transforms ordinary walls into vibrant celebrations of wildlife, harvest, and life itself. Every stroke echoes a centuries-old tribal tradition.", image: "/sohrai art.jpg.jpeg" },
  { title: "Khovar Art – A Symbol of New Beginnings", desc: "Traditionally painted on the walls of newlyweds' homes, Khovar Art is a beautiful expression of love, fertility, and prosperity, brought to life through intricate patterns and symbolism.", image: "/khovar art.jpg.jpeg" },
  { title: "Dokra Craft – Fire, Wax & Legacy", desc: "Over 4,000 years old, Dokra is one of India's oldest metal casting traditions. Each handcrafted piece is unique—no two creations are ever exactly alike.", image: "/dokra art.jpg.jpeg" },
  { title: "Bamboo Craft – From Forest to Masterpiece", desc: "With little more than bamboo and skilled hands, Jharkhand's artisans create elegant baskets, décor, and utility pieces that celebrate sustainable craftsmanship.", image: "/Bamboo Handicrafts.jpg.jpeg" },
  { title: "Terracotta – Earth Shaped into Art", desc: "From humble clay emerge timeless sculptures, pottery, and decorative pieces. Terracotta is proof that the simplest elements of nature can become extraordinary works of art.", image: "/Terracotta.jpg.jpeg" },
  { title: "Madhubani – Stories in Every Stroke", desc: "Originating in Bihar, Madhubani Art is known for its bold colours, intricate patterns, and mythological themes. Every painting is a visual story waiting to be discovered.", image: "/Madhubani.jpg.jpeg" },
  { title: "Sikki Grass Craft – Woven with Gold", desc: "Made from the naturally golden Sikki grass of Bihar, these handcrafted creations blend beauty with utility, preserving a tradition passed down through generations.", image: "/Sikki Grass Craft.jpg.jpeg" },
  { title: "Manjusha Art – Where Folklore Comes Alive", desc: "Inspired by the legendary tale of Bihula and Bishahari, Manjusha Art is one of Bihar's most distinctive painting styles, recognised for its vibrant borders and expressive storytelling.", image: "/Manjusha art.jpeg" },
  { title: "Tikuli Art – A Tradition Reimagined", desc: "Once used to decorate bindis, Tikuli Art has evolved into stunning paintings on hardboard, combining intricate detailing with brilliant colours and timeless elegance.", image: "/tikuli art.jpg.jpeg" },
  { title: "3D Art – Creativity Beyond the Canvas", desc: "Art no longer lives only on flat surfaces. Through depth, texture, and perspective, 3D art transforms imagination into immersive visual experiences.", image: "/3D art.jpg.jpeg" },
  { title: "Sculptures – Where Stone Finds a Soul", desc: "A sculpture is more than a carved form—it's emotion, movement, and imagination frozen in time, inviting every viewer to see a story from a new perspective.", image: "/sculpture art.jpg.jpeg" },
  { title: "Every Handmade Piece Has a Story", desc: "Behind every brushstroke, carving, and sculpture is an artist preserving culture, expressing creativity, and keeping generations of craftsmanship alive.", image: "/hero1.jpeg" }
];


export default function Home() {
  const [categoriesData, setCategoriesData] = useState([]);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [subCategoriesCache, setSubCategoriesCache] = useState({});
  const [hoveredSubCategory, setHoveredSubCategory] = useState(null);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);

  const handleCategoryHover = async (c, idx) => {
    setActiveCategoryIndex(idx);
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
  const [activeFactIndex, setActiveFactIndex] = useState(0);
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ name: '', rating: 5, comment: '' });
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [approvedFeedbacks, setApprovedFeedbacks] = useState([]);
  const [activeFeedbackIndex, setActiveFeedbackIndex] = useState(0);

  const [activeCoupons, setActiveCoupons] = useState([
    { _id: '1', code: 'WELCOME20', discountType: 'percentage', discountValue: 20, applicability: 'all', description: 'Get 20% off on all products site-wide!', minSpend: 1000 },
    { _id: '2', code: 'SOHRAI500', discountType: 'fixed', discountValue: 500, applicability: 'categories', selectedCategories: [{name: 'Sohrai Art'}], description: 'Flat ₹500 off on any Sohrai Art piece.' },
    { _id: '3', code: 'SPECIAL10', discountType: 'percentage', discountValue: 10, applicability: 'products', selectedProducts: [{name: 'Terracotta Horse'}], description: '10% off exclusively on selected product.' }
  ]);
  const [currentCouponIndex, setCurrentCouponIndex] = useState(0);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await api.get('/coupons/active');
        if (res.data?.success && res.data.data.length > 0) {
          setActiveCoupons(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };
    fetchCoupons();
  }, []);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('hasSeenNewsletterPopup');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setShowNewsletterPopup(true);
        sessionStorage.setItem('hasSeenNewsletterPopup', 'true');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const sohraiRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sohraiRef,
    offset: ["start end", "end start"]
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        if (response.data && response.data.data) {
          setCategoriesData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [heroItems, setHeroItems] = useState([
    { image: '/hero1.jpeg' },
    { image: '/hero2.jpeg' },
    { image: '/hero3.jpeg' },
    { image: '/hero4.jpeg' },
    { image: '/hero5.jpeg' },
    { image: '/hero6.jpeg' },
    { image: '/hero7.jpeg' }
  ]);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        const [featuredRes, trendingRes] = await Promise.all([
          api.get('/products?tags=Featured&limit=4'),
          api.get('/products?tags=Trending&limit=4')
        ]);
        
        if (featuredRes.data?.success && featuredRes.data.data.length > 0) setFeaturedProducts(featuredRes.data.data);
        if (trendingRes.data?.success && trendingRes.data.data.length > 0) setTrendingProducts(trendingRes.data.data);
      } catch (error) {
        console.error("Error fetching home products:", error);
      }
    };
    
    const fetchFeedbacks = async () => {
      try {
        const res = await api.get('/feedbacks/approved');
        if (res.data?.success) {
          setApprovedFeedbacks(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchHomeProducts();
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    if (approvedFeedbacks.length <= 1) return;
    const interval = setInterval(() => {
      setActiveFeedbackIndex((prev) => (prev + 1) % Math.min(approvedFeedbacks.length, 10));
    }, 4000);
    return () => clearInterval(interval);
  }, [approvedFeedbacks]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFactIndex((prev) => (prev + 1) % factsData.length);
    }, 6000); // 6 seconds per fact
    return () => clearInterval(interval);
  }, []);

  return (
    <AppShell title="Discover" transparentHeader={true}>
      {/* Seamless Integrated Hero Layout */}
      <motion.section className="w-screen relative left-1/2 -translate-x-1/2 mt-0 md:mt-0 bg-[#0a0a0a]">
        <div className="w-full min-h-[85vh] md:h-[95vh] relative overflow-hidden flex items-center">
          
          {/* Large Integrated Image with Soft Edges */}
          <div className="absolute inset-y-0 right-0 z-0 flex items-center justify-end w-full md:w-[85%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFactIndex}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="relative w-full h-[70vh] md:h-full"
                style={{
                  WebkitMaskImage: 'radial-gradient(ellipse at right center, black 40%, transparent 90%)',
                  maskImage: 'radial-gradient(ellipse at right center, black 40%, transparent 90%)'
                }}
              >
                <img 
                  src={factsData[activeFactIndex].image} 
                  className="w-full h-full object-contain object-right opacity-90" 
                  alt="" 
                />
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Gradients to merge background and ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent z-10 md:hidden" />
          
          {/* Subtle Warm Glows */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(245,158,11,0.05),_transparent_50%)] z-10 pointer-events-none" />

          {/* Main Content Container */}
          <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-start justify-center pt-24 pb-12 md:py-0">
            
            {/* Text Content */}
            <div className="w-full md:w-1/2 flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFactIndex}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.8, type: "spring" }}
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-6 backdrop-blur-md shadow-lg">
                    <Sparkles className="h-3.5 w-3.5" /> Fascinating Facts
                  </div>
                  <h1 className="text-white font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6" style={{ fontFamily: "'Dancing Script', cursive" }}>
                    {factsData[activeFactIndex].title.split('–')[0]}
                  </h1>
                  <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed border-l-2 border-amber-500/50 pl-4">
                    {factsData[activeFactIndex].desc}
                  </p>
                </motion.div>
              </AnimatePresence>
              
              {/* Navigation Indicators */}
              <div className="flex gap-2 mt-10">
                {factsData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveFactIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      activeFactIndex === idx 
                        ? 'w-10 bg-amber-500' 
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </motion.section>




      

{/*===================== Categories - Interactive List =====================*/}


      <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut" }} className="mt-8 px-5 md:mt-16 md:px-0">
        <div className="flex items-center justify-between mb-8">
                      <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-display text-5xl md:text-7xl font-bold text-amber-950 mb-8"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              Categories
            </motion.h2>
          <Link to="/categories" className="text-sm font-semibold text-primary hover:underline">All categories →</Link>
        </div>
        
        {categoriesData.length > 0 ? (
          <div className="flex flex-col-reverse md:grid md:grid-cols-12 gap-4 md:gap-8 min-h-[400px]">
            {/* Left side: List of Categories */}
            <div className="md:col-span-5 flex flex-col justify-top pr-0 md:pr-8">
              {categoriesData.slice(0, 5).map((c, idx) => (
                <div key={c._id || c.name} className="flex flex-col border-b border-border/50 last:border-0">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                    onMouseEnter={() => handleCategoryHover(c, idx)}
                    onClick={() => handleCategoryHover(c, idx)}
                    className={`group flex items-center justify-between py-6 cursor-pointer transition-colors duration-300 ${activeCategoryIndex === idx ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <span className={`font-display text-2xl md:text-3xl font-bold transition-transform duration-300 ${activeCategoryIndex === idx ? 'translate-x-2' : 'group-hover:translate-x-1'}`} style={{ fontFamily: "'Dancing Script', cursive",fontWeight:"bold" }}>{c.name}</span>
                    <ArrowRight className={`h-6 w-6 transition-all duration-300 ${activeCategoryIndex === idx ? 'opacity-100 -translate-x-2' : 'opacity-0 translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'}`} />
                  </motion.div>
                  <AnimatePresence>
                    {activeCategoryIndex === idx && loadingSubCategories && !subCategoriesCache[c._id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 pl-4 pb-6 text-muted-foreground/60"
                      >
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-sm font-medium">Loading...</span>
                      </motion.div>
                    )}
                    {activeCategoryIndex === idx && subCategoriesCache[c._id]?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-col gap-3 pl-4 pb-6 overflow-hidden"
                      >
                        {subCategoriesCache[c._id].map(sub => (
                          <Link
                            key={sub._id}
                            to={`/explore?subCategory=${sub._id}&subCategoryName=${encodeURIComponent(sub.name)}`}
                            onMouseEnter={() => setHoveredSubCategory(sub)}
                            onMouseLeave={() => setHoveredSubCategory(null)}
                            className={`font-display text-lg md:text-xl transition-all duration-300 inline-block w-fit ${
                              hoveredSubCategory?._id === sub._id 
                              ? 'text-primary translate-x-2 font-semibold' 
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
            </div>
            
            {/* Right side: Image and Description */}
            <div className="md:col-span-7 relative h-[300px] md:h-[500px] rounded-[2rem] overflow-hidden bg-zinc-100 shadow-xl group block">
                {(() => {
                  const activeCat = categoriesData[activeCategoryIndex] || categoriesData[0];
                  const displayItem = hoveredSubCategory || activeCat;
                  const linkUrl = hoveredSubCategory 
                    ? `/explore?subCategory=${hoveredSubCategory._id}&subCategoryName=${encodeURIComponent(hoveredSubCategory.name)}`
                    : `/explore?category=${activeCat._id}&categoryName=${encodeURIComponent(activeCat.name)}`;
                  
                  return (
                    <Link to={linkUrl} className="block w-full h-full relative">
                      {displayItem.image ? (
                        <img 
                          key={displayItem._id}
                          src={displayItem.image} 
                          alt={displayItem.name} 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105 animate-in fade-in duration-500" 
                        />
                      ) : activeCat.image ? (
                        <img 
                          key={activeCat._id}
                          src={activeCat.image} 
                          alt={activeCat.name} 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105 animate-in fade-in duration-500" 
                        />
                      ) : (
                         <div className="absolute inset-0 flex items-center justify-center bg-zinc-200 text-8xl animate-in fade-in duration-500">
                           🎨
                         </div>
                      )}
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white w-full z-10">
                        <h3 className="font-display text-3xl md:text-5xl font-bold mb-2 md:mb-3">{displayItem.name}</h3>
                        {(categoryDescriptions[displayItem.name] || displayItem.description || categoryDescriptions[activeCat.name] || activeCat.description) && (
                          <p className="text-white/90 text-sm md:text-lg line-clamp-3 max-w-xl font-medium">
                            {categoryDescriptions[displayItem.name] || displayItem.description || categoryDescriptions[activeCat.name] || activeCat.description}
                          </p>
                        )}
                        {!hoveredSubCategory && (
                          <span className="mt-4 md:mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black shadow-lg transition-transform hover:-translate-y-1">
                            Explore {displayItem.name} <ArrowRight className="h-4 w-4" />
                          </span>
                        )}
                      </div>
                    </Link>
                  )
                })()}
            </div>
          </div>
        ) : (
           <div className="h-40 w-full animate-pulse rounded-[2rem] bg-accent" />
        )}
      </motion.section>


     {/* Featured */}
      <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut" }} className="mt-7 md:mt-14">
        <div className="mb-3 flex items-end justify-between px-5 md:mb-5 md:px-0">
          <div>
            <h2 className="font-display text-xl font-bold md:text-3xl">Featured works</h2>
            <p className="text-xs text-muted-foreground md:text-sm">Hand-picked this week</p>
          </div>
          <Link to="/featured" className="text-sm font-medium text-primary hover:underline">View all featured →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-5 px-5 md:px-0">
          {featuredProducts?.slice(0, 4).map((p) =>
            <ProductCard key={p._id || p.id} product={p} />
          )}
        </div>
      </motion.section>



      {/* Active Coupons Slider */}
      {activeCoupons.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut" }} className="mt-7 md:mt-14 px-5 md:px-0">
          <div className="mb-3 flex items-end justify-between md:mb-5">
            <div>
              <h2 className="font-display text-xl font-bold md:text-3xl text-amber-950">Active Offers</h2>
              <p className="text-xs text-muted-foreground md:text-sm">Exclusive discounts just for you</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCurrentCouponIndex(prev => (prev - 1 + activeCoupons.length) % activeCoupons.length)} className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-foreground hover:bg-amber-100 shadow-sm"><ChevronLeft className="h-4 w-4" /></button>
              <button onClick={() => setCurrentCouponIndex(prev => (prev + 1) % activeCoupons.length)} className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-foreground hover:bg-amber-100 shadow-sm"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-[2rem] shadow-2xl min-h-[350px] flex items-center p-6 md:p-12 mt-6">
            
            {/* Dynamic Background Image */}
            <AnimatePresence mode="wait">
              <motion.img 
                key={`bg-${currentCouponIndex}`}
                src={
                  activeCoupons[currentCouponIndex].applicability === 'all' ? 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2040&auto=format&fit=crop' :
                  activeCoupons[currentCouponIndex].applicability === 'categories' ? 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2000&auto=format&fit=crop' :
                  'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=2000&auto=format&fit=crop'
                }
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full object-cover"
                alt="Background"
              />
            </AnimatePresence>
            
            {/* Dark Gradient Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30 z-0" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCouponIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="relative z-10 w-full flex flex-col md:flex-row items-center gap-8 md:gap-16 pb-6 md:pb-0"
              >
                
                {/* Discount Badge */}
                <div className="shrink-0 flex flex-col items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl relative">
                    <div className="absolute inset-2 rounded-full border border-dashed border-white/30 animate-spin-slow" style={{ animationDuration: '20s' }}></div>
                    <span className="block text-4xl md:text-5xl font-black text-amber-400 leading-none drop-shadow-md z-10">
                      {activeCoupons[currentCouponIndex].discountType === 'percentage' 
                        ? `${activeCoupons[currentCouponIndex].discountValue}%` 
                        : `₹${activeCoupons[currentCouponIndex].discountValue}`}
                    </span>
                    <span className="text-xs font-bold text-white uppercase tracking-widest mt-2 block z-10">OFF</span>
                </div>

                {/* Coupon Details */}
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-widest text-amber-300 mb-4 border border-white/20">
                    <Sparkles className="h-3 w-3" />
                    {activeCoupons[currentCouponIndex].applicability === 'all' ? 'Site-wide Offer' : 
                     activeCoupons[currentCouponIndex].applicability === 'categories' ? `Category: ${activeCoupons[currentCouponIndex].selectedCategories?.[0]?.name || 'Selected'}` :
                     'Exclusive Product Offer'}
                  </div>
                  <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg leading-tight">
                    {activeCoupons[currentCouponIndex].description || "Special Discount just for you"}
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 justify-center md:justify-start">
                    <div className="flex items-center gap-3 border border-white/30 bg-black/40 backdrop-blur-md rounded-xl px-6 py-3 shadow-inner">
                      <span className="font-mono text-xl md:text-2xl font-bold text-amber-400 tracking-widest">
                        {activeCoupons[currentCouponIndex].code}
                      </span>
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(activeCoupons[currentCouponIndex].code);
                        toast.success("Coupon code copied!");
                      }}
                      className="rounded-xl bg-amber-500 hover:bg-amber-400 px-8 py-3 text-sm md:text-base font-bold text-black shadow-[0_0_20px_rgba(245,158,11,0.4)] transition active:scale-95"
                    >
                      Copy Code
                    </button>
                  </div>
                  
                  {(activeCoupons[currentCouponIndex].minSpend) > 0 && (
                     <p className="text-xs text-white/60 mt-5 font-medium">
                       *Valid on minimum purchase of ₹{activeCoupons[currentCouponIndex].minSpend}
                     </p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Dots Overlay */}
            <div className="absolute bottom-5 left-0 right-0 z-20 flex justify-center gap-3">
              {activeCoupons.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentCouponIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${currentCouponIndex === idx ? 'w-10 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'}`}
                />
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Trending grid */}
      <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut" }} className="mt-7 px-5 md:mt-14 md:px-0">
        <div className="mb-3 flex items-end justify-between md:mb-5">
          <h2 className="font-display text-xl font-bold md:text-3xl">Trending now</h2>
          <Link to="/trending" className="text-sm font-medium text-primary hover:underline">View all trending →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-5 px-5 md:px-0">
          {trendingProducts?.slice(0, 4).map((p) => <ProductCard key={p._id || p.id} product={p} />)}
        </div>
      </motion.section>

            {/* Why Artisana - desktop only */}
      <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut" }} className="mt-14  md:block">
        <div className="grid gap-5 md:grid-cols-3">
          {perks.map((p) =>
          <div key={p.title} className="rounded-3xl bg-card p-7 shadow-soft">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-warm text-primary-foreground">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
            </div>
          )}
        </div>
      </motion.section>



      {/* Testimonials */}
      <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut" }} className="mt-14 px-5 overflow-hidden">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-bold">Loved by collectors</h2>
          <p className="text-sm text-muted-foreground">Real reviews from real buyers</p>
        </div>
        
        <div className="relative h-[22rem] mx-auto w-full max-w-7xl flex items-center justify-center overflow-visible group">
          {/* Previous Button */}
          {approvedFeedbacks.length > 1 && (
            <button
              onClick={() => setActiveFeedbackIndex(prev => (prev - 1 + Math.min(approvedFeedbacks.length, 10)) % Math.min(approvedFeedbacks.length, 10))}
              className="absolute left-2 md:left-12 z-30 p-2 md:p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg text-foreground hover:bg-muted transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
              aria-label="Previous feedback"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next Button */}
          {approvedFeedbacks.length > 1 && (
            <button
              onClick={() => setActiveFeedbackIndex(prev => (prev + 1) % Math.min(approvedFeedbacks.length, 10))}
              className="absolute right-2 md:right-12 z-30 p-2 md:p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg text-foreground hover:bg-muted transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
              aria-label="Next feedback"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {approvedFeedbacks.length > 0 ? (
            approvedFeedbacks.slice(0, 10).map((t, index) => {
              const total = Math.min(approvedFeedbacks.length, 10);
              let offset = (index - activeFeedbackIndex) % total;
              if (offset < -Math.floor(total / 2)) offset += total;
              if (offset > Math.floor(total / 2)) offset -= total;
              
              if (Math.abs(offset) > 2) return null; // Only show +/- 2 items

              let x = "0%";
              let scale = 1;
              let opacity = 1;
              let zIndex = 20;

              if (offset === -1) {
                x = "-50%";
                scale = 0.85;
                opacity = 0.5;
                zIndex = 10;
              } else if (offset === 1) {
                x = "50%";
                scale = 0.85;
                opacity = 0.5;
                zIndex = 10;
              } else if (offset === -2) {
                x = "-75%";
                scale = 0.7;
                opacity = 0.2;
                zIndex = 5;
              } else if (offset === 2) {
                x = "75%";
                scale = 0.7;
                opacity = 0.2;
                zIndex = 5;
              }

              return (
                <motion.div
                  key={t._id}
                  className="absolute w-80 md:w-96 rounded-3xl bg-card p-8 shadow-xl border border-border"
                  initial={false}
                  animate={{ x, scale, opacity, zIndex }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Quote className="h-8 w-8 text-primary/40 mb-4" />
                  <p className="text-base leading-relaxed text-foreground/90 line-clamp-4 h-24">"{t.comment}"</p>
                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-foreground">{t.name}</div>
                      {/* <div className="text-xs text-muted-foreground mt-0.5">Collector</div> */}
                    </div>
                    <div className="flex items-center gap-1 text-gold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < t.rating ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center text-muted-foreground py-8 w-full">
              No feedback yet. Be the first to share your thoughts!
            </div>
          )}
        </div>
      </motion.section>

      {/* CTA / Newsletter */}
      <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut" }} className="mt-10 px-5 pb-6 md:mt-16 md:px-0 md:pb-10">
        <div className="relative overflow-hidden rounded-3xl bg-foreground p-7 text-background shadow-card md:p-12">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-primary/40 blur-3xl" />
          <div className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-gold/30 blur-3xl" />
          <div className="relative grid gap-6 md:grid-cols-2 md:items-center md:gap-10">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-background/10 px-3 py-1 text-[10px] font-medium uppercase tracking-widest">
                <Mail className="h-3 w-3" /> Weekly drop
              </div>
              <h2 className="mt-3 font-display text-2xl font-bold leading-tight md:text-4xl">
                Get new artworks in your inbox.
              </h2>
              <p className="mt-2 text-sm text-background/70 md:text-base">
                Be first to see curated drops every Friday. No spam — just art.
              </p>
            </div>
            <form className="flex flex-col gap-2 sm:flex-row" onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const email = formData.get('email');
              const submitBtn = e.target.querySelector('button[type="submit"]');
              if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Subscribing...';
              }
              try {
                const response = await api.post('/subscribers/subscribe', { email });
                toast.success(response.data.message || 'Subscribed successfully!');
                e.target.reset();
              } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.message || 'Failed to subscribe');
              } finally {
                if (submitBtn) {
                  submitBtn.disabled = false;
                  submitBtn.textContent = 'Subscribe';
                }
              }
            }}>
              <input
                type="email"
                name="email"
                required
                placeholder="you@studio.com"
                className="flex-1 rounded-full bg-background/10 px-5 py-3 text-sm text-background outline-none ring-1 ring-background/20 placeholder:text-background/50 focus:ring-background/60" />
              
              <button type="submit" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </motion.section>


      {/* Floating Newsletter Popup */}
      {showNewsletterPopup && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed bottom-4 right-4 z-50 w-[calc(100%-32px)] max-w-[360px] md:bottom-8 md:right-8"
        >
          <div className="relative overflow-hidden rounded-3xl bg-amber-50 p-6 text-amber-950 shadow-2xl border border-amber-200">
            <button 
              onClick={() => setShowNewsletterPopup(false)}
              className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-amber-950/60 transition hover:bg-amber-950/10 hover:text-amber-950"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-amber-300/30 blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-950/10 px-2.5 py-1 text-[9px] font-medium uppercase tracking-widest text-amber-900">
                <Mail className="h-3 w-3" /> Weekly drop
              </div>
              <h3 className="mt-3 font-sans text-xl font-black tracking-tight leading-tight md:text-2xl">
                Get new artworks in your inbox.
              </h3>
              <p className="mt-2 text-xs text-amber-900/80">
                Be first to see curated drops every Friday. No spam — just art.
              </p>
              
              <form className="mt-5 flex flex-col gap-2" onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const email = formData.get('email');
                const submitBtn = e.target.querySelector('button[type="submit"]');
                if (submitBtn) {
                  submitBtn.disabled = true;
                  submitBtn.textContent = 'Subscribing...';
                }
                try {
                  const response = await api.post('/subscribers/subscribe', { email });
                  toast.success(response.data.message || 'Subscribed successfully!');
                  setShowNewsletterPopup(false);
                } catch (error) {
                  console.error(error);
                  toast.error(error.response?.data?.message || 'Failed to subscribe');
                } finally {
                  if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Subscribe';
                  }
                }
              }}>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@studio.com"
                  className="rounded-full bg-white/60 px-4 py-2.5 text-xs text-amber-950 outline-none ring-1 ring-amber-950/20 placeholder:text-amber-950/50 focus:ring-amber-950/40 w-full" 
                />
                <button type="submit" className="rounded-full bg-amber-950 px-4 py-2.5 text-xs font-semibold text-white shadow-soft transition hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed w-full">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      )}

      {/* Floating Share Feedback Button */}
      <button
        onClick={() => setShowFeedbackModal(true)}
        className="fixed bottom-24 right-4 md:bottom-14 md:right-8 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-xl transition-transform hover:scale-105 hover:shadow-2xl"
      >
        <MessageSquare className="h-5 w-5" />
        <span className="hidden sm:inline">Share Feedback</span>
      </button>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-card p-6 shadow-2xl"
          >
            <button
              onClick={() => setShowFeedbackModal(false)}
              className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mb-6">
              <h3 className="font-display text-2xl font-bold">Share your feedback</h3>
              <p className="text-sm text-muted-foreground mt-1">We'd love to hear your thoughts about Kalakosh.</p>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmittingFeedback(true);
                try {
                  const response = await api.post('/feedbacks', feedbackData);
                  toast.success(response.data.message || 'Feedback submitted successfully!');
                  setShowFeedbackModal(false);
                  setFeedbackData({ name: '', rating: 5, comment: '' });
                } catch (error) {
                  toast.error(error.response?.data?.message || 'Failed to submit feedback');
                } finally {
                  setIsSubmittingFeedback(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  value={feedbackData.name}
                  onChange={(e) => setFeedbackData({ ...feedbackData, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Rating</label>
                <div className="flex gap-2 text-2xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackData({ ...feedbackData, rating: star })}
                      className={`transition-colors focus:outline-none ${feedbackData.rating >= star ? 'text-amber-400' : 'text-gray-200'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Feedback</label>
                <textarea
                  required
                  rows={4}
                  value={feedbackData.comment}
                  onChange={(e) => setFeedbackData({ ...feedbackData, comment: e.target.value })}
                  placeholder="Tell us what you think..."
                  className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingFeedback}
                className="w-full rounded-full bg-foreground px-4 py-3 text-sm font-semibold text-background shadow-md transition-transform hover:scale-[1.02] disabled:opacity-70"
              >
                {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

    </AppShell>);

}
