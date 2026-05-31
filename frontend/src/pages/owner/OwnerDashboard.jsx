import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Users, TrendingUp, MapPin, Mail, BarChart3 } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { PageLoader } from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import { StarDisplay } from "../../components/ui/StarRating";
import api from "../../services/api";

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/stores/owner/dashboard")
      .then(({ data: res }) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load dashboard."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  if (error) return (
    <DashboardLayout title="My Store" subtitle="Store dashboard">
      <EmptyState icon={BarChart3} title="No Store Found" description={error} />
    </DashboardLayout>
  );

  const { store, avg_rating, total_ratings, raters } = data;

  const ratingBars = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: raters.filter(r => r.rating === star).length,
  }));
  const maxCount = Math.max(...ratingBars.map(b => b.count), 1);

  return (
    <DashboardLayout title="My Store" subtitle="Overview of your store performance">
      <div className="space-y-6">
        {/* Store Info Header */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-brand-600 flex items-center justify-center text-white font-display font-bold text-3xl shadow-glow flex-shrink-0">
              {store.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-xl font-bold text-white mb-1 truncate">{store.name}</h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-dark-400 text-sm font-body">
                {store.email && (
                  <span className="flex items-center gap-1.5"><Mail size={13} className="text-dark-500" />{store.email}</span>
                )}
                {store.address && (
                  <span className="flex items-center gap-1.5"><MapPin size={13} className="text-dark-500" />{store.address}</span>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-display text-4xl font-bold text-white">{avg_rating > 0 ? avg_rating : "—"}</div>
              <StarDisplay rating={parseFloat(avg_rating)} size={16} />
              <p className="text-dark-500 text-xs font-body mt-1">{total_ratings} rating{total_ratings !== 1 ? "s" : ""}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rating Distribution */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <h3 className="section-title mb-5">Rating Distribution</h3>
            <div className="space-y-3">
              {ratingBars.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-amber-400 text-sm font-mono w-4">{star}</span>
                  <Star size={12} className="text-amber-400 flex-shrink-0" />
                  <div className="flex-1 h-2 bg-dark-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxCount) * 100}%` }}
                      transition={{ delay: 0.3 + (5 - star) * 0.07, duration: 0.5 }}
                    />
                  </div>
                  <span className="text-dark-400 text-xs font-mono w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h3 className="section-title mb-5">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Total Reviews", value: total_ratings, icon: Star, color: "text-amber-400" },
                { label: "Average Rating", value: avg_rating || "—", icon: TrendingUp, color: "text-brand-400" },
                { label: "Unique Raters", value: raters.length, icon: Users, color: "text-violet-400" },
                { label: "Top Rating", value: raters.length ? `${Math.max(...raters.map(r => r.rating))} ★` : "—", icon: BarChart3, color: "text-emerald-400" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="glass-light rounded-xl p-4 border border-dark-700/30">
                  <Icon size={18} className={`${color} mb-2`} />
                  <p className="font-display text-2xl font-bold text-white">{value}</p>
                  <p className="text-dark-500 text-xs font-body mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Raters Table */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <h3 className="section-title mb-5">Users Who Rated Your Store</h3>
          {raters.length === 0 ? (
            <EmptyState icon={Users} title="No ratings yet" description="Your store hasn't received any ratings yet." />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-dark-800/50">
              <table className="w-full">
                <thead className="bg-dark-900/60">
                  <tr>
                    <th className="table-header">User</th>
                    <th className="table-header">Email</th>
                    <th className="table-header">Rating</th>
                    <th className="table-header hidden sm:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {raters.map((rater, i) => (
                      <motion.tr
                        key={rater.id}
                        className="table-row"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <td className="table-cell">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-700 to-accent-violet flex items-center justify-center text-white text-xs font-display font-bold">
                              {rater.name?.[0]?.toUpperCase()}
                            </div>
                            <span className="font-medium text-dark-100 text-sm">{rater.name}</span>
                          </div>
                        </td>
                        <td className="table-cell text-dark-400">{rater.email}</td>
                        <td className="table-cell">
                          <StarDisplay rating={rater.rating} size={14} showValue />
                        </td>
                        <td className="table-cell hidden sm:table-cell text-dark-500 text-xs">
                          {new Date(rater.updated_at).toLocaleDateString()}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default OwnerDashboard;
