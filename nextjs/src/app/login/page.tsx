'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        const data = await response.json();
        setErrorMsg(data.error || 'Login failed');
        setIsLoading(false);
      }
    } catch {
      setErrorMsg('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f172a] text-slate-100 p-4">
      <div className="relative w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Admin Portal</h2>
          <p className="text-sm text-slate-400">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              required
              placeholder="hellygoswami1810@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-75 disabled:cursor-not-allowed text-sm font-semibold text-white rounded-lg transition-colors"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 p-4 bg-slate-950 rounded-lg border border-slate-800 text-center text-xs text-slate-400">
          <p className="mb-1">Demo Credentials:</p>
          <code className="text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded mr-1">hellygoswami1810@gmail.com</code> / <code className="text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded ml-1">Helly@001</code>
        </div>
      </div>

      {errorMsg && (
        <div className="absolute top-6 right-6 flex items-center gap-3 p-4 bg-red-900 border border-red-800 text-red-100 rounded-lg shadow">
          <span className="flex items-center justify-center w-5 h-5 bg-red-700 text-white font-bold text-[10px] rounded-full">✕</span>
          <span className="text-sm font-medium">{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
