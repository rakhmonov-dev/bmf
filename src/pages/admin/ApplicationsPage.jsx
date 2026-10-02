import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Search, Trash2, ChevronLeft, ChevronRight, Phone, Send } from 'lucide-react';
import {
  getApplicationsAdmin, updateApplicationStatus, deleteApplication,
} from '../../services/testService';
import { LoadingSpinner, EmptyState } from '../../components/shared/Common';
import {
  APPLICATION_STATUS_DISPLAY, APPLICATION_STATUS_COLORS, CEFR_DISPLAY, formatDate,
} from '../../utils/formatters';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const STATUS_OPTIONS = Object.keys(APPLICATION_STATUS_DISPLAY);

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadApplications(page = 1) {
    setIsLoading(true);
    try {
      const result = await getApplicationsAdmin({
        page,
        limit: 15,
        status: statusFilter || undefined,
        search: search || undefined,
      });
      setApplications(result.data);
      setPagination(result.pagination);
    } catch (error) {
      toast.error('Arizalarni yuklashda xatolik yuz berdi.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadApplications(1);
  }, [statusFilter]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    loadApplications(1);
  }

  async function handleStatusChange(id, newStatus) {
    try {
      await updateApplicationStatus(id, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );
      toast.success('Status yangilandi.');
    } catch (error) {
      toast.error('Statusni yangilashda xatolik yuz berdi.');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteApplication(deleteTarget.id);
      toast.success("Ariza o'chirildi.");
      setDeleteTarget(null);
      loadApplications(pagination.page);
    } catch (error) {
      toast.error("O'chirishda xatolik yuz berdi.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Arizalar"
        description={`Jami ${pagination.total} ta ariza`}
      />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[220px] w-full sm:w-auto sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ism yoki telefon bo'yicha qidirish"
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50"
          />
        </form>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400/50"
        >
          <option value="">Barcha statuslar</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>{APPLICATION_STATUS_DISPLAY[status]}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : applications.length === 0 ? (
        <EmptyState title="Arizalar topilmadi" description="Filtrlarni o'zgartirib ko'ring." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Ism</th>
                <th className="text-left px-5 py-3 font-medium">Aloqa</th>
                <th className="text-left px-5 py-3 font-medium">Kurs</th>
                <th className="text-left px-5 py-3 font-medium">Daraja</th>
                <th className="text-left px-5 py-3 font-medium">Sana</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-ink-900">{app.full_name}</p>
                    <p className="text-xs text-slate-400">{app.age} yosh</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <a href={`tel:${app.phone}`} className="flex items-center gap-1.5 text-slate-600 hover:text-gold-600">
                      <Phone className="w-3.5 h-3.5" />
                      {app.phone}
                    </a>
                    {app.telegram_username && (
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Send className="w-3 h-3" />
                        {app.telegram_username}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{app.course_title || '—'}</td>
                  <td className="px-5 py-3.5">
                    {app.determined_level ? (
                      <span className="text-xs font-semibold text-gold-600 bg-gold-50 px-2.5 py-1 rounded-full">
                        {CEFR_DISPLAY[app.determined_level] || app.determined_level}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">{formatDate(app.created_at)}</td>
                  <td className="px-5 py-3.5">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className={`text-xs font-medium px-2.5 py-1.5 rounded-full border-0 focus:ring-2 focus:ring-gold-400/50 ${APPLICATION_STATUS_COLORS[app.status]}`}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>{APPLICATION_STATUS_DISPLAY[status]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setDeleteTarget(app)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
              <span className="text-xs text-slate-400">
                {pagination.page} / {pagination.totalPages} sahifa
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => loadApplications(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => loadApplications(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        description={`"${deleteTarget?.full_name}" arizasini o'chirmoqchimisiz?`}
      />
    </div>
  );
}
