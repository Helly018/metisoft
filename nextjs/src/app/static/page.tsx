'use client';

import { useRouter } from 'next/navigation';

export default function StaticPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col">
      <nav className="flex items-center justify-between px-8 py-4 bg-slate-950 border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-tight text-white cursor-pointer" onClick={() => router.push('/dashboard')}>Admin Dashboard</h1>
        <button
          onClick={() => router.push('/login')}
          className="px-4 py-2 border border-slate-800 rounded-lg text-xs font-medium text-slate-400 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
        >
          Go to Login
        </button>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-8 max-w-2xl mx-auto text-center gap-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-white">Public Static Page</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          This is a public route that does not require authentication. Unauthenticated users can access this page without being redirected by the middleware.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold text-white rounded-lg transition-colors cursor-pointer"
          >
            Access Protected Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}
