import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    clearError();
    const success = await login(email, password);
    if (success) {
      navigate('/admin/dashboard');
    }
  }

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl" />

      <div className="w-full max-w-sm relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gold-400 flex items-center justify-center mb-4">
            <GraduationCap className="w-7 h-7 text-ink-900" strokeWidth={2.2} />
          </div>
          <h1 className="font-display font-semibold text-xl text-white">BMG School</h1>
          <p className="text-slate-400 text-sm">Admin panel</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/[0.04] border border-white/10 rounded-2xl p-7 backdrop-blur-sm flex flex-col gap-4"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-slate-300 mb-1.5 block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400"
              placeholder="admin@bmgschool.uz"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-1.5 block">Parol</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 inline-flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-300 disabled:opacity-50 text-ink-900 font-semibold py-3 rounded-full transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Kirilmoqda...
              </>
            ) : (
              'Kirish'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
