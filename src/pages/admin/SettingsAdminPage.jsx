import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';
import { getAllSettingsAdmin, bulkUpdateSettings } from '../../services/contentService';
import { LoadingSpinner } from '../../components/shared/Common';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const GROUP_LABELS = {
  hero: 'Bosh sahifa (Hero)',
  about: 'Biz haqimizda',
  contact: 'Aloqa',
  seo: 'SEO',
};

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState([]);
  const [values, setValues] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getAllSettingsAdmin()
      .then((data) => {
        setSettings(data);
        const initialValues = {};
        data.forEach((s) => { initialValues[s.setting_key] = s.setting_value || ''; });
        setValues(initialValues);
      })
      .catch(() => toast.error('Yuklashda xatolik yuz berdi.'))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleSaveAll() {
    setIsSaving(true);
    try {
      const updates = Object.entries(values).map(([key, value]) => ({ key, value }));
      await bulkUpdateSettings(updates);
      toast.success('Sozlamalar saqlandi.');
    } catch (error) {
      toast.error('Saqlashda xatolik yuz berdi.');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <LoadingSpinner />;

  const groupedSettings = settings.reduce((acc, s) => {
    if (!acc[s.setting_group]) acc[s.setting_group] = [];
    acc[s.setting_group].push(s);
    return acc;
  }, {});

  return (
    <div>
      <AdminPageHeader
        title="Sozlamalar"
        description="Sayt matnlari va aloqa ma'lumotlarini tahrirlash"
        action={
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-300 disabled:opacity-50 text-ink-900 font-semibold text-sm px-5 py-2.5 rounded-full transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saqlanmoqda...' : 'Barchasini saqlash'}
          </button>
        }
      />

      <div className="flex flex-col gap-8">
        {Object.entries(groupedSettings).map(([group, items]) => (
          <div key={group}>
            <h3 className="text-sm font-semibold text-gold-600 uppercase tracking-wide mb-3">
              {GROUP_LABELS[group] || group}
            </h3>
            <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col gap-4">
              {items.map((setting) => (
                <div key={setting.setting_key}>
                  <label className="text-sm font-medium text-slate-600 mb-1.5 block">
                    {setting.label}
                  </label>
                  {setting.setting_type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={values[setting.setting_key] || ''}
                      onChange={(e) => setValues((p) => ({ ...p, [setting.setting_key]: e.target.value }))}
                      className="input-base resize-none"
                    />
                  ) : (
                    <input
                      type={setting.setting_type === 'number' ? 'number' : 'text'}
                      value={values[setting.setting_key] || ''}
                      onChange={(e) => setValues((p) => ({ ...p, [setting.setting_key]: e.target.value }))}
                      className="input-base"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
