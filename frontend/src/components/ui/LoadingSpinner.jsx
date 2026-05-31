import { motion } from "framer-motion";

export const LoadingSpinner = ({ size = 24, className = "" }) => (
  <motion.div
    className={`inline-block border-2 border-dark-700 border-t-brand-500 rounded-full ${className}`}
    style={{ width: size, height: size }}
    animate={{ rotate: 360 }}
    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
  />
);

export const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-4">
    <LoadingSpinner size={40} />
    <p className="text-dark-400 text-sm font-body">Loading...</p>
  </div>
);

export const SkeletonCard = () => (
  <div className="card animate-pulse">
    <div className="skeleton h-4 w-1/3 mb-4" />
    <div className="skeleton h-8 w-1/2 mb-2" />
    <div className="skeleton h-3 w-2/3" />
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="space-y-3">
    <div className="skeleton h-10 w-full rounded-xl" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="skeleton h-14 w-full rounded-xl" />
    ))}
  </div>
);
