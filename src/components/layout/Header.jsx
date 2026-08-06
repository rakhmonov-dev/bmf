import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react';

const NAV_LINKS = [
  { to: '/', label: 'Bosh sahifa' },
  { to: '/kurslar', label: 'Kurslar' },
  { to: '/biz-haqimizda', label: 'Biz haqimizda' },
  { to: '/aloqa', label: 'Aloqa' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-ink-900/95 backdrop-blur-md shadow-lg shadow-ink-900/10'
          : 'bg-transparent'
      }`}
    >
      <div className="container-wide px-6 md:px-10 lg:px-16">
        <nav className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-lg bg-gold-400 flex items-center justify-center transition-transform group-hover:scale-105">
              <GraduationCap className="w-6 h-6 text-ink-900" strokeWidth={2.2} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display font-semibold text-lg text-white">BMG School</span>
              <span className="text-[10px] uppercase tracking-wider text-gold-300">Samarqand</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors relative py-1 ${
                    isActive ? 'text-gold-300' : 'text-slate-200 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold-400 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="hidden lg:block">
            <Link
              to="/test"
              className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-300 text-ink-900 font-semibold text-sm px-5 py-2.5 rounded-full transition-all hover:scale-105 shadow-lg shadow-gold-400/20"
            >
              Darajangizni bilib oling
            </Link>
          </div>

          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Menyuni ochish"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-ink-900 border-t border-white/10 animate-fade-up">
          <div className="px-6 py-6 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-white/10 text-gold-300' : 'text-slate-200'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/test"
              className="mt-3 inline-flex items-center justify-center gap-2 bg-gold-400 text-ink-900 font-semibold text-sm px-5 py-3 rounded-full"
            >
              Darajangizni bilib oling
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
