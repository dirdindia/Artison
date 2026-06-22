import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Share2, Shield, Truck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProductCard } from "@/components/ProductCard";
import { products, formatPrice, artists } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === id);
  if (!product) return <div className="p-8 text-center">Not found.</div>;

  const artist = artists.find((a) => a.id === product.artistId);
  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  return (
    <AppShell title={product.category}>
      <div className="px-5">
        <div className="mb-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="grid h-10 w-10 place-items-center rounded-full bg-card shadow-soft">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            <button className="grid h-10 w-10 place-items-center rounded-full bg-card shadow-soft"><Heart className="h-4 w-4" /></button>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-card shadow-soft"><Share2 className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-canvas shadow-card">
          <img src={product.image} alt={product.title} className="aspect-[4/5] w-full object-cover" />
        </div>

        <div className="mt-4">
          <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
            {product.category}
          </span>
          <h1 className="mt-2 font-display text-2xl font-bold leading-tight md:text-4xl">{product.title}</h1>
          <div className="mt-1 font-display text-2xl font-bold text-primary md:text-3xl">{formatPrice(product.price)}</div>
          <button
            onClick={() => addToCart(product)}
            className="mt-4 hidden w-full rounded-2xl bg-gradient-warm py-3.5 text-sm font-semibold text-primary-foreground shadow-soft md:block md:max-w-xs">
            
            Add to cart
          </button>
        </div>

        {artist &&
        <Link to="/profile" className="mt-4 flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft">
            <img src={artist.avatar} alt={artist.name} className="h-11 w-11 shrink-0 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{artist.name}</div>
              <div className="text-xs text-muted-foreground">{artist.followers} followers</div>
            </div>
            <button className="shrink-0 rounded-full border border-foreground/20 px-3 py-1.5 text-xs font-medium">Follow</button>
          </Link>
        }

        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <Spec label="Medium" value={product.medium} />
          <Spec label="Size" value={product.size} />
          <Spec label="Year" value={String(product.year)} />
        </div>

        <div className="mt-5">
          <h3 className="font-display text-lg font-bold">About the piece</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">{product.description}</p>
        </div>

        <div className="mt-5 space-y-2">
          <Perk icon={Truck} title="Free worldwide shipping" sub="Insured & tracked delivery" />
          <Perk icon={Shield} title="Certificate of authenticity" sub="Signed by the artist" />
        </div>

        <div className="mt-7">
          <h3 className="mb-3 font-display text-lg font-bold">More like this</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-5 lg:grid-cols-5">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-20 z-30 mx-auto w-full max-w-md px-5 md:hidden">
        <button
          onClick={() => addToCart(product)}
          className="w-full rounded-2xl bg-gradient-warm py-3.5 text-sm font-semibold text-primary-foreground shadow-card transition active:scale-[0.98]">
          
          Add to cart · {formatPrice(product.price)}
        </button>
      </div>
    </AppShell>);

}

function Spec({ label, value }) {
  return (
    <div className="rounded-xl bg-card p-2.5 shadow-soft">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-0.5 truncate text-xs font-semibold">{value}</div>
    </div>);

}

function Perk({ icon: Icon, title, sub }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">{title}</div>
        <div className="truncate text-xs text-muted-foreground">{sub}</div>
      </div>
    </div>);

}