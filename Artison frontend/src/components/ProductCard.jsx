import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { formatPrice } from "@/data/products";

export function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group block overflow-hidden rounded-2xl bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      
      <div className="relative aspect-[4/5] overflow-hidden bg-canvas">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <button
          onClick={(e) => e.preventDefault()}
          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/85 text-foreground/70 backdrop-blur transition hover:text-primary"
          aria-label="Save">
          
          <Heart className="h-4 w-4" />
        </button>
        <span className="absolute left-2 top-2 rounded-full bg-foreground/85 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-background">
          {product.category}
        </span>
      </div>
      <div className="space-y-1.5 p-4">
        <h3 className="truncate font-display text-lg font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">{product.title}</h3>
        <p className="truncate text-sm font-medium text-muted-foreground">{product.artist}</p>
        <div className="pt-2 font-display text-base font-bold text-foreground">{formatPrice(product.price)}</div>
      </div>
    </Link>);

}