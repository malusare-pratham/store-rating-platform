import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import { ShoppingBag, CheckCircle } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { addStoreSchema } from "../../utils/validation";
import toast from "react-hot-toast";
import api from "../../services/api";

const AddStore = () => {
  const [submitting, setSubmitting] = useState(false);
  const [owners, setOwners] = useState([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(addStoreSchema),
  });

  useEffect(() => {
    api.get("/admin/users?role=store_owner&limit=100")
      .then(({ data }) => setOwners(data.data || []))
      .catch(() => {});
  }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await api.post("/admin/stores", data);
      toast.success("Store added successfully!");
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add store.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Add Store" subtitle="Register a new store on the platform">
      <div className="max-w-2xl">
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-dark-700/50">
            <div className="w-10 h-10 rounded-xl bg-violet-900/30 border border-violet-800/30 flex items-center justify-center">
              <ShoppingBag size={18} className="text-violet-400" />
            </div>
            <div>
              <h2 className="section-title">New Store</h2>
              <p className="text-dark-400 text-xs font-body mt-0.5">Fill in the store details below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label">Store Name <span className="text-dark-500 text-xs">(20–60 chars)</span></label>
              <input type="text" {...register("name")} placeholder="e.g. Prathmesh Electronics Store Mumbai"
                className={`input-field ${errors.name ? "input-error" : ""}`} />
              {errors.name && <p className="mt-1.5 text-red-400 text-xs font-body">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label">Store Email</label>
              <input type="email" {...register("email")} placeholder="store@example.com"
                className={`input-field ${errors.email ? "input-error" : ""}`} />
              {errors.email && <p className="mt-1.5 text-red-400 text-xs font-body">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Address <span className="text-dark-500 text-xs">(max 400 chars)</span></label>
              <textarea {...register("address")} placeholder="Store address…"
                className={`input-field resize-none h-20 ${errors.address ? "input-error" : ""}`} />
              {errors.address && <p className="mt-1.5 text-red-400 text-xs font-body">{errors.address.message}</p>}
            </div>

            <div>
              <label className="label">Assign Owner <span className="text-dark-500 text-xs">(optional)</span></label>
              <select {...register("owner_id")} className="input-field">
                <option value="">No owner assigned</option>
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
                ))}
              </select>
              {owners.length === 0 && (
                <p className="mt-1.5 text-dark-500 text-xs font-body">No store owner accounts found. Add a store owner first.</p>
              )}
            </div>

            <div className="pt-2 flex gap-3">
              <motion.button
                type="submit"
                disabled={submitting}
                className="btn-primary flex items-center gap-2"
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
              >
                {submitting ? <LoadingSpinner size={16} /> : <><CheckCircle size={16} /> Add Store</>}
              </motion.button>
              <button type="button" onClick={() => reset()} className="btn-secondary">Reset</button>
            </div>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AddStore;
