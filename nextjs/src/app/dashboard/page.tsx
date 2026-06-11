'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DataTable, { Column } from '../components/DataTable';

interface User {
  id: number;
  name: string;
  email: string;
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const sortBy = searchParams.get('sortBy') || 'id';
  const order = (searchParams.get('order') || 'asc') as 'asc' | 'desc';
  const search = searchParams.get('search') || '';

  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchInput, setSearchInput] = useState(search);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const columns: Column<User>[] = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true }
  ];

  const fetchUsers = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sortBy,
        order,
        search
      });
      const response = await fetch(`/api/users?${query.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setTotalPages(data.pagination.totalPages);
        setTotalUsers(data.pagination.total);
      } else {
        setIsError(true);
        if (response.status === 401) {
          router.push('/login');
        }
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit, sortBy, order, search]);

  const updateQueryParams = (updates: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val === '') {
        params.delete(key);
      } else {
        params.set(key, String(val));
      }
    });
    router.push(`/dashboard?${params.toString()}`);
  };

  const handleSort = (key: string) => {
    const nextOrder = sortBy === key && order === 'asc' ? 'desc' : 'asc';
    updateQueryParams({ sortBy: key, order: nextOrder, page: 1 });
  };

  const handlePageChange = (nextPage: number) => {
    updateQueryParams({ page: nextPage });
  };

  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      updateQueryParams({ search: val, page: 1 });
    }, 400);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col relative overflow-x-hidden">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-800 bg-slate-950">
        <h1 className="text-xl font-bold text-white">Dashboard / User Management</h1>
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.push('/static')}
            className="text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Static Demo Page
          </button>
          <div className="text-xs text-slate-450">
            Session: <span className="text-slate-300">hellygoswami1810@gmail.com</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-slate-850 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="p-8 max-w-6xl mx-auto w-full flex-1">
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4 flex-1 min-w-[280px]">
              <div className="relative flex-1 max-w-md">
                <span className="absolute left-3.5 top-2.5 text-slate-500">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>
              <span className="text-xs font-semibold bg-slate-900 text-indigo-400 px-3 py-1.5 rounded-lg border border-slate-800 whitespace-nowrap">
                Total: {totalUsers} users
              </span>
            </div>
          </div>

          {isError && (
            <div className="p-4 bg-red-950 border border-red-800 rounded-lg text-red-100 text-sm flex items-center justify-between">
              <span>Failed to fetch users. Please try reloading.</span>
              <button
                onClick={fetchUsers}
                className="px-3 py-1.5 bg-red-900 border border-red-855 rounded-lg text-xs font-semibold hover:bg-red-800 transition-colors cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          <DataTable
            data={users}
            columns={columns}
            sortBy={sortBy}
            order={order}
            onSort={handleSort}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0f172a] text-slate-100 flex items-center justify-center">
          <span className="w-8 h-8 border-2 border-slate-800 border-t-indigo-500 rounded-full animate-spin"></span>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
