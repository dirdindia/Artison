import { Link } from "react-router-dom";
import { ChevronLeft, CreditCard, MapPin, CheckCircle2, Mail, KeyRound, Loader2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Country, State, City as CityData } from "country-state-city";
import api from "@/api";
import { toast } from "sonner";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user, setUser } = useAuth();
  
  // Step 0: Identity, Step 1: Address, Step 2: Payment
  const [step, setStep] = useState(user ? 1 : 0);
  const [success, setSuccess] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");

  // Identity fields
  const [email, setEmail] = useState(user?.email || "");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [checkingEmail, setCheckingEmail] = useState(false);

  // Pre-fill fields from user profile
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [street, setStreet] = useState(user?.address?.street || "");
  const [country, setCountry] = useState(user?.address?.country || "");
  const [stateCode, setStateCode] = useState(user?.address?.state || "");
  const [city, setCity] = useState(user?.address?.city || "");
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || "");

  useEffect(() => {
    if (user && step === 0) {
      setStep(1);
    }
  }, [user, step]);

  const subtotal = cart.reduce((s, c) => s + c.product.price * c.qty, 0);
  const shipping = cart.length ? 499 : 0;
  const initialTotal = subtotal + shipping;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = initialTotal - discountAmount;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setApplyingCoupon(true);
    setCouponError("");
    try {
      const { data } = await api.post("/coupons/validate", {
        code: couponCode,
        cartTotal: initialTotal,
        cartItems: getFormattedCartItems()
      });
      if (data.success) {
        setAppliedCoupon(data.data);
        toast.success("Coupon applied successfully!");
      }
    } catch (error) {
      setCouponError(error.response?.data?.message || "Invalid coupon");
      setAppliedCoupon(null);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setCouponError("");
    toast.success("Coupon removed");
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const getFormattedCartItems = () => cart.map(item => ({
    name: item.product.name,
    qty: item.qty,
    image: item.product.image || (item.product.images && item.product.images[0]) || "",
    price: item.product.price,
    product: item.product._id || item.product.id,
  }));

  const verifyPayment = async (response) => {
    try {
      const verifyRes = await api.post("/orders/verify", {
        paymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
      });

      if (verifyRes.data.success) {
        setSuccess(true);
        if (clearCart) clearCart();
        toast.success("Payment successful!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to verify payment");
    }
  };

  const startPayment = async () => {
    setIsProcessingPayment(true);
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      setIsProcessingPayment(false);
      return toast.error("Razorpay SDK failed to load. Are you online?");
    }

    try {
      const orderPayload = {
        amount: initialTotal, // Send initial total, backend calculates final price
        orderItems: getFormattedCartItems(),
        shippingAddress: { street, city, state: stateCode, country, postalCode },
        paymentMethod: "Razorpay",
        couponCode: appliedCoupon ? appliedCoupon.code : null
      };

      if (!user) {
        orderPayload.guestEmail = email;
        orderPayload.guestName = name;
        orderPayload.guestPhone = phone;
      }

      // 1. Create order on backend
      const { data } = await api.post("/orders/razorpay", orderPayload);

      const { data: orderData, key_id } = data;

      // 2. Open Razorpay Popup
      const options = {
        key: key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Artisna",
        description: "Order Payment",
        order_id: orderData.id,
        handler: verifyPayment, 
        prefill: { name, contact: phone, email },
        theme: { color: "#6366f1" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        setIsProcessingPayment(false);
        toast.error(response.error.description || "Payment failed");
      });
      
      paymentObject.open();
      
      // We set it false after opening the modal so the button doesn't stay stuck loading 
      // if the user closes the modal without paying.
      setIsProcessingPayment(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to initialize payment");
      setIsProcessingPayment(false);
    }
  };

  const handleIdentitySubmit = async (e) => {
    e.preventDefault();
    if (otpSent) {
      // Verify OTP
      try {
        const { data } = await api.post("/auth/verify-otp", { email, otp });
        if (data.success) {
          localStorage.setItem('token', data.data.token);
          setUser(data.data.user);
          
          // Auto fill details
          const u = data.data.user;
          setName(u.name || "");
          setPhone(u.phone || "");
          setStreet(u.address?.street || "");
          setCountry(u.address?.country || "");
          setStateCode(u.address?.state || "");
          setCity(u.address?.city || "");
          setPostalCode(u.address?.postalCode || "");
          
          toast.success("Logged in successfully!");
          setStep(1);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Invalid OTP");
      }
    } else {
      // Check Email
      setCheckingEmail(true);
      try {
        const { data } = await api.post("/auth/check-email", { email });
        if (data.exists) {
          setOtpSent(true);
          toast.info("An account exists with this email. Please enter the OTP sent to your email.");
        } else {
          setStep(1); // Proceed as guest
        }
      } catch (error) {
        toast.error("Error checking email");
      } finally {
        setCheckingEmail(false);
      }
    }
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      startPayment();
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
          {!user && (
            <>
              <div className="flex flex-col items-center">
                <div className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${step >= 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>1</div>
                <span className="mt-2 text-xs font-semibold text-muted-foreground">Identity</span>
              </div>
              <div className={`h-0.5 w-8 ${step >= 1 ? "bg-primary" : "bg-secondary"}`}></div>
            </>
          )}
          <div className="flex flex-col items-center">
            <div className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{user ? '1' : '2'}</div>
            <span className="mt-2 text-xs font-semibold text-muted-foreground">Address</span>
          </div>
          <div className={`h-0.5 w-8 ${step >= 2 ? "bg-primary" : "bg-secondary"}`}></div>
          <div className="flex flex-col items-center">
            <div className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{user ? '2' : '3'}</div>
            <span className="mt-2 text-xs font-semibold text-muted-foreground">Payment</span>
          </div>
        </div>

        {step === 0 ? (
          <form onSubmit={handleIdentitySubmit} className="space-y-6">
            <div className="animate-in fade-in slide-in-from-right-4 space-y-4">
              <div className="rounded-2xl bg-card p-5 shadow-soft">
                <div className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Mail className="h-5 w-5 text-primary" />
                  Contact Information
                </div>
                <div className="space-y-4">
                  <input required type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} disabled={otpSent} className="w-full rounded-xl border-none bg-secondary/50 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 disabled:opacity-50" />
                  
                  {otpSent && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <KeyRound className="h-4 w-4" /> Enter OTP
                      </div>
                      <input required type="text" placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} className="w-full rounded-xl border-none bg-secondary/50 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="fixed inset-x-0 bottom-20 z-30 mx-auto w-full max-w-md px-5 md:static md:bottom-auto">
              <button type="submit" disabled={checkingEmail} className="w-full rounded-2xl bg-gradient-warm py-4 text-sm font-bold text-primary-foreground shadow-card transition-transform active:scale-[0.98] disabled:opacity-70">
                {checkingEmail ? "Checking..." : otpSent ? "Verify & Continue" : "Continue"}
              </button>
            </div>
          </form>
        ) : (
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
                <div className="rounded-2xl bg-card p-5 shadow-soft text-center">
                  <div className="mb-4 flex items-center justify-center gap-2 text-lg font-semibold">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Secure Checkout
                  </div>
                  <p className="text-sm text-muted-foreground">You will be redirected to Razorpay to complete your payment securely.</p>
                </div>

                {/* Coupon Section */}
                <div className="rounded-2xl bg-card p-5 shadow-soft">
                  <h3 className="mb-3 font-semibold">Have a Coupon?</h3>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter coupon code" 
                      value={couponCode} 
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      disabled={appliedCoupon || applyingCoupon}
                      className="w-full rounded-xl border-none bg-secondary/50 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 disabled:opacity-50 uppercase" 
                    />
                    {!appliedCoupon ? (
                      <button 
                        type="button" 
                        onClick={handleApplyCoupon}
                        disabled={!couponCode || applyingCoupon}
                        className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                      >
                        {applyingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                      </button>
                    ) : (
                      <button 
                        type="button" 
                        onClick={handleRemoveCoupon}
                        className="rounded-xl bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {couponError && <p className="mt-2 text-xs text-destructive">{couponError}</p>}
                  {appliedCoupon && <p className="mt-2 text-xs text-green-600 font-semibold">Coupon applied! ₹{appliedCoupon.discountAmount} off</p>}
                </div>

                {/* Order Summary */}
                <div className="rounded-2xl bg-card p-5 shadow-soft">
                  <h3 className="mb-3 font-semibold">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                    <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{formatPrice(shipping)}</span></div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600 font-medium"><span>Discount ({appliedCoupon.code})</span><span>-{formatPrice(appliedCoupon.discountAmount)}</span></div>
                    )}
                    <div className="my-2 border-t border-border" />
                    <div className="flex justify-between font-display text-base font-bold text-foreground"><span>Total</span><span>{formatPrice(total)}</span></div>
                  </div>
                </div>
              </div>
            )}

            <div className="fixed inset-x-0 bottom-20 z-30 mx-auto w-full max-w-md px-5 md:static md:bottom-auto">
              {step === 1 && (
                <button type="submit" className="w-full rounded-2xl bg-gradient-warm py-4 text-sm font-bold text-primary-foreground shadow-card transition-transform active:scale-[0.98]">
                  Proceed to Payment
                </button>
              )}
              {step === 2 && (
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="rounded-2xl bg-secondary px-6 py-4 text-sm font-bold text-foreground transition-transform active:scale-[0.98]">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button type="submit" disabled={isProcessingPayment} className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-warm py-4 text-sm font-bold text-primary-foreground shadow-card transition-transform active:scale-[0.98] disabled:opacity-70">
                    {isProcessingPayment && <Loader2 className="h-5 w-5 animate-spin" />}
                    {isProcessingPayment ? "Processing..." : `Pay ${formatPrice(total)}`}
                  </button>
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    </AppShell>
  );
}
