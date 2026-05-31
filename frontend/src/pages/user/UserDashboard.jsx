import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Store, Star, X, RefreshCw } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { SkeletonCard } from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import { StarDisplay, StarInput } from "../../components/ui/StarRating";
import Modal from "../../components/ui/Modal";
import Pagination from "../../components/ui/SortableTable";
import useDebounce from "../../hooks/useDebounce";
import toast from "react-hot-toast";
import api from "../../services/api";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

const StoreCard = ({ store, onRate, delay }) => {
  const hasRated = !!store.user_rating;

  return (
    <motion.div
      className="card-hover cursor-pointer group"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.05, duration: 0.35 }}
    >
      {/* Store icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-700/40 to-brand-700/40 border border-dark-700 flex items-center justify-center text-white font-display font-bold text-lg shadow-card">
          {store.name?.[0]?.toUpperCase()}
        </div>
        {hasRated && (
          <span className="badge bg-emerald-900/30 text-emerald-400 border border-emerald-700/30 text-xs">
            ✓ Rated
          </span>
        )}
      </div>

      {/* Info */}
      <h3 className="font-display font-semibold text-dark-100 mb-1 text-base leading-snug truncate group-hover:text-white transition-colors">
        {store.name}
      </h3>
      <p className="text-dark-500 text-xs font-body mb-4 truncate">{store.address || "Address not provided"}</p>

      {/* Rating */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-dark-500 text-xs font-body mb-1">Overall</p>
          <StarDisplay rating={parseFloat(store.avg_rating)} showValue size={14} />
          <p className="text-dark-600 text-xs font-body mt-0.5">{store.total_ratings} review{store.total_ratings !== 1 ? "s" : ""}</p>
        </div>
        {hasRated && (
          <div className="text-right">
            <p className="text-dark-500 text-xs font-body mb-1">Your rating</p>
            <StarDisplay rating={store.user_rating} size={14} />
          </div>
        )}
      </div>

      {/* Rate button */}
      <button
        onClick={() => onRate(store)}
        className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium font-body transition-all duration-200 border ${
          hasRated
            ? "bg-dark-800/40 border-dark-700 text-dark-400 hover:text-dark-200 hover:border-dark-600"
            : "bg-brand-600/10 border-brand-700/30 text-brand-400 hover:bg-brand-600/20 hover:border-brand-600/50"
        }`}
      >
        <Star size={14} />
        {hasRated ? "Modify Rating" : "Rate Store"}
      </button>
    </motion.div>
  );
};

const RateModal = ({ store, onClose, onSuccess }) => {
  const [rating, setRating] = useState(store?.user_rating || 0);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!rating) return toast.error("Please select a rating.");
    setSubmitting(true);
    try {
      await api.post(`/stores/${store.id}/rate`, { rating });
      toast.success(store.user_rating ? "Rating updated!" : "Rating submitted!");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit rating.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="glass-light rounded-xl p-4">
        <h3 className="font-display font-semibold text-white text-base mb-0.5">{store?.name}</h3>
        <p className="text-dark-400 text-xs font-body">{store?.address}</p>
        <div className="flex items-center gap-2 mt-2">
          <StarDisplay rating={parseFloat(store?.avg_rating)} size={13} />
          <span className="text-dark-500 text-xs">{store?.avg_rating} avg from {store?.total_ratings} reviews</span>
        </div>
      </div>

      <div>
        <p className="label mb-3">{store?.user_rating ? "Update your rating" : "Select your rating"}</p>
        <StarInput value={rating} onChange={setRating} size={36} />
        <p className="text-dark-500 text-xs font-body mt-2">
          {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating] || ""}
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <motion.button
          onClick={submit}
          disabled={submitting || !rating}
          className="btn-primary flex items-center gap-2 flex-1 justify-center"
          whileTap={{ scale: 0.98 }}
        >
          {submitting ? <LoadingSpinner size={16} /> : <><Star size={15} /> Submit Rating</>}
        </motion.button>
        <button onClick={onClose} className="btn-secondary">Cancel</button>
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [ratingStore, setRatingStore] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  const fetchStores = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ search: debouncedSearch, page, limit: 12 });
    api.get(`/stores?${params}`)
      .then(({ data }) => { setStores(data.data); setPagination(data.pagination); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [debouncedSearch, page]);

  useEffect(() => { fetchStores(); }, [fetchStores]);
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  return (
    <DashboardLayout title="Browse Stores" subtitle="Discover and rate stores near you">
      {/* Search */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
          <input
            type="text" placeholder="Search stores by name or address…"
            value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-9"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
              <X size={14} />
            </button>
          )}
        </div>
        <button onClick={fetchStores} className="btn-secondary flex items-center gap-2">
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : stores.length === 0 ? (
        <EmptyState
          icon={Store}
          title="No stores found"
          description={search ? "No stores match your search. Try different keywords." : "No stores have been registered yet."}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {stores.map((store, i) => (
              <StoreCard key={store.id} store={store} onRate={setRatingStore} delay={i} />
            ))}
          </div>
          <div className="mt-6 card">
            <Pagination pagination={pagination} onPageChange={setPage} />
          </div>
        </>
      )}

      <Modal
        isOpen={!!ratingStore}
        onClose={() => setRatingStore(null)}
        title={ratingStore?.user_rating ? "Update Rating" : "Rate Store"}
      >
        {ratingStore && (
          <RateModal
            store={ratingStore}
            onClose={() => setRatingStore(null)}
            onSuccess={fetchStores}
          />
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default UserDashboard;
