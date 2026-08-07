import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-center px-6">
      <div>
        <h1 className="text-5xl font-display font-semibold text-ink-900 mb-3">404</h1>
        <p className="text-slate-500 mb-6">Bu sahifa topilmadi.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-300 text-ink-900 font-semibold px-6 py-3 rounded-full transition-colors"
        >
          Bosh sahifaga qaytish
        </Link>
      </div>
    </div>
  );
}
