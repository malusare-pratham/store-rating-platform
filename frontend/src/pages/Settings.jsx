import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, CheckCircle, User, Mail, MapPin } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { RoleBadge } from "../components/ui/Badge";
import { updatePasswordSchema } from "../utils/validation";
import { useAuth } from "../contexts/AuthContext";

const Settings = () => {
  const { user, updatePassword } = useAuth();
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showCon, setShowCon] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: yupResolver(updatePasswordSchema),
  });

  const newPwd = watch("newPassword", "");

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await updatePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      reset();
    } catch {} finally {
      setSubmitting(false);
    }
  };

  const pwdChecks = [
    { label: "8–16 characters", ok: newPwd?.length >= 8 && newPwd?.length <= 16 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(newPwd || "") },
    { label: "One special character", ok: /[!@#$%^&*(),.?":{}|<>]/.test(newPwd || "") },
  ];

  const PwdField = ({ name, label, show, onToggle }) => (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          {...register(name)}
          placeholder="••••••••"
          className={`input-field pr-10 ${errors[name] ? "input-error" : ""}`}
        />
        <button type="button" onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200">
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {errors[name] && <p className="mt-1.5 text-red-400 text-xs font-body">{errors[name].message}</p>}
    </div>
  );

  return (
    <DashboardLayout title="Settings" subtitle="Manage your account">
      <div className="max-w-2xl space-y-6">
        {/* Profile Info */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-dark-700/50">
            <div className="w-9 h-9 rounded-xl bg-brand-900/30 border border-brand-800/30 flex items-center justify-center">
              <User size={16} className="text-brand-400" />
            </div>
            <h2 className="section-title">Profile</h2>
          </div>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-accent-violet flex items-center justify-center text-white font-display font-bold text-2xl shadow-glow">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h3 className="font-display font-semibold text-white text-lg">{user?.name}</h3>
              <RoleBadge role={user?.role} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="glass-light rounded-xl p-3 flex items-start gap-2.5">
              <Mail size={14} className="text-dark-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-dark-500 text-xs font-body">Email</p>
                <p className="text-dark-200 text-sm font-body">{user?.email}</p>
              </div>
            </div>
            <div className="glass-light rounded-xl p-3 flex items-start gap-2.5">
              <MapPin size={14} className="text-dark-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-dark-500 text-xs font-body">Address</p>
                <p className="text-dark-200 text-sm font-body">{user?.address || "—"}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Change Password */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-dark-700/50">
            <div className="w-9 h-9 rounded-xl bg-amber-900/30 border border-amber-800/30 flex items-center justify-center">
              <Lock size={16} className="text-amber-400" />
            </div>
            <h2 className="section-title">Change Password</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <PwdField name="currentPassword" label="Current Password" show={showCur} onToggle={() => setShowCur(!showCur)} />
            <PwdField name="newPassword" label="New Password" show={showNew} onToggle={() => setShowNew(!showNew)} />

            {newPwd && (
              <div className="glass-light rounded-xl p-3 space-y-1.5">
                {pwdChecks.map(({ label, ok }) => (
                  <div key={label} className={`flex items-center gap-2 text-xs font-body ${ok ? "text-emerald-400" : "text-dark-500"}`}>
                    <CheckCircle size={11} className={ok ? "text-emerald-400" : "text-dark-600"} />
                    {label}
                  </div>
                ))}
              </div>
            )}

            <PwdField name="confirmPassword" label="Confirm New Password" show={showCon} onToggle={() => setShowCon(!showCon)} />

            <div className="pt-2">
              <motion.button
                type="submit"
                disabled={submitting}
                className="btn-primary flex items-center gap-2"
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
              >
                {submitting ? <LoadingSpinner size={16} /> : <><Lock size={15} /> Update Password</>}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
