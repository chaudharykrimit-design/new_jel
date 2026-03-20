import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Login = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });

  // If already logged in, redirect
  if (user) {
    navigate(user.role === "admin" ? "/admin" : "/account");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill all required fields");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, phone: form.phone });
      toast.success("Account created! Welcome to Aurum Jewels.");
      navigate("/");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-border bg-background px-4 py-3 text-sm font-body focus:border-primary focus:outline-none transition-colors";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl text-foreground">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-muted-foreground text-sm font-body mt-2">
              {mode === "login" ? "Sign in to your Aurum Jewels account" : "Join the Aurum Jewels family"}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex mb-6 border border-border">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-3 text-xs tracking-[0.15em] uppercase font-body font-semibold transition-colors ${
                mode === "login" ? "bg-primary text-primary-foreground" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-3 text-xs tracking-[0.15em] uppercase font-body font-semibold transition-colors ${
                mode === "register" ? "bg-primary text-primary-foreground" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              Register
            </button>
          </div>

          <div className="border border-border p-8">
            {mode === "login" ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="text-xs font-body uppercase tracking-wider text-foreground/70 mb-1.5 block">Email</label>
                  <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
                </div>
                <div>
                  <label className="text-xs font-body uppercase tracking-wider text-foreground/70 mb-1.5 block">Password</label>
                  <input type="password" className={inputClass} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-3.5 text-xs tracking-[0.2em] uppercase font-body font-semibold hover:bg-gold-dark transition-colors disabled:opacity-50">
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-xs font-body uppercase tracking-wider text-foreground/70 mb-1.5 block">Full Name *</label>
                  <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
                </div>
                <div>
                  <label className="text-xs font-body uppercase tracking-wider text-foreground/70 mb-1.5 block">Email *</label>
                  <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
                </div>
                <div>
                  <label className="text-xs font-body uppercase tracking-wider text-foreground/70 mb-1.5 block">Phone</label>
                  <input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 99999 99999" />
                </div>
                <div>
                  <label className="text-xs font-body uppercase tracking-wider text-foreground/70 mb-1.5 block">Password *</label>
                  <input type="password" className={inputClass} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Minimum 6 characters" />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-3.5 text-xs tracking-[0.2em] uppercase font-body font-semibold hover:bg-gold-dark transition-colors disabled:opacity-50">
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground font-body mt-6">
            By continuing, you agree to our{" "}
            <Link to="/policies/terms" className="text-primary hover:underline">Terms</Link> &{" "}
            <Link to="/policies/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
