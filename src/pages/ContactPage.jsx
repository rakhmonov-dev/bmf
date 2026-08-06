import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Phone, MapPin, Clock, Send as SendIcon, ChevronDown } from 'lucide-react';
import { sendMessage, getFaqs, getPublicSettings } from '../services/contentService';
import Button from '../components/shared/Button';

export default function ContactPage() {
  const [settings, setSettings] = useState({});
  const [faqs, setFaqs] = useState([]);
  const [openFaqId, setOpenFaqId] = useState(null);

  const [formData, setFormData] = useState({ fullName: '', phone: '', email: '', subject: '', messageText: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([getPublicSettings(), getFaqs()])
      .then(([settingsData, faqsData]) => {
        setSettings(settingsData);
        setFaqs(faqsData);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await sendMessage(formData);
      toast.success("Xabaringiz yuborildi! Tez orada bog'lanamiz.");
      setFormData({ fullName: '', phone: '', email: '', subject: '', messageText: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Xatolik yuz berdi. Qayta urinib ko\'ring.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="pt-32 pb-20">
      <div className="container-wide px-6 md:px-10 lg:px-16">
        <div className="text-center mb-16 max-w-xl mx-auto">
          <span className="text-gold-600 text-xs font-semibold uppercase tracking-widest mb-3 block">
            Aloqa
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-semibold text-ink-900 mb-4">
            Bog'laning
          </h1>
          <p className="text-slate-500">Savollaringiz bo'lsa, xabar qoldiring — tez orada javob beramiz</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 mb-24">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {settings.contact_phone && (
              <ContactCard icon={Phone} label="Telefon" value={settings.contact_phone} href={`tel:${settings.contact_phone}`} />
            )}
            {settings.contact_address && (
              <ContactCard icon={MapPin} label="Manzil" value={settings.contact_address} />
            )}
            {settings.contact_working_hours && (
              <ContactCard icon={Clock} label="Ish vaqti" value={settings.contact_working_hours} />
            )}

            {settings.contact_map_embed && (
              <div className="rounded-2xl overflow-hidden h-64 mt-2">
                <iframe
                  src={settings.contact_map_embed}
                  className="w-full h-full border-0"
                  loading="lazy"
                  title="Manzil xaritasi"
                />
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="lg:col-span-3 bg-slate-50 rounded-2xl p-8 flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Ism familiya *"
                value={formData.fullName}
                onChange={(v) => setFormData((p) => ({ ...p, fullName: v }))}
                required
              />
              <Input
                label="Telefon"
                value={formData.phone}
                onChange={(v) => setFormData((p) => ({ ...p, phone: v }))}
                placeholder="+998 90 123 45 67"
              />
            </div>
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(v) => setFormData((p) => ({ ...p, email: v }))}
            />
            <Input
              label="Mavzu"
              value={formData.subject}
              onChange={(v) => setFormData((p) => ({ ...p, subject: v }))}
            />
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1.5 block">Xabar *</label>
              <textarea
                required
                rows={5}
                value={formData.messageText}
                onChange={(e) => setFormData((p) => ({ ...p, messageText: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-400/50 text-sm resize-none"
              />
            </div>
            <Button type="submit" isLoading={isSubmitting} className="!justify-center mt-1">
              <SendIcon className="w-4 h-4" />
              Yuborish
            </Button>
          </form>
        </div>

        {faqs.length > 0 && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-display font-semibold text-ink-900 text-center mb-8">
              Tez-tez so'raladigan savollar
            </h2>
            <div className="flex flex-col gap-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="font-medium text-ink-900 text-sm">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${
                        openFaqId === faq.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaqId === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-sm text-slate-500 leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ContactCard({ icon: Icon, label, value, href }) {
  const content = (
    <div className="flex items-start gap-4 bg-slate-50 rounded-2xl p-5">
      <div className="w-10 h-10 rounded-lg bg-ink-900 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-gold-400" />
      </div>
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
        <p className="font-medium text-ink-900">{value}</p>
      </div>
    </div>
  );

  return href ? <a href={href}>{content}</a> : content;
}

function Input({ label, value, onChange, type = 'text', required = false, placeholder = '' }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-600 mb-1.5 block">{label}</label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-400/50 text-sm"
      />
    </div>
  );
}
