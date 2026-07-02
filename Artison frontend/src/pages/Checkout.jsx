import { Link } from "react-router-dom";
import { ChevronLeft, CreditCard, MapPin, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Country, State, City as CityData } from "country-state-city";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);

  // Pre-fill fields from user profile
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [street, setStreet] = useState(user?.address?.street || "");
  const [country, setCountry] = useState(user?.address?.country || "");
  const [stateCode, setStateCode] = useState(user?.address?.state || "");
  const [city, setCity] = useState(user?.address?.city || "");
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || "");

  const subtotal = cart.reduce((s, c) => s + c.product.price * c.qty, 0);
  const shipping = cart.length ? 499 : 0;
  const total = subtotal + shipping;

  const handleCheckout = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      setSuccess(true);
      if (clearCart) clearCart();
    }
  };

  if (success) {
    return (
      <AppShell title="Order Confirmed">
        <div className="flex h-[80vh] flex-col items-center justify-center px-8 text-center">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-green-100 text-green-600 mb-6">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground">Payment Successful!</h2>
          <p className="mt-4 text-muted-foreground max-w-sm text-center">
            Your order has been placed successfully. We will send you an email confirmation shortly.
          </p>
          <Link to="/" className="mt-8 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft">
            Continue Shopping
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Checkout">
      <div className="px-5 pb-24">
        {/* Progress Bar */}
        <div className="mb-8 flex items-center justify-center space-x-4 px-4">
          <div className="flex flex-col items-center">
            <div className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>1</div>
            <span className="mt-2 text-xs font-semibold text-muted-foreground">Address</span>
          </div>
          <div className={`h-0.5 w-16 ${step >= 2 ? "bg-primary" : "bg-secondary"}`}></div>
          <div className="flex flex-col items-center">
            <div className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>2</div>
            <span className="mt-2 text-xs font-semibold text-muted-foreground">Payment</span>
          </div>
        </div>

        <form onSubmit={handleCheckout} className="space-y-6">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 space-y-4">
              <div className="rounded-2xl bg-card p-5 shadow-soft">
                <div className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <MapPin className="h-5 w-5 text-primary" />
                  Shipping Address
                </div>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <input required type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border-none bg-secondary/50 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20" />
                    <input required type="tel" placeholder="Mobile No." value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border-none bg-secondary/50 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <input required type="text" placeholder="Street Address" value={street} onChange={(e) => setStreet(e.target.value)} className="w-full rounded-xl border-none bg-secondary/50 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20" />
                  <div className="grid grid-cols-2 gap-4">
                    <select value={country} onChange={(e) => { setCountry(e.target.value); setStateCode(""); setCity(""); }} required className="w-full rounded-xl border-none bg-secondary/50 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20">
                      <option value="">Country</option>
                      {Country.getAllCountries().map((c) => (<option key={c.isoCode} value={c.isoCode}>{c.name}</option>))}
                    </select>
                    <select value={stateCode} onChange={(e) => { setStateCode(e.target.value); setCity(""); }} disabled={!country} required className="w-full rounded-xl border-none bg-secondary/50 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 disabled:opacity-50">
                      <option value="">State / Province</option>
                      {country && State.getStatesOfCountry(country).map((s) => (<option key={s.isoCode} value={s.isoCode}>{s.name}</option>))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <select value={city} onChange={(e) => setCity(e.target.value)} disabled={!stateCode} required className="w-full rounded-xl border-none bg-secondary/50 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 disabled:opacity-50">
                      <option value="">City</option>
                      {country && stateCode && CityData.getCitiesOfState(country, stateCode).map((c) => (<option key={c.name} value={c.name}>{c.name}</option>))}
                    </select>
                    <input required type="text" placeholder="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="w-full rounded-xl border-none bg-secondary/50 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 space-y-4">
              <div className="rounded-2xl bg-card p-5 shadow-soft">
                <div className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Method
                </div>
                <div className="space-y-4">
                  <input required type="text" placeholder="Card Number" className="w-full rounded-xl border-none bg-secondary/50 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20" />
                  <div className="flex gap-4">
                    <input required type="text" placeholder="MM/YY" className="w-full rounded-xl border-none bg-secondary/50 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20" />
                    <input required type="text" placeholder="CVC" className="w-full rounded-xl border-none bg-secondary/50 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <input required type="text" placeholder="Cardholder Name" className="w-full rounded-xl border-none bg-secondary/50 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>

              {/* Order Summary */}
              <div className="rounded-2xl bg-card p-5 shadow-soft">
                <h3 className="mb-3 font-semibold">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{formatPrice(shipping)}</span></div>
                  <div className="my-2 border-t border-border" />
                  <div className="flex justify-between font-display text-base font-bold text-foreground"><span>Total</span><span>{formatPrice(total)}</span></div>
                </div>
              </div>
            </div>
          )}

          <div className="fixed inset-x-0 bottom-20 z-30 mx-auto w-full max-w-md px-5 md:static md:bottom-auto">
            <button type="submit" className="w-full rounded-2xl bg-gradient-warm py-4 text-sm font-bold text-primary-foreground shadow-card transition-transform active:scale-[0.98]">
              {step === 1 ? "Proceed to Payment" : `Pay ${formatPrice(total)}`}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
