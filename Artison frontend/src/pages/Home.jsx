import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Palette, Truck, ShieldCheck, Star, Quote, Mail } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { products, artists } from "@/data/products";
import api from "@/api";

const stats = [
{ value: "2,400+", label: "Original artworks" },
{ value: "180+", label: "Independent artists" },
{ value: "45+", label: "Countries shipped" },
{ value: "4.9★", label: "Collector rating" }];


const perks = [
{ icon: Palette, title: "Curated weekly", desc: "Our curators handpick every drop so quality stays high." },
{ icon: Truck, title: "Worldwide shipping", desc: "Insured, tracked delivery straight from artist studios." },
{ icon: ShieldCheck, title: "Authenticity guaranteed", desc: "Signed certificate of authenticity with every piece." }];


const testimonials = [
{ name: "Priya S.", role: "Collector, Mumbai", quote: "Found my favorite living room piece here. The packaging and finish were museum quality." },
{ name: "Arjun M.", role: "Designer, Bengaluru", quote: "I commission 3D art from Riya every quarter. Artisana made discovery so easy." },
{ name: "Neha K.", role: "Architect, Delhi", quote: "Love that I support independent painters directly. Pricing feels fair and transparent." }];


export default function Home() {
  const [categoriesData, setCategoriesData] = useState([]);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

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

  const [featuredProducts, setFeaturedProducts] = useState(products.slice(0, 4));
  const [trendingProducts, setTrendingProducts] = useState(products.slice(4));
  const [heroItems, setHeroItems] = useState(products.slice(0, 10));

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        const [featuredRes, trendingRes, heroRes] = await Promise.all([
          api.get('/products?tags=Featured&limit=4'),
          api.get('/products?tags=Trending&limit=10'),
          api.get('/products?limit=5')
        ]);
        
        if (featuredRes.data?.success && featuredRes.data.data.length > 0) setFeaturedProducts(featuredRes.data.data);
        if (trendingRes.data?.success && trendingRes.data.data.length > 0) setTrendingProducts(trendingRes.data.data);
        if (heroRes.data?.success && heroRes.data.data.length > 0) setHeroItems(heroRes.data.data);
      } catch (error) {
        console.error("Error fetching home products:", error);
      }
    };
    fetchHomeProducts();
  }, []);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleHeroClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + heroItems.length) % heroItems.length);
      setIsAnimating(false);
    }, 700);
  };

  const currentItem = heroItems[currentIndex];
  const nextItemIndex = (currentIndex - 1 + heroItems.length) % heroItems.length;
  const nextItem = heroItems[nextItemIndex];
  const upcomingBgIndex = (currentIndex - 2 + heroItems.length) % heroItems.length;
  const upcomingBgItem = heroItems[upcomingBgIndex];

  return (
    <AppShell title="Discover">
      {/* Animated Hero - Responsive */}
      <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut" }} className="px-5 pt-2 md:px-0 md:pt-0">
        <div className="flex flex-col md:grid md:grid-cols-12 gap-6 md:h-[700px]">
          
          {/* Left Side (Top on mobile): Interactive Gallery */}
          <div className="md:col-span-12 lg:col-span-7 h-[450px] md:h-full relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-zinc-900 shadow-2xl cursor-pointer group" onClick={handleHeroClick}>
            {/* Layer 1: Upcoming Background */}
            <img src={upcomingBgItem.image} className="absolute inset-0 h-full w-full object-cover z-0" alt="" />
            <div className="absolute inset-0 bg-black/40 z-[1]" />

            {/* Layer 2: Transitioning Background */}
            <div className={`absolute inset-0 z-10 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${isAnimating ? 'p-[20%]' : 'p-0'}`}>
              <img 
                src={nextItem.image} 
                className={`h-full w-full object-cover transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${isAnimating ? 'rounded-3xl shadow-2xl' : 'rounded-none shadow-none'}`}
                alt=""
              />
              <div className={`absolute inset-0 bg-black/40 transition-opacity duration-700 ${isAnimating ? 'opacity-0' : 'opacity-100'}`} />
            </div>

            {/* Layer 3: Transitioning Foreground */}
            <div className={`absolute inset-0 z-20 flex items-center justify-center p-[20%] transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${isAnimating ? 'scale-75 opacity-0' : 'scale-100 opacity-100 pointer-events-none'}`}>
              <img 
                src={currentItem.image} 
                className="h-full w-full object-cover rounded-3xl shadow-2xl"
                alt=""
              />
              {/* <div className={`absolute bottom-[10%] left-0 right-0 text-center z-30 transition-opacity duration-400 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                <Link to={`/product/${currentItem._id || currentItem.id}`} className="bg-black/60 text-white px-5 py-2.5 rounded-full backdrop-blur-md font-semibold text-sm hover:bg-black/80 pointer-events-auto transition-colors inline-block border border-white/20 shadow-xl">
                  {currentIndex + 1} / {heroItems.length} — {currentItem.title}
                </Link>
              </div> */}
            </div>
            
            {/* Click Hint */}
            <div className={`absolute top-8 right-8 z-30 bg-black/50 text-white px-4 py-1.5 rounded-full backdrop-blur-md font-medium text-xs transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100 group-hover:scale-105'}`}>
              Click to cycle
            </div>
          </div>
          
          {/* Right Side (Bottom on mobile): Static Content */}
          <div className="md:col-span-12 lg:col-span-5 relative flex flex-col justify-center rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-foreground to-zinc-900 p-8 md:p-12 text-background shadow-2xl overflow-hidden">
            <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/30 blur-[100px]" />
            <div className="absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-gold/20 blur-[80px]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur-md text-white">
                <Sparkles className="h-3.5 w-3.5 text-gold" /> Exclusive Collection
              </div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                className="mt-6 md:mt-8 font-display text-4xl md:text-5xl lg:text-6xl leading-[1.1] font-bold tracking-tight text-white"
              >
                Discover <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-primary">masterpieces</span><br/> for modern spaces.
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                className="mt-6 text-lg leading-relaxed text-background/70 font-medium"
              >
                Elevate your environment with authentic original artworks — sourced directly from independent studios globally.
              </motion.p>
              
              <div className="mt-10 flex flex-col gap-4">
                <Link to="/explore" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-bold text-black shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:bg-zinc-100 w-full sm:w-auto">
                  Browse full gallery <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/profile" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-background/30 px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-background/10 backdrop-blur-sm w-full sm:w-auto">
                  Apply as artist
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-6 border-t border-white/10 pt-6">
                <div className="flex -space-x-3">
                  {artists.slice(0, 4).map((a) =>
                  <img key={a.id} src={a.avatar} alt={a.name} className="h-11 w-11 rounded-full border-2 border-zinc-900 object-cover shadow-sm transition-transform hover:scale-110 hover:z-10" />
                  )}
                </div>
                <div className="text-sm text-background/70 font-medium">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <Star className="h-4 w-4 fill-gold text-gold" /> 4.9/5 from 5,000+ collectors
                  </div>
                  Trusted globally in 45+ countries
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.8 }}
          className="mt-8 grid grid-cols-2 gap-4 rounded-[2rem] bg-card p-8 shadow-sm border border-border/40 sm:grid-cols-4"
        >
          {stats.map((s, i) =>
          <motion.div 
              key={s.label} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 + (i * 0.15), duration: 0.8 }}
              className="text-center group"
          >
              <div className="font-display text-3xl font-bold text-primary transition-transform duration-300 group-hover:scale-110">{s.value}</div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{s.label}</div>
            </motion.div>
          )}
        </motion.div>
      </motion.section>

      {/* Categories - Interactive List */}
      <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut" }} className="mt-8 px-5 md:mt-16 md:px-0">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-bold">Categories</h2>
          <Link to="/categories" className="text-sm font-semibold text-primary hover:underline">All categories →</Link>
        </div>
        
        {categoriesData.length > 0 ? (
          <div className="flex flex-col-reverse md:grid md:grid-cols-12 gap-4 md:gap-8 min-h-[400px]">
            {/* Left side: List of Categories */}
            <div className="md:col-span-5 flex flex-col justify-top pr-0 md:pr-8">
              {categoriesData.slice(0, 5).map((c, idx) => (
                <div
                  key={c._id || c.name}
                  onMouseEnter={() => setActiveCategoryIndex(idx)}
                  onClick={() => setActiveCategoryIndex(idx)}
                  className={`group flex items-center justify-between py-6 cursor-pointer transition-colors duration-300 border-b border-border/50 last:border-0 ${activeCategoryIndex === idx ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <span className={`font-display text-2xl md:text-3xl font-bold transition-transform duration-300 ${activeCategoryIndex === idx ? 'translate-x-2' : 'group-hover:translate-x-1'}`}>{c.name}</span>
                  <ArrowRight className={`h-6 w-6 transition-all duration-300 ${activeCategoryIndex === idx ? 'opacity-100 -translate-x-2' : 'opacity-0 translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'}`} />
                </div>
              ))}
            </div>
            
            {/* Right side: Image and Description */}
            <div className="md:col-span-7 relative h-[300px] md:h-[500px] rounded-[2rem] overflow-hidden bg-zinc-100 shadow-xl group block">
                {(() => {
                  const activeCat = categoriesData[activeCategoryIndex] || categoriesData[0];
                  return (
                    <Link to={`/explore?category=${activeCat._id}&categoryName=${encodeURIComponent(activeCat.name)}`} className="block w-full h-full relative">
                      {activeCat.image ? (
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
                      
                      <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white w-full">
                        <h3 className="font-display text-3xl md:text-5xl font-bold mb-2 md:mb-3">{activeCat.name}</h3>
                        {activeCat.description && (
                          <p className="text-white/80 text-sm md:text-lg line-clamp-2 max-w-xl">{activeCat.description}</p>
                        )}
                        <span className="mt-4 md:mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black shadow-lg transition-transform hover:-translate-y-1">
                          Explore {activeCat.name} <ArrowRight className="h-4 w-4" />
                        </span>
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

      {/* Sohrai Art Spotlight */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, margin: "-100px" }} 
        transition={{ duration: 0.8, ease: "easeOut" }} 
        className="mt-10 px-5 md:mt-20 md:px-0"
      >
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#f8f1de] p-10 md:p-20 shadow-xl border border-[#e2d5b8]">
          {/* Floral Vintage Image Background */}
          <img 
            src="https://png.pngtree.com/background/20210709/original/pngtree-gold-pattern-poster-background-picture-image_424792.jpg" 
            alt="Vintage Floral Pattern" 
            className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none mix-blend-multiply" 
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#dcb98a]/10 via-transparent to-[#ffffff]/40" />
          
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full border border-amber-700/20 bg-amber-700/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-900 mb-6"
            >
              <Sparkles className="h-3.5 w-3.5" /> Cultural Heritage
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-display text-4xl md:text-6xl font-bold text-amber-950 mb-8"
            >
              Sohrai Art
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: 0.6 }}
              className="text-lg md:text-xl leading-relaxed text-amber-900/80 font-medium"
            >
              More than just an art form, Sohrai art is the heartbeat of Jharkhand's villages. Created by tribal women, these beautiful wall paintings celebrate nature, harvest, animals, and the deep bond between people and the earth. Made with natural colors drawn from soil and stone, every line and pattern carries generations of stories, traditions, and love. In a world that is constantly changing, Sohrai art stands as a quiet reminder that true beauty is found in our roots. Every piece is not just handmade—it is a living memory of a culture that continues to inspire with its simplicity, warmth, and timeless grace.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Featured */}
      <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut" }} className="mt-7 md:mt-14">
        <div className="mb-3 flex items-end justify-between px-5 md:mb-5 md:px-0">
          <div>
            <h2 className="font-display text-xl font-bold md:text-3xl">Featured works</h2>
            <p className="text-xs text-muted-foreground md:text-sm">Hand-picked this week</p>
          </div>
          <Link to="/featured" className="hidden text-sm font-medium text-primary md:inline">View all featured →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-5 px-5 md:px-0">
          {featuredProducts.slice(0, 4).map((p) =>
            <ProductCard key={p._id || p.id} product={p} />
          )}
        </div>
      </motion.section>

      {/* Why Artisana - desktop only */}
      <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut" }} className="mt-14 hidden md:block">
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

      {/* Artists */}
      {/* <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut" }} className="mt-7 px-5 md:mt-14 md:px-0">
        <div className="mb-3 flex items-end justify-between md:mb-5">
          <h2 className="font-display text-xl font-bold md:text-3xl">Trending artists</h2>
          <Link to="/explore" className="hidden text-sm font-medium text-primary md:inline">Discover more →</Link>
        </div>
        <div className="space-y-2 md:grid md:grid-cols-3 md:gap-5 md:space-y-0">
          {artists.slice(0, 3).map((a) =>
          <div key={a.id} className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft md:flex-col md:items-start md:p-6">
              <img src={a.avatar} alt={a.name} className="h-12 w-12 shrink-0 rounded-full object-cover md:h-20 md:w-20" />
              <div className="min-w-0 flex-1 md:w-full">
                <div className="truncate font-semibold md:text-lg">{a.name}</div>
                <div className="text-xs text-muted-foreground md:text-sm">{a.works} works · {a.followers} followers</div>
              </div>
              <button className="shrink-0 rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background md:w-full md:py-2">Follow</button>
            </div>
          )}
        </div>
      </motion.section> */}

      {/* Trending grid */}
      <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut" }} className="mt-7 px-5 md:mt-14 md:px-0">
        <div className="mb-3 flex items-end justify-between md:mb-5">
          <h2 className="font-display text-xl font-bold md:text-3xl">Trending now</h2>
          <Link to="/trending" className="hidden text-sm font-medium text-primary md:inline">View all trending →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-5 px-5 md:px-0">
          {trendingProducts.slice(0, 4).map((p) => <ProductCard key={p._id || p.id} product={p} />)}
        </div>
      </motion.section>

      {/* Testimonials - desktop only */}
      <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "easeOut" }} className="mt-14 hidden md:block">
        <div className="mb-5 text-center">
          <h2 className="font-display text-3xl font-bold">Loved by collectors</h2>
          <p className="text-sm text-muted-foreground">Real reviews from real buyers</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t) =>
          <div key={t.name} className="rounded-3xl bg-card p-7 shadow-soft">
              <Quote className="h-6 w-6 text-primary/60" />
              <p className="mt-3 text-sm leading-relaxed text-foreground/85">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <div className="mt-3 text-sm font-semibold">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.role}</div>
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
            <form className="flex flex-col gap-2 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                required
                placeholder="you@studio.com"
                className="flex-1 rounded-full bg-background/10 px-5 py-3 text-sm text-background outline-none ring-1 ring-background/20 placeholder:text-background/50 focus:ring-background/60" />
              
              <button className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:scale-[1.02]">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </motion.section>
    </AppShell>);

}
