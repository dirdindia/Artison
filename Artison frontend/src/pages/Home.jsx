import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

  const featured = products.slice(0, 4);
  const trending = products.slice(4);
  const spotlight = products[0];

  return (
    <AppShell title="Discover">
      {/* Mobile hero */}
      <section className="px-5 pt-2 md:hidden">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-foreground to-foreground/90 p-6 text-background shadow-2xl">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/40 blur-[3xl]" />
          <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-gold/20 blur-[3xl]" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-background/20 bg-background/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-gold" /> Premium collection
            </div>
            <h1 className="mt-5 font-display text-4xl leading-tight font-bold tracking-tight">
              Curated art for<br />modern spaces.
            </h1>
            <p className="mt-3 max-w-[18rem] text-sm leading-relaxed text-background/80">
              Discover extraordinary original paintings, sculptures, and digital art directly from top artists.
            </p>
            <Link
              to="/explore"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-background px-5 py-2.5 text-sm font-semibold text-foreground shadow-lg transition-transform hover:scale-105 active:scale-95">
              
              Enter gallery <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Desktop hero */}
      <section className="hidden md:block">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-7 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-foreground to-zinc-900 p-12 text-background shadow-2xl transition-all duration-500 hover:shadow-3xl">
            <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/30 blur-[100px]" />
            <div className="absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-gold/20 blur-[80px]" />
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-gold" /> Hand-picked weekly
              </div>
              <h1 className="mt-6 font-display text-5xl lg:text-7xl leading-[1.05] font-bold tracking-tight text-white">
                The world's most <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-primary">exclusive</span> art.
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-background/70 font-medium">
                Elevate your space with authentic paintings, sculptures, and digital prints — sourced directly from independent studios globally.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/explore" className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-bold text-black shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:bg-zinc-100">
                  Browse gallery <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/profile" className="inline-flex items-center gap-2 rounded-2xl border border-background/30 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-background/10 backdrop-blur-sm">
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
          
          <div className="col-span-12 lg:col-span-5 relative overflow-hidden rounded-[2.5rem] shadow-2xl group cursor-pointer">
            <img src={spotlight.image} alt={spotlight.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
            <div className="relative flex h-full min-h-[480px] flex-col justify-end p-8 text-white z-10 transition-transform duration-500 group-hover:-translate-y-2">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest backdrop-blur-md text-white border border-white/30">
                <ShieldCheck className="h-3 w-3" /> Editor's pick
              </span>
              <h3 className="mt-4 font-display text-3xl font-bold tracking-tight">{spotlight.title}</h3>
              <p className="mt-1 text-base font-medium text-white/80">by {spotlight.artist} · {spotlight.medium}</p>
              <Link to={`/product/${spotlight.id}`} className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black transition-colors hover:bg-zinc-200 shadow-lg">
                View masterpiece <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-8 grid grid-cols-2 gap-4 rounded-[2rem] bg-card p-8 shadow-sm border border-border/40 sm:grid-cols-4">
          {stats.map((s) =>
          <div key={s.label} className="text-center group">
              <div className="font-display text-3xl font-bold text-primary transition-transform duration-300 group-hover:scale-110">{s.value}</div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{s.label}</div>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="mt-6 px-5 md:mt-12 md:px-0">
        <div className="mb-3 flex items-end justify-between md:mb-5">
          <div>
            <h2 className="font-display text-xl font-bold md:text-3xl">Browse categories</h2>
            <p className="hidden text-sm text-muted-foreground md:block">Find the medium that speaks to you</p>
          </div>
          <Link to="/categories" className="text-xs font-medium text-primary md:text-sm">See all</Link>
        </div>
        <div className="grid grid-cols-4 gap-2 md:gap-5">
          {categoriesData.slice(0, 4).map((c) =>
          <Link
            key={c._id || c.name}
            to={`/explore?category=${c._id}&categoryName=${encodeURIComponent(c.name)}`}
            className="flex flex-col items-center gap-1.5 rounded-2xl bg-card p-3 text-center shadow-soft transition hover:bg-accent md:gap-3 md:p-8">
            
              {c.image ? (
                <img src={c.image} alt={c.name} className="h-10 w-10 md:h-14 md:w-14 object-cover rounded-full" />
              ) : (
                <span className="text-2xl md:text-5xl">🎨</span>
              )}
              <span className="truncate text-[10px] font-medium md:text-base">{c.name}</span>
            </Link>
          )}
        </div>
      </section>

      {/* Featured */}
      <section className="mt-7 md:mt-14">
        <div className="mb-3 flex items-end justify-between px-5 md:mb-5 md:px-0">
          <div>
            <h2 className="font-display text-xl font-bold md:text-3xl">Featured works</h2>
            <p className="text-xs text-muted-foreground md:text-sm">Hand-picked this week</p>
          </div>
          <Link to="/explore" className="hidden text-sm font-medium text-primary md:inline">View all featured →</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto px-5 pb-2 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {featured.map((p) =>
          <div key={p.id} className="w-44 shrink-0 md:w-auto">
              <ProductCard product={p} />
            </div>
          )}
        </div>
      </section>

      {/* Why Artisana - desktop only */}
      <section className="mt-14 hidden md:block">
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
      </section>

      {/* Artists */}
      <section className="mt-7 px-5 md:mt-14 md:px-0">
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
      </section>

      {/* Trending grid */}
      <section className="mt-7 px-5 md:mt-14 md:px-0">
        <h2 className="mb-3 font-display text-xl font-bold md:mb-5 md:text-3xl">Trending now</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-5 lg:grid-cols-5">
          {trending.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Testimonials - desktop only */}
      <section className="mt-14 hidden md:block">
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
      </section>

      {/* CTA / Newsletter */}
      <section className="mt-10 px-5 pb-6 md:mt-16 md:px-0 md:pb-10">
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
      </section>
    </AppShell>);

}