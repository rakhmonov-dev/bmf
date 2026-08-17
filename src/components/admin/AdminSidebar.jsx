import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Users2, FileQuestion, ClipboardList,
  Quote, HelpCircle, Mail, Settings, Bot, LogOut, GraduationCap, Images, X,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/applications', label: 'Arizalar', icon: ClipboardList },
  { to: '/admin/courses', label: 'Kurslar', icon: BookOpen },
  { to: '/admin/teachers', label: "O'qituvchilar", icon: Users2 },
  { to: '/admin/questions', label: 'Test savollari', icon: FileQuestion },
  { to: '/admin/testimonials', label: 'Fikrlar', icon: Quote },
  { to: '/admin/gallery', label: 'Galereya', icon: Images },
  { to: '/admin/faqs', label: 'FAQ', icon: HelpCircle },
  { to: '/admin/messages', label: 'Xabarlar', icon: Mail },
  { to: '/admin/ai-support', label: 'AI Support', icon: Bot },
  { to: '/admin/settings', label: 'Sozlamalar', icon: Settings },
];

/**
 * Mobil qurilmalarda sidebar ekrandan tashqarida (-translate-x-full)
 * turadi va faqat `isOpen` true bo'lganda ichkariga sirg'alib kiradi.
 * md+ ekranlarda esa har doim ko'rinadi (md:translate-x-0), hamburger
 * tugmasi kerak emas — bu AdminLayout'dagi mobil top-bar orqali boshqariladi.
 */
export default function AdminSidebar({ isOpen = false, onClose }) {
  const { admin, logout } = useAuthStore();

  function handleNavClick() {
    // Mobilda havola bosilganda panelni avtomatik yopish
    onClose?.();
  }

  return (
    <>
      {/* Mobil orqa fon — sidebar ochiq bo'lganda bosilsa yopiladi */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-ink-950/60 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`w-64 bg-ink-900 min-h-screen flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between gap-2.5 px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gold-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-ink-900" strokeWidth={2.2} />
            </div>
            <div>
              <p className="font-display font-semibold text-white text-sm">BMG School</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Admin panel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Yopish"
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium mb-1 transition-colors ${
                  isActive
                    ? 'bg-gold-400 text-ink-900'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon className="w-4.5 h-4.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <div className="px-3.5 py-2 mb-2">
            <p className="text-white text-sm font-medium truncate">{admin?.fullName}</p>
            <p className="text-slate-400 text-xs truncate">{admin?.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full"
          >
            <LogOut className="w-4.5 h-4.5" />
            Chiqish
          </button>
        </div>
      </aside>
    </>
  );
}
