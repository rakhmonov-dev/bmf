import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Bot, CheckCircle2, AlertCircle, MessageSquareText } from 'lucide-react';
import {
  getKnowledgeBaseAdmin, createKnowledge, updateKnowledge, deleteKnowledge,
  getAiStatus, getChatLogsAdmin,
} from '../../services/aiService';
import { LoadingSpinner, EmptyState } from '../../components/shared/Common';
import { formatDateTime } from '../../utils/formatters';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const EMPTY_FORM = { topic: '', content: '', keywords: '' };

export default function AiSupportAdminPage() {
  const [knowledge, setKnowledge] = useState([]);
  const [logs, setLogs] = useState([]);
  const [aiStatus, setAiStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('knowledge');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadData() {
    setIsLoading(true);
    try {
      const [knowledgeData, statusData, logsData] = await Promise.all([
        getKnowledgeBaseAdmin(),
        getAiStatus(),
        getChatLogsAdmin({ limit: 20 }),
      ]);
      setKnowledge(knowledgeData);
      setAiStatus(statusData);
      setLogs(logsData.data);
    } catch (error) {
      toast.error('Yuklashda xatolik yuz berdi.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  function openCreateModal() {
    setEditingItem(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  }

  function openEditModal(item) {
    setEditingItem(item);
    setFormData({ topic: item.topic, content: item.content, keywords: item.keywords || '' });
    setIsModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingItem) {
        await updateKnowledge(editingItem.id, formData);
        toast.success('Bilim bazasi yangilandi.');
      } else {
        await createKnowledge(formData);
        toast.success("Bilim bazasiga qo'shildi.");
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Saqlashda xatolik yuz berdi.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteKnowledge(deleteTarget.id);
      toast.success("O'chirildi.");
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
      <AdminPageHeader
        title="AI Support"
        description="Chat bilim bazasi va suhbat tarixini boshqarish"
        action={
          activeTab === 'knowledge' && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-300 text-ink-900 font-semibold text-sm px-4 py-2.5 rounded-full transition-colors"
            >
              <Plus className="w-4 h-4" />
              Yangi bilim
            </button>
          )
        }
      />

      {aiStatus && (
        <div className={`rounded-xl px-5 py-3.5 mb-6 flex items-center gap-3 ${
          aiStatus.openaiConfigured ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'
        }`}>
          {aiStatus.openaiConfigured ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <p className="text-sm text-emerald-700">
                OpenAI ulangan — AI to'liq ishlamoqda.
              </p>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <p className="text-sm text-amber-700">
                OpenAI API kalit sozlanmagan — chat hozircha kalit so'zlarga asoslangan fallback rejimida ishlayapti.
                To'liq AI javoblar uchun <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs">.env</code> fayliga <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs">OPENAI_API_KEY</code> qo'shing.
              </p>
            </>
          )}
        </div>
      )}

      <div className="flex gap-2 mb-6 border-b border-slate-200">
        <TabButton active={activeTab === 'knowledge'} onClick={() => setActiveTab('knowledge')}>
          Bilim bazasi
        </TabButton>
        <TabButton active={activeTab === 'logs'} onClick={() => setActiveTab('logs')}>
          Suhbat tarixi
        </TabButton>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : activeTab === 'knowledge' ? (
        knowledge.length === 0 ? (
          <EmptyState icon={Bot} title="Bilim bazasi bo'sh" description="AI javob berishi uchun mavzular qo'shing." />
        ) : (
          <div className="flex flex-col gap-3">
            {knowledge.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-slate-100 p-5 flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-ink-900 text-sm mb-1">{item.topic}</p>
                  <p className="text-sm text-slate-500 mb-2">{item.content}</p>
                  {item.keywords && (
                    <p className="text-xs text-slate-400">Kalit so'zlar: {item.keywords}</p>
                  )}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEditModal(item)} className="p-1.5 text-slate-400 hover:text-ink-900">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(item)} className="p-1.5 text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        logs.length === 0 ? (
          <EmptyState icon={MessageSquareText} title="Hozircha suhbatlar yo'q" />
        ) : (
          <div className="flex flex-col gap-3">
            {logs.map((log) => (
              <div key={log.id} className="bg-white rounded-xl border border-slate-100 p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">{formatDateTime(log.created_at)}</span>
                  {Boolean(log.was_fallback) && (
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      FALLBACK
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-2"><strong>Savol:</strong> {log.user_message}</p>
                <p className="text-sm text-slate-500"><strong>Javob:</strong> {log.ai_response}</p>
              </div>
            ))}
          </div>
        )
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Bilimni tahrirlash' : "Yangi bilim qo'shish"}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <FormField label="Mavzu *">
            <input required value={formData.topic} onChange={(e) => setFormData((p) => ({ ...p, topic: e.target.value }))} placeholder="Masalan: Narxlar" className="input-base" />
          </FormField>
          <FormField label="Matn *">
            <textarea required rows={4} value={formData.content} onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))} className="input-base resize-none" />
          </FormField>
          <FormField label="Kalit so'zlar (vergul bilan)">
            <input value={formData.keywords} onChange={(e) => setFormData((p) => ({ ...p, keywords: e.target.value }))} placeholder="narx, narxlar, qancha" className="input-base" />
          </FormField>
          <button type="submit" disabled={isSaving} className="mt-2 bg-gold-400 hover:bg-gold-300 disabled:opacity-50 text-ink-900 font-semibold py-3 rounded-full transition-colors">
            {isSaving ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        description={`"${deleteTarget?.topic}"ni o'chirmoqchimisiz?`}
      />
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
        active ? 'border-gold-400 text-ink-900' : 'border-transparent text-slate-400 hover:text-slate-600'
      }`}
    >
      {children}
    </button>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-600 mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}
