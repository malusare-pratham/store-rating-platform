import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

export const SortIcon = ({ field, sortBy, sortOrder }) => {
  if (sortBy !== field) return <ChevronsUpDown size={13} className="text-dark-600" />;
  return sortOrder === "ASC"
    ? <ChevronUp size={13} className="text-brand-400" />
    : <ChevronDown size={13} className="text-brand-400" />;
};

export const ThSort = ({ field, label, sortBy, sortOrder, onSort, className = "" }) => (
  <th
    className={`table-header ${className}`}
    onClick={() => onSort(field)}
  >
    <div className="flex items-center gap-1.5">
      {label}
      <SortIcon field={field} sortBy={sortBy} sortOrder={sortOrder} />
    </div>
  </th>
);

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;
  const { page, totalPages, total, limit } = pagination;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-dark-800/50">
      <p className="text-dark-400 text-xs font-body">
        Showing <span className="text-dark-200">{start}–{end}</span> of <span className="text-dark-200">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-1.5 rounded-lg text-xs font-body text-dark-400 hover:text-dark-100 hover:bg-dark-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Previous
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const p = totalPages <= 5 ? i + 1 : Math.max(1, page - 2) + i;
          if (p > totalPages) return null;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-7 h-7 rounded-lg text-xs font-body transition-all ${p === page ? "bg-brand-600 text-white" : "text-dark-400 hover:text-dark-100 hover:bg-dark-800"}`}
            >
              {p}
            </button>
          );
        })}
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-1.5 rounded-lg text-xs font-body text-dark-400 hover:text-dark-100 hover:bg-dark-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
