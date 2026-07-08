import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Mail, Lock, Loader2, KeyRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/api";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("password"); // "password" or "otp"
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const { login, setUser } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!otpSent) {
        // Check email and send OTP
        const { data } = await api.post("/auth/check-email", { email });
        if (data.exists) {
          setOtpSent(true);
          toast.success("OTP sent to your email (check console).");
        } else {
          toast.error("No account found with this email.");
        }
      } else {
        // Verify OTP
        const { data } = await api.post("/auth/verify-otp", { email, otp });
        if (data.success) {
          localStorage.setItem('token', data.data.token);
          setUser(data.data.user);
          toast.success("Logged in successfully!");
          const from = location.state?.from?.pathname || "/";
          navigate(from, { replace: true });
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/check-email", { email });
      if (data.exists) {
        toast.success("OTP resent to your email.");
      } else {
        toast.error("No account found with this email.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-canvas">
        <img 
          src="https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=1200&q=80" 
          alt="Artisana Gallery" 
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        <div className="absolute bottom-10 left-10 text-primary-foreground max-w-md">
          <h2 className="font-display text-4xl font-bold leading-tight">Where art meets the collector.</h2>
          <p className="mt-4 text-primary-foreground/80">Join thousands of artists and collectors in the premier marketplace for original art.</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-sm space-y-8 relative">
          {/* Back button */}
          <Link to="/" className="absolute -top-12 -left-2 sm:-left-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to gallery
          </Link>

          <div className="space-y-2 text-center lg:text-left">
            <h1 className="font-display text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              {method === "password" ? "Enter your credentials to access your account" : "Enter your email to login with OTP"}
            </p>
          </div>

          <form onSubmit={method === "password" ? handlePasswordSubmit : handleOtpSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    disabled={otpSent}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-input bg-transparent px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-shadow"
                    placeholder="you@example.com" 
                  />
                </div>
              </div>

              {method === "password" && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium leading-none">Password</label>
                    <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-input bg-transparent px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-shadow"
                      placeholder="••••••••" 
                    />
                  </div>
                </div>
              )}

              {method === "otp" && otpSent && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium leading-none">
                      Enter OTP
                    </label>
                    <button 
                      type="button" 
                      onClick={resendOtp} 
                      disabled={loading}
                      className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
                    >
                      Resend OTP?
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      required
                      value={otp}
                      maxLength={6}
                      onChange={(e) => setOtp(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-input bg-transparent px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-shadow"
                      placeholder="6-digit OTP" 
                    />
                  </div>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background shadow-soft transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {method === "password" ? "Sign In" : otpSent ? "Verify OTP" : "Send OTP"}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
          </div>

          <button 
            type="button"
            onClick={() => {
              setMethod(method === "password" ? "otp" : "password");
              setOtpSent(false);
              setOtp("");
            }}
            className="w-full inline-flex items-center justify-center rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {method === "password" ? "Login with OTP" : "Login with Password"}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
