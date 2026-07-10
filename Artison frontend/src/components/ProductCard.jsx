import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";

export function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };
  return (
    <Link
      to={`/product/${product._id || product.id}`}
      className="group block overflow-hidden rounded-2xl bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      
      <div className="relative aspect-[4/5] overflow-hidden bg-canvas flex items-center justify-center p-2">
        <img
          src={product.image}
          alt={product.name || product.title}
          loading="lazy"
          className="max-h-full max-w-full rounded-2xl object-cover shadow-sm transition-transform duration-700 ease-out group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <button
          onClick={(e) => e.preventDefault()}
          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/85 text-foreground/70 backdrop-blur transition hover:text-primary"
          aria-label="Save">
          
          <Heart className="h-4 w-4" />
        </button>
        <span className="absolute left-2 top-2 rounded-full bg-foreground/85 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-background">
          {product.category?.name || product.category || 'Art'}
        </span>
      </div>
      <div className="space-y-1.5 p-4">
        <h3 className="truncate font-display text-lg font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">{product.name || product.title}</h3>
        <p className="truncate text-sm font-medium text-muted-foreground">{product.artist || 'Independent Artist'}</p>
        <div className="flex items-center justify-between pt-2">
          <div className="font-display text-base font-bold text-foreground">{formatPrice(product.price)}</div>
          <button 
            onClick={handleAddToCart}
            className="rounded-full bg-primary/10 p-2 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            title="Add to Cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>);

}
