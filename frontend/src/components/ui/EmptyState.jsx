import { motion } from "framer-motion";

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <motion.div
    className="flex flex-col items-center justify-center py-20 px-6 text-center"
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="w-20 h-20 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center mb-5 shadow-card">
      {Icon && <Icon size={36} className="text-dark-500" />}
    </div>
    <h3 className="font-display text-lg font-semibold text-dark-200 mb-2">{title}</h3>
    <p className="text-dark-400 text-sm max-w-sm font-body">{description}</p>
    {action && <div className="mt-6">{action}</div>}
  </motion.div>
);

export default EmptyState;
