import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/useAuth";
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  ShieldCheck, 
  ArrowRight, 
  Loader2,
  Leaf
} from "lucide-react";

type Mode = "login" | "register";

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
  };
}

const Auth = () => {
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<"user" | "admin">("user");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === "register" && !name)) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = mode === "login" ? { email, password } : { name, email, password, role };

      const response = await API.post<AuthResponse>(endpoint, payload);
      login(response.data.token, response.data.user);
      navigate("/app/dashboard");
    } catch (error) {
      console.error("Auth Error:", error);
      alert("Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      
      {/* LEFT SIDE: Decorative / Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-950/40 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef" 
          alt="Agriculture" 
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-[pulse_10s_ease-in-out_infinite]"
        />
        <div className="relative z-20 flex flex-col justify-between p-16 text-white w-full">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-1.5 rounded-lg shadow-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">CropYield AI</span>
          </div>
          
          <div>
            <h1 className="text-5xl font-extrabold mb-6 leading-tight">
              Precision Agriculture <br />
              <span className="text-emerald-400">Simplified.</span>
            </h1>
            <p className="text-lg text-slate-200 max-w-md leading-relaxed">
              Join thousands of farmers and analysts using data-driven insights to maximize global food security.
            </p>
          </div>

          <div className="text-sm text-slate-300 font-medium">
            © 2026 CropYield Intelligence Platform
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-4 duration-700">
          
          {/* Header */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {mode === "login" ? "Welcome back" : "Create an account"}
            </h2>
            <p className="text-slate-500 font-medium">
              {mode === "login" 
                ? "Please enter your details to access your dashboard." 
                : "Fill in the information below to get started."}
            </p>
          </div>

          {/* Mode Switcher (Pill Style) */}
          <div className="flex p-1 bg-slate-200/50 rounded-2xl mb-8">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
                mode === "login" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
                mode === "register" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input (Register Only) */}
            {mode === "register" && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-700"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Role Selector (Register Only) */}
            {mode === "register" && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Account Role</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <select
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-700 appearance-none cursor-pointer"
                    value={role}
                    onChange={(e) => setRole(e.target.value as "user" | "admin")}
                  >
                    <option value="user">Field User</option>
                    <option value="admin">System Admin</option>
                  </select>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-emerald-900/10 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 mt-4 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Link */}
          <p className="mt-8 text-center text-sm text-slate-500 font-medium">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="ml-1 text-emerald-600 font-bold hover:underline"
            >
              {mode === "login" ? "Sign up free" : "Sign in here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;