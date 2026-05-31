import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Store, X } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { SkeletonTable } from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import { StarDisplay } from "../../components/ui/StarRating";
import Pagination, { ThSort } from "../../components/ui/SortableTable";
import useDebounce from "../../hooks/useDebounce";
import api from "../../services/api";

const StoresList = () => {
  const [stores, setStores] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  const fetchStores = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ search: debouncedSearch, sortBy, sortOrder, page, limit: 10 });
    api.get(`/admin/stores?${params}`)
      .then(({ data }) => { setStores(data.data); setPagination(data.pagination); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [debouncedSearch, sortBy, sortOrder, page]);

  useEffect(() => { fetchStores(); }, [fetchStores]);
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  const handleSort = (field) => {
    if (sortBy === field) setSortOrder(o => o === "ASC" ? "DESC" : "ASC");
    else { setSortBy(field); setSortOrder("ASC"); }
  };

  return (
    <DashboardLayout title="Stores" subtitle="All registered stores">
      <div className="card">
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
            <input
              type="text" placeholder="Search name, email, address…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="input-field pl-9"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <SkeletonTable rows={6} />
        ) : stores.length === 0 ? (
          <EmptyState icon={Store} title="No stores found" description="Try adjusting your search." />
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-dark-800/50">
              <table className="w-full">
                <thead className="bg-dark-900/60">
                  <tr>
                    <ThSort field="name" label="Name" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <ThSort field="email" label="Email" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <th className="table-header hidden lg:table-cell">Address</th>
                    <th className="table-header hidden md:table-cell">Owner</th>
                    <ThSort field="rating" label="Rating" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <th className="table-header">Reviews</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {stores.map((store, i) => (
                      <motion.tr
                        key={store.id}
                        className="table-row"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <td className="table-cell">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-700 to-brand-600 flex items-center justify-center text-white text-xs font-display font-bold flex-shrink-0">
                              {store.name?.[0]?.toUpperCase()}
                            </div>
                            <span className="font-medium text-dark-100 truncate max-w-[140px]">{store.name}</span>
                          </div>
                        </td>
                        <td className="table-cell text-dark-300 truncate max-w-[160px]">{store.email}</td>
                        <td className="table-cell hidden lg:table-cell text-dark-400 truncate max-w-[140px]">
                          {store.address || <span className="text-dark-600">—</span>}
                        </td>
                        <td className="table-cell hidden md:table-cell text-dark-400">
                          {store.owner_name || <span className="text-dark-600">—</span>}
                        </td>
                        <td className="table-cell">
                          <StarDisplay rating={parseFloat(store.avg_rating)} showValue size={14} />
                        </td>
                        <td className="table-cell">
                          <span className="badge bg-dark-800 text-dark-300 border border-dark-700">
                            {store.total_ratings}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StoresList;
