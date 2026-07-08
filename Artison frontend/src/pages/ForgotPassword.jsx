import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, Loader2, KeyRound } from "lucide-react";
import api from "@/api";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = Email, 2 = Reset
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/check-email", { email });
      if (data.exists) {
        setStep(2);
        toast.success("OTP sent to your email.");
      } else {
        toast.error("No account found with this email.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/reset-password", { email, otp, newPassword });
      if (data.success) {
        toast.success("Password reset successfully! Please login.");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP or request failed.");
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
          <Link to="/login" className="absolute -top-12 -left-2 sm:-left-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to login
          </Link>

          <div className="space-y-2 text-center lg:text-left">
            <h1 className="font-display text-3xl font-bold tracking-tight">Forgot Password</h1>
            <p className="text-sm text-muted-foreground">
              {step === 1 ? "Enter your email to receive a password reset OTP" : "Enter the OTP and your new password"}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium leading-none">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-input bg-transparent px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-shadow"
                    placeholder="you@example.com" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background shadow-soft transition-colors hover:bg-foreground/90 disabled:opacity-50"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium leading-none">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="email" 
                      disabled
                      value={email}
                      className="flex h-10 w-full rounded-xl border border-input bg-secondary px-10 py-2 text-sm text-muted-foreground cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium leading-none">Enter OTP</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-input bg-transparent px-10 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-shadow"
                      placeholder="6-digit OTP" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium leading-none">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="password" 
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-input bg-transparent px-10 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-shadow"
                      placeholder="••••••••" 
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background shadow-soft transition-colors hover:bg-foreground/90 disabled:opacity-50"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
