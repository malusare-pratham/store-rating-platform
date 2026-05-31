const roleConfig = {
  admin: { label: "Admin", className: "badge-admin" },
  user: { label: "User", className: "badge-user" },
  store_owner: { label: "Store Owner", className: "badge-owner" },
};

export const RoleBadge = ({ role }) => {
  const config = roleConfig[role] || { label: role, className: "badge bg-dark-800 text-dark-300 border border-dark-700" };
  return <span className={config.className}>{config.label}</span>;
};

export const StatusBadge = ({ children, variant = "default" }) => {
  const variants = {
    default: "badge bg-dark-800 text-dark-300 border border-dark-700",
    success: "badge bg-emerald-900/30 text-emerald-400 border border-emerald-700/30",
    warning: "badge bg-amber-900/30 text-amber-400 border border-amber-700/30",
    danger: "badge bg-red-900/30 text-red-400 border border-red-700/30",
    info: "badge bg-brand-900/30 text-brand-400 border border-brand-700/30",
  };
  return <span className={variants[variant]}>{children}</span>;
};
