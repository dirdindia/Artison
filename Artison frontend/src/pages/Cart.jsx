import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const subtotal = cart.reduce((s, c) => s + c.product.price * c.qty, 0);
  const shipping = cart.length ? 499 : 0;

  if (cart.length === 0) {
    return (
      <AppShell title="Cart">
        <div className="flex flex-col items-center px-8 pt-20 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-accent">
            <ShoppingBag className="h-8 w-8 text-accent-foreground" />
          </div>
          <h2 className="mt-5 font-display text-2xl font-bold">Your cart is empty</h2>
          <p className="mt-2 text-sm text-muted-foreground">Discover art you'll love and add it here.</p>
          <Link to="/explore" className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft">
            Explore gallery
          </Link>
        </div>
      </AppShell>);

  }

  return (
    <AppShell title="Cart">
      <div className="px-5">
        <div className="space-y-3">
          {cart.map(({ product, qty }) =>
          <div key={product.id} className="flex gap-3 rounded-2xl bg-card p-3 shadow-soft">
              <img src={product.image} alt={product.title} className="h-20 w-20 shrink-0 rounded-xl object-cover" />
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="truncate text-sm font-semibold">{product.title}</div>
                <div className="truncate text-xs text-muted-foreground">{product.artist}</div>
                <div className="mt-1 font-display text-sm font-bold text-primary">{formatPrice(product.price * qty)}</div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 rounded-full bg-secondary px-1 py-1">
                    <button onClick={() => updateQuantity(product.id, -1)} className="grid h-6 w-6 place-items-center rounded-full bg-background"><Minus className="h-3 w-3" /></button>
                    <span className="w-5 text-center text-xs font-semibold">{qty}</span>
                    <button onClick={() => updateQuantity(product.id, 1)} className="grid h-6 w-6 place-items-center rounded-full bg-background"><Plus className="h-3 w-3" /></button>
                  </div>
                  <button onClick={() => removeFromCart(product.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-2 rounded-2xl bg-card p-4 shadow-soft">
          <Row label="Subtotal" value={formatPrice(subtotal)} />
          <Row label="Shipping" value={formatPrice(shipping)} />
          <div className="my-1 border-t border-border" />
          <Row label="Total" value={formatPrice(subtotal + shipping)} bold />
          <Link to="/checkout" className="mt-3 hidden w-full rounded-2xl bg-gradient-warm py-3.5 text-sm font-semibold text-primary-foreground shadow-soft md:block text-center">
            Checkout · {formatPrice(subtotal + shipping)}
          </Link>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-20 z-30 mx-auto w-full max-w-md px-5 md:hidden">
        <Link to="/checkout" className="w-full rounded-2xl bg-gradient-warm py-3.5 text-sm font-semibold text-primary-foreground shadow-card text-center block">
          Checkout · {formatPrice(subtotal + shipping)}
        </Link>
      </div>
    </AppShell>);

}

function Row({ label, value, bold }) {
  return (
    <div className={`flex items-center justify-between text-sm ${bold ? "font-display text-base font-bold" : "text-foreground/80"}`}>
      <span>{label}</span><span>{value}</span>
    </div>);

}