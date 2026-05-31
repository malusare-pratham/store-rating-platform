import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Store, Plus, Settings,
  LogOut, ChevronLeft, ChevronRight, Star, BarChart3,
  UserPlus, ShoppingBag, Menu, X
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const adminLinks = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/admin" },
  { icon: Users, label: "Users", to: "/admin/users" },
  { icon: Store, label: "Stores", to: "/admin/stores" },
  { icon: UserPlus, label: "Add User", to: "/admin/add-user" },
  { icon: ShoppingBag, label: "Add Store", to: "/admin/add-store" },
];

const userLinks = [
  { icon: Store, label: "Browse Stores", to: "/dashboard" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

const ownerLinks = [
  { icon: BarChart3, label: "Dashboard", to: "/owner" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

const Sidebar = ({ mobile = false, onClose }) => {
  const { user, logout, isAdmin, isOwner } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const links = isAdmin ? adminLinks : isOwner ? ownerLinks : userLinks;

  const sidebarContent = (
    <div className={`flex flex-col h-full ${collapsed && !mobile ? "w-16" : "w-64"} transition-all duration-300`}>
      {/* Logo */}
      <div className={`flex items-center ${collapsed && !mobile ? "justify-center px-3" : "px-5"} py-5 border-b border-dark-700/50`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-violet flex items-center justify-center flex-shrink-0 shadow-glow">
          <Star size={16} className="text-white" />
        </div>
        {(!collapsed || mobile) && (
          <div className="ml-3 overflow-hidden">
            <span className="font-display font-bold text-white text-base tracking-tight">RateStore</span>
            <p className="text-dark-500 text-xs font-body">{isAdmin ? "Admin Panel" : isOwner ? "Owner Panel" : "User Panel"}</p>
          </div>
        )}
        {mobile && (
          <button onClick={onClose} className="ml-auto btn-ghost p-1 rounded-lg">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/admin" || to === "/owner" || to === "/dashboard"}
            onClick={mobile ? onClose : undefined}
            className={({ isActive }) =>
              isActive ? "sidebar-link-active flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm font-medium"
                : "sidebar-link"
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            {(!collapsed || mobile) && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className={`border-t border-dark-700/50 ${collapsed && !mobile ? "px-3 py-3" : "px-4 py-4"}`}>
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-dark-800/40">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-accent-violet flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-dark-100 text-sm font-medium font-body truncate">{user?.name}</p>
              <p className="text-dark-500 text-xs font-body truncate">{user?.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className={`w-full flex items-center ${collapsed && !mobile ? "justify-center" : "gap-3"} px-3 py-2.5 rounded-xl text-dark-400 hover:text-red-400 hover:bg-red-900/10 transition-all duration-200 font-body text-sm font-medium border border-transparent hover:border-red-900/30`}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {(!collapsed || mobile) && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse toggle (desktop only) */}
      {!mobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-dark-700 border border-dark-600 flex items-center justify-center text-dark-400 hover:text-dark-200 hover:bg-dark-600 transition-all duration-200 shadow-md"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      )}
    </div>
  );

  if (mobile) {
    return (
      <div className="h-full glass border-r border-dark-700/50 relative">
        {sidebarContent}
      </div>
    );
  }

  return (
    <div className={`hidden md:flex flex-col h-screen sticky top-0 glass border-r border-dark-700/50 relative flex-shrink-0 transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
      {sidebarContent}
    </div>
  );
};

export const MobileSidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="md:hidden btn-ghost p-2 rounded-lg">
        <Menu size={20} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-dark-950/80 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 z-50 w-72 md:hidden"
              initial={{ x: -288 }} animate={{ x: 0 }} exit={{ x: -288 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <Sidebar mobile onClose={() => setOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
