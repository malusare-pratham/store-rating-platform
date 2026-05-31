import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff, UserPlus, CheckCircle } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { addUserSchema } from "../../utils/validation";
import toast from "react-hot-toast";
import api from "../../services/api";

const Field = ({ label, error, hint, children }) => (
  <div>
    <label className="label">{label}{hint && <span className="text-dark-500 text-xs ml-1">({hint})</span>}</label>
    {children}
    {error && <p className="mt-1.5 text-red-400 text-xs font-body">{error}</p>}
  </div>
);

const AddUser = () => {
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(addUserSchema),
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await api.post("/admin/users", data);
      toast.success("User added successfully!");
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add user.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Add User" subtitle="Create a new platform user">
      <div className="max-w-2xl">
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-dark-700/50">
            <div className="w-10 h-10 rounded-xl bg-brand-900/30 border border-brand-800/30 flex items-center justify-center">
              <UserPlus size={18} className="text-brand-400" />
            </div>
            <div>
              <h2 className="section-title">New User</h2>
              <p className="text-dark-400 text-xs font-body mt-0.5">Fill in the details below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Field label="Full Name" hint="20–60 chars" error={errors.name?.message}>
              <input type="text" {...register("name")} placeholder="e.g. Prathmesh Sureshbhai Sharma"
                className={`input-field ${errors.name ? "input-error" : ""}`} />
            </Field>

            <Field label="Email Address" error={errors.email?.message}>
              <input type="email" {...register("email")} placeholder="user@example.com"
                className={`input-field ${errors.email ? "input-error" : ""}`} />
            </Field>

            <Field label="Address" hint="max 400 chars, optional" error={errors.address?.message}>
              <textarea {...register("address")} placeholder="User's address…"
                className={`input-field resize-none h-20 ${errors.address ? "input-error" : ""}`} />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Password" hint="8–16 chars" error={errors.password?.message}>
                <div className="relative">
                  <input type={showPwd ? "text" : "password"} {...register("password")} placeholder="••••••••"
                    className={`input-field pr-10 ${errors.password ? "input-error" : ""}`} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200">
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </Field>

              <Field label="Role" error={errors.role?.message}>
                <select {...register("role")} className={`input-field ${errors.role ? "input-error" : ""}`}>
                  <option value="">Select role…</option>
                  <option value="admin">Admin</option>
                  <option value="user">Normal User</option>
                  <option value="store_owner">Store Owner</option>
                </select>
              </Field>
            </div>

            <div className="pt-2 flex gap-3">
              <motion.button
                type="submit"
                disabled={submitting}
                className="btn-primary flex items-center gap-2"
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
              >
                {submitting ? <LoadingSpinner size={16} /> : <><CheckCircle size={16} /> Add User</>}
              </motion.button>
              <button type="button" onClick={() => reset()} className="btn-secondary">Reset</button>
            </div>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AddUser;
