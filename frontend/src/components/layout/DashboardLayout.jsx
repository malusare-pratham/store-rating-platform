import { motion } from "framer-motion";
import Sidebar, { MobileSidebar } from "./Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import { Bell, Search } from "lucide-react";
import { RoleBadge } from "../ui/Badge";

const DashboardLayout = ({ children, title, subtitle }) => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="flex-shrink-0 glass border-b border-dark-700/50 px-4 md:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MobileSidebar />
            <div>
              {title && <h1 className="font-display font-semibold text-dark-100 text-lg leading-none">{title}</h1>}
              {subtitle && <p className="text-dark-400 text-xs font-body mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RoleBadge role={user?.role} />
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-accent-violet flex items-center justify-center text-white font-display font-bold text-sm cursor-pointer shadow-glow">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
