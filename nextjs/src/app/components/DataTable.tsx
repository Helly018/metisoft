import React from 'react';

export interface Column<T> {
  key: keyof T & string;
  header: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  sortBy: string;
  order: 'asc' | 'desc';
  onSort: (key: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export default function DataTable<T extends { id: string | number }>({
  data,
  columns,
  sortBy,
  order,
  onSort,
  page,
  totalPages,
  onPageChange,
  isLoading,
  onEdit,
  onDelete
}: DataTableProps<T>) {
  return (
    <div className="flex flex-col w-full bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && onSort(col.key)}
                  className={`p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider ${
                    col.sortable ? 'cursor-pointer select-none hover:text-white transition-colors' : ''
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && sortBy === col.key && (
                      <span className="text-indigo-400">
                        {order === 'asc' ? (
                          <i className="bi bi-caret-up-fill text-[10px]"></i>
                        ) : (
                          <i className="bi bi-caret-down-fill text-[10px]"></i>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="relative min-h-[160px]">
            {isLoading && (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="p-8 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <span className="w-8 h-8 border-2 border-slate-800 border-t-indigo-500 rounded-full animate-spin"></span>
                    <span>Loading data...</span>
                  </div>
                </td>
              </tr>
            )}

            {!isLoading && data.length === 0 && (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="p-12 text-center text-slate-400">
                  No records found.
                </td>
              </tr>
            )}

            {!isLoading &&
              data.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-800/80 hover:bg-slate-850 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="p-4 text-slate-200">
                      {String(row[col.key])}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="p-4 flex gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="px-3 py-1.5 bg-slate-800 text-indigo-400 hover:bg-slate-750 hover:text-indigo-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-slate-700"
                        >
                          <i className="bi bi-pencil-square"></i>
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="px-3 py-1.5 bg-slate-800 text-red-400 hover:bg-slate-750 hover:text-red-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-slate-700"
                        >
                          <i className="bi bi-trash-fill"></i>
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950">
        <div className="text-xs text-slate-400">
          Page <span className="font-semibold text-slate-200">{page}</span> of{' '}
          <span className="font-semibold text-slate-200">{totalPages || 1}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || isLoading}
            className="px-3 py-1.5 text-xs font-semibold text-slate-400 border border-slate-800 rounded-lg hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || isLoading}
            className="px-3 py-1.5 text-xs font-semibold text-slate-400 border border-slate-800 rounded-lg hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
