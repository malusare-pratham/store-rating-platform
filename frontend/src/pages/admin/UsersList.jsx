import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, Eye, X } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { SkeletonTable } from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import { RoleBadge } from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Pagination, { ThSort } from "../../components/ui/SortableTable";
import useDebounce from "../../hooks/useDebounce";
import api from "../../services/api";

const UserDetails = ({ userId, onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/admin/users/${userId}`)
      .then(({ data }) => setUser(data.data.user))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div className="py-8 flex justify-center"><div className="w-8 h-8 border-2 border-dark-700 border-t-brand-500 rounded-full animate-spin" /></div>;
  if (!user) return <p className="text-dark-400 text-sm">User not found.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-accent-violet flex items-center justify-center text-white font-display font-bold text-xl shadow-glow">
          {user.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h3 className="font-display font-semibold text-white text-lg">{user.name}</h3>
          <p className="text-dark-400 text-sm font-body">{user.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Role", value: <RoleBadge role={user.role} /> },
          { label: "Address", value: user.address || "—" },
          { label: "Joined", value: new Date(user.created_at).toLocaleDateString() },
        ].map(({ label, value }) => (
          <div key={label} className="glass-light rounded-xl p-3">
            <p className="text-dark-500 text-xs font-body mb-1">{label}</p>
            <div className="text-dark-200 text-sm font-body">{value}</div>
          </div>
        ))}
      </div>
      {user.store && (
        <div className="glass-light rounded-xl p-3 border border-emerald-800/20">
          <p className="text-dark-500 text-xs font-body mb-1">Owned Store</p>
          <p className="text-emerald-400 font-medium text-sm">{user.store.store_name}</p>
          <p className="text-amber-400 text-xs mt-0.5">⭐ {user.store.avg_rating ?? "No ratings"}</p>
        </div>
      )}
    </div>
  );
};

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ search: debouncedSearch, role: roleFilter, sortBy, sortOrder, page, limit: 10 });
    api.get(`/admin/users?${params}`)
      .then(({ data }) => { setUsers(data.data); setPagination(data.pagination); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [debouncedSearch, roleFilter, sortBy, sortOrder, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { setPage(1); }, [debouncedSearch, roleFilter]);

  const handleSort = (field) => {
    if (sortBy === field) setSortOrder(o => o === "ASC" ? "DESC" : "ASC");
    else { setSortBy(field); setSortOrder("ASC"); }
  };

  return (
    <DashboardLayout title="Users" subtitle="Manage all platform users">
      <div className="card">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
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
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="input-field w-full sm:w-44">
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">Normal User</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <SkeletonTable rows={6} />
        ) : users.length === 0 ? (
          <EmptyState icon={Users} title="No users found" description="Try adjusting your search or filters." />
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-dark-800/50">
              <table className="w-full">
                <thead className="bg-dark-900/60">
                  <tr>
                    <ThSort field="name" label="Name" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <ThSort field="email" label="Email" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <th className="table-header hidden md:table-cell">Address</th>
                    <ThSort field="role" label="Role" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                    <th className="table-header w-16">Details</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {users.map((user, i) => (
                      <motion.tr
                        key={user.id}
                        className="table-row"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <td className="table-cell">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-700 to-accent-violet flex items-center justify-center text-white text-xs font-display font-bold flex-shrink-0">
                              {user.name?.[0]?.toUpperCase()}
                            </div>
                            <span className="font-medium text-dark-100 truncate max-w-[140px]">{user.name}</span>
                          </div>
                        </td>
                        <td className="table-cell text-dark-300 truncate max-w-[180px]">{user.email}</td>
                        <td className="table-cell hidden md:table-cell text-dark-400 truncate max-w-[160px]">
                          {user.address || <span className="text-dark-600">—</span>}
                        </td>
                        <td className="table-cell"><RoleBadge role={user.role} /></td>
                        <td className="table-cell">
                          <button
                            onClick={() => setSelectedUserId(user.id)}
                            className="btn-ghost p-1.5 rounded-lg text-dark-500 hover:text-brand-400"
                          >
                            <Eye size={15} />
                          </button>
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

      <Modal isOpen={!!selectedUserId} onClose={() => setSelectedUserId(null)} title="User Details">
        {selectedUserId && <UserDetails userId={selectedUserId} onClose={() => setSelectedUserId(null)} />}
      </Modal>
    </DashboardLayout>
  );
};

export default UsersList;
