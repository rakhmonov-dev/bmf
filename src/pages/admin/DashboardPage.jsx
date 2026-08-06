import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, ClipboardList, UserCheck, Sparkles } from 'lucide-react';
import { getDashboardStats } from '../../services/testService';
import { LoadingSpinner } from '../../components/shared/Common';
import { APPLICATION_STATUS_DISPLAY, formatDate } from '../../utils/formatters';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (!stats) return null;

  const dailyChartData = stats.dailyApplications.map((d) => ({
    date: formatDate(d.date).split(',')[0],
    count: d.count,
  }));

  return (
    <div>
      <AdminPageHeader title="Dashboard" description="Umumiy statistika va so'nggi arizalar" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon={ClipboardList} label="Jami arizalar" value={stats.totals.applications} accent="ink" />
        <StatCard icon={Sparkles} label="Yangi arizalar" value={stats.totals.newApplications} accent="gold" />
        <StatCard icon={UserCheck} label="O'qishga yozildi" value={stats.totals.enrolled} accent="emerald" />
        <StatCard icon={Users} label="Faol o'qituvchilar" value={stats.totals.teachers} accent="ink" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="font-semibold text-ink-900 mb-4">Oxirgi 30 kun — arizalar</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={dailyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ECEEF5" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#8B92AF" />
              <YAxis tick={{ fontSize: 11 }} stroke="#8B92AF" allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#E8A94C" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="font-semibold text-ink-900 mb-4">Status bo'yicha taqsimot</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats.statusBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ECEEF5" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#8B92AF" angle={-15} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11 }} stroke="#8B92AF" allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#0F1B3D" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h3 className="font-semibold text-ink-900 mb-4">So'nggi arizalar</h3>
        <div className="flex flex-col divide-y divide-slate-100">
          {stats.recentApplications.map((app) => (
            <div key={app.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-ink-900 text-sm">{app.full_name}</p>
                <p className="text-xs text-slate-400">{app.phone} · {app.course_title || 'Kurs tanlanmagan'}</p>
              </div>
              <span className="text-xs text-slate-400">{formatDate(app.created_at)}</span>
            </div>
          ))}
          {stats.recentApplications.length === 0 && (
            <p className="text-sm text-slate-400 py-4 text-center">Hozircha arizalar yo'q</p>
          )}
        </div>
      </div>
    </div>
  );
}

const ACCENT_STYLES = {
  ink: 'bg-ink-900 text-gold-400',
  gold: 'bg-gold-400 text-ink-900',
  emerald: 'bg-emerald-500 text-white',
};

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${ACCENT_STYLES[accent]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-display font-semibold text-ink-900">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}
