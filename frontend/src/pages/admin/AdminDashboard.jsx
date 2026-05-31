import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Store, Star, TrendingUp, ArrowUpRight } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { SkeletonCard } from "../../components/ui/LoadingSpinner";
import api from "../../services/api";
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from "recharts";

const StatCard = ({ icon: Icon, label, value, color, delay, trend }) => (
  <motion.div
    className="stat-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
  >
    {/* Background glow */}
    <div className={`absolute inset-0 rounded-2xl opacity-5 ${color}`} />
    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-dark-400 text-sm font-body font-medium mb-2">{label}</p>
        <p className="font-display text-4xl font-bold text-white tracking-tight">{value ?? "—"}</p>
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-2 text-emerald-400 text-xs font-body">
            <ArrowUpRight size={12} />
            <span>Active</span>
          </div>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} bg-opacity-10`}>
        <Icon size={22} className="text-white opacity-90" />
      </div>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard")
      .then(({ data }) => setStats(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const chartData = stats ? [
    { name: "Users", value: stats.totalUsers, fill: "#0ea5e9" },
    { name: "Stores", value: stats.totalStores, fill: "#a78bfa" },
    { name: "Ratings", value: stats.totalRatings, fill: "#34d399" },
  ] : [];

  return (
    <DashboardLayout title="Dashboard" subtitle="Platform overview">
      <div className="space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <StatCard icon={Users} label="Total Users" value={stats?.totalUsers} color="bg-brand-500" delay={0} trend />
              <StatCard icon={Store} label="Total Stores" value={stats?.totalStores} color="bg-violet-500" delay={0.1} trend />
              <StatCard icon={Star} label="Total Ratings" value={stats?.totalRatings} color="bg-emerald-500" delay={0.2} trend />
              <StatCard icon={TrendingUp} label="Avg. Rating" value={stats?.avgRating ? `${stats.avgRating} ★` : "—"} color="bg-amber-500" delay={0.3} />
            </>
          )}
        </div>

        {/* Chart + Quick links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div
            className="card lg:col-span-2"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          >
            <h2 className="section-title mb-4">Platform Summary</h2>
            {stats && (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={chartData}>
                    <RadialBar dataKey="value" cornerRadius={6} />
                    <Tooltip
                      contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, fontSize: 12 }}
                      labelStyle={{ color: "#94a3b8" }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="flex items-center gap-6 mt-2 justify-center">
              {chartData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-xs font-body text-dark-400">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill }} />
                  {d.name}: <span className="text-dark-200 font-medium">{d.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          >
            <h2 className="section-title mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: "Add New User", to: "/admin/add-user", color: "text-brand-400 bg-brand-900/20 border-brand-800/30" },
                { label: "Add New Store", to: "/admin/add-store", color: "text-violet-400 bg-violet-900/20 border-violet-800/30" },
                { label: "View All Users", to: "/admin/users", color: "text-emerald-400 bg-emerald-900/20 border-emerald-800/30" },
                { label: "View All Stores", to: "/admin/stores", color: "text-amber-400 bg-amber-900/20 border-amber-800/30" },
              ].map(({ label, to, color }) => (
                <a key={to} href={to}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border font-body text-sm font-medium transition-all duration-200 hover:opacity-80 ${color}`}
                >
                  {label}
                  <ArrowUpRight size={14} />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
