import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, MailOpen, Trash2, Phone } from 'lucide-react';
import { getMessagesAdmin, markMessageAsRead, deleteMessage } from '../../services/contentService';
import { LoadingSpinner, EmptyState } from '../../components/shared/Common';
import { formatDateTime } from '../../utils/formatters';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadData() {
    setIsLoading(true);
    try {
      const result = await getMessagesAdmin({ limit: 50 });
      setMessages(result.data);
    } catch (error) {
      toast.error('Yuklashda xatolik yuz berdi.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  async function handleMarkAsRead(id) {
    try {
      await markMessageAsRead(id);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: 1 } : m)));
    } catch (error) {
      toast.error("Xatolik yuz berdi.");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteMessage(deleteTarget.id);
      toast.success("Xabar o'chirildi.");
      setDeleteTarget(null);
      loadData();
    } catch (error) {
      toast.error("O'chirishda xatolik yuz berdi.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <AdminPageHeader title="Xabarlar" description={`Jami ${messages.length} ta xabar`} />

      {isLoading ? (
        <LoadingSpinner />
      ) : messages.length === 0 ? (
        <EmptyState icon={Mail} title="Xabarlar mavjud emas" />
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-xl border p-5 ${msg.is_read ? 'border-slate-100' : 'border-gold-300 bg-gold-50/30'}`}
              onClick={() => !msg.is_read && handleMarkAsRead(msg.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {msg.is_read ? (
                    <MailOpen className="w-4 h-4 text-slate-400" />
                  ) : (
                    <Mail className="w-4 h-4 text-gold-500" />
                  )}
                  <p className="font-medium text-ink-900 text-sm">{msg.full_name}</p>
                  {!msg.is_read && (
                    <span className="text-[10px] font-semibold text-gold-700 bg-gold-100 px-2 py-0.5 rounded-full">
                      YANGI
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteTarget(msg); }}
                  className="p-1 text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                {msg.phone && (
                  <a href={`tel:${msg.phone}`} className="flex items-center gap-1 hover:text-gold-600" onClick={(e) => e.stopPropagation()}>
                    <Phone className="w-3 h-3" />
                    {msg.phone}
                  </a>
                )}
                {msg.email && <span>{msg.email}</span>}
                <span>{formatDateTime(msg.created_at)}</span>
              </div>

              {msg.subject && <p className="text-sm font-medium text-slate-700 mb-1">{msg.subject}</p>}
              <p className="text-sm text-slate-500 leading-relaxed">{msg.message_text}</p>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        description={`"${deleteTarget?.full_name}" xabarini o'chirmoqchimisiz?`}
      />
    </div>
  );
}
