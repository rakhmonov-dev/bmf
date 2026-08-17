import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Menu, GraduationCap } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobil top-bar — faqat md dan kichik ekranlarda ko'rinadi, sidebar'ni ochadi */}
      <header className="md:hidden sticky top-0 z-30 flex items-center gap-3 bg-ink-900 px-4 py-3.5">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Menyuni ochish"
          className="w-9 h-9 -ml-1 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="w-7 h-7 rounded-lg bg-gold-400 flex items-center justify-center">
          <GraduationCap className="w-4 h-4 text-ink-900" strokeWidth={2.2} />
        </div>
        <p className="font-display font-semibold text-white text-sm">BMG School Admin</p>
      </header>

      <main className="md:ml-64 p-4 sm:p-6 md:p-8">
        <Outlet />
      </main>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
    </div>
  );
}
