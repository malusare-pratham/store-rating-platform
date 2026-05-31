import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import { Eye, EyeOff, Star, Zap, LogIn } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { loginSchema } from "../utils/validation";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

const Login = () => {
  const { login, loading } = useAuth();
  const [showPwd, setShowPwd] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try { await login(data); } catch {}
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-violet/5 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }} />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Brand */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-violet flex items-center justify-center shadow-glow">
            <Star size={20} className="text-white" />
          </div>
          <span className="font-display font-bold text-2xl text-white tracking-tight">RateStore</span>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 shadow-2xl border-dark-600/50">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold text-white mb-1">Welcome back</h1>
            <p className="text-dark-400 text-sm font-body">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                {...register("email")}
                className={`input-field ${errors.email ? "input-error" : ""}`}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && <p className="mt-1.5 text-red-400 text-xs font-body">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  {...register("password")}
                  className={`input-field pr-10 ${errors.password ? "input-error" : ""}`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200 transition-colors">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-red-400 text-xs font-body">{errors.password.message}</p>}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2"
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
            >
              {loading ? <LoadingSpinner size={18} /> : <><LogIn size={18} /> Sign In</>}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-dark-400 text-sm font-body">
            Don't have an account?{" "}
            <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Create account
            </Link>
          </p>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-4 glass-light rounded-xl p-3 flex items-start gap-2">
          <Zap size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-dark-400 text-xs font-body">
            <span className="text-dark-300 font-medium">Demo admin:</span> admin@storerating.com / Admin@123
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
