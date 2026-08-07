import { Link } from 'react-router-dom';
import { GraduationCap, Phone, MapPin, Clock, Send, Instagram } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getPublicSettings } from '../../services/contentService';

export default function Footer() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    getPublicSettings().then(setSettings).catch(() => {});
  }, []);

  return (
    <footer className="bg-ink-950 text-slate-300">
      <div className="container-wide section-padding !py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gold-400 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-ink-900" strokeWidth={2.2} />
              </div>
              <span className="font-display font-semibold text-lg text-white">BMG School</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Samarqand shahridagi ingliz tili o'quv markazi. Boshlang'ichdan
              C1 darajasigacha — tajribali o'qituvchilar va aniq metodika bilan.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium text-sm mb-4 uppercase tracking-wide">Sahifalar</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/kurslar" className="hover:text-gold-300 transition-colors">Kurslar</Link></li>
              <li><Link to="/test" className="hover:text-gold-300 transition-colors">Darajani aniqlash testi</Link></li>
              <li><Link to="/biz-haqimizda" className="hover:text-gold-300 transition-colors">Biz haqimizda</Link></li>
              <li><Link to="/aloqa" className="hover:text-gold-300 transition-colors">Aloqa</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium text-sm mb-4 uppercase tracking-wide">Aloqa</h4>
            <ul className="space-y-3 text-sm">
              {settings.contact_phone && (
                <li className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 mt-0.5 text-gold-400 flex-shrink-0" />
                  <a href={`tel:${settings.contact_phone}`} className="hover:text-gold-300 transition-colors">
                    {settings.contact_phone}
                  </a>
                </li>
              )}
              {settings.contact_address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 mt-0.5 text-gold-400 flex-shrink-0" />
                  <span>{settings.contact_address}</span>
                </li>
              )}
              {settings.contact_working_hours && (
                <li className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 mt-0.5 text-gold-400 flex-shrink-0" />
                  <span>{settings.contact_working_hours}</span>
                </li>
              )}
            </ul>
            <div className="flex gap-3 mt-5">
              {settings.contact_telegram && (
                <a
                  href={settings.contact_telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-gold-400 hover:text-ink-900 flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4" />
                </a>
              )}
              {settings.contact_instagram && (
                <a
                  href={settings.contact_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-gold-400 hover:text-ink-900 flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 text-center text-xs text-slate-500">
          <span>© {new Date().getFullYear()} BMG School. Barcha huquqlar himoyalangan.</span>
        </div>
      </div>
    </footer>
  );
}
