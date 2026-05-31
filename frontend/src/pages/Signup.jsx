import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import { Eye, EyeOff, Star, UserPlus, CheckCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { signupSchema } from "../utils/validation";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

const PasswordHint = ({ value }) => {
  const checks = [
    { label: "8–16 characters", ok: value?.length >= 8 && value?.length <= 16 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(value || "") },
    { label: "One special character", ok: /[!@#$%^&*(),.?":{}|<>]/.test(value || "") },
  ];
  return (
    <div className="mt-2 space-y-1">
      {checks.map(({ label, ok }) => (
        <div key={label} className={`flex items-center gap-1.5 text-xs font-body transition-colors ${ok ? "text-emerald-400" : "text-dark-500"}`}>
          <CheckCircle size={11} className={ok ? "text-emerald-400" : "text-dark-600"} />
          {label}
        </div>
      ))}
    </div>
  );
};

const Signup = () => {
  const { signup, loading } = useAuth();
  const [showPwd, setShowPwd] = useState(false);
  const [pwdValue, setPwdValue] = useState("");

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const password = watch("password", "");

  const onSubmit = async (data) => {
    try { await signup(data); } catch {}
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-accent-violet/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-brand-600/5 rounded-full blur-3xl" />
      </div>
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }} />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-violet flex items-center justify-center shadow-glow">
            <Star size={20} className="text-white" />
          </div>
          <span className="font-display font-bold text-2xl text-white tracking-tight">RateStore</span>
        </div>

        <div className="glass rounded-2xl p-8 shadow-2xl border-dark-600/50">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold text-white mb-1">Create account</h1>
            <p className="text-dark-400 text-sm font-body">Join thousands of users rating stores</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Full name <span className="text-dark-500 text-xs">(20–60 chars)</span></label>
              <input
                type="text"
                {...register("name")}
                className={`input-field ${errors.name ? "input-error" : ""}`}
                placeholder="e.g. Prathmesh Sureshbhai Sharma"
              />
              {errors.name && <p className="mt-1.5 text-red-400 text-xs font-body">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                {...register("email")}
                className={`input-field ${errors.email ? "input-error" : ""}`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1.5 text-red-400 text-xs font-body">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Address <span className="text-dark-500 text-xs">(optional)</span></label>
              <textarea
                {...register("address")}
                className={`input-field resize-none h-20 ${errors.address ? "input-error" : ""}`}
                placeholder="Your address..."
              />
              {errors.address && <p className="mt-1.5 text-red-400 text-xs font-body">{errors.address.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  {...register("password")}
                  className={`input-field pr-10 ${errors.password ? "input-error" : ""}`}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200 transition-colors">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password ? (
                <p className="mt-1.5 text-red-400 text-xs font-body">{errors.password.message}</p>
              ) : (
                <PasswordHint value={password} />
              )}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2"
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
            >
              {loading ? <LoadingSpinner size={18} /> : <><UserPlus size={18} /> Create Account</>}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-dark-400 text-sm font-body">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
