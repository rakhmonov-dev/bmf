import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, HelpCircle } from 'lucide-react';
import { getAllFaqsAdmin, createFaq, updateFaq, deleteFaq } from '../../services/contentService';
import { LoadingSpinner, EmptyState } from '../../components/shared/Common';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const EMPTY_FORM = { question: '', answer: '', category: '' };

export default function FaqsAdminPage() {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadData() {
    setIsLoading(true);
    try {
      setFaqs(await getAllFaqsAdmin());
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
    setFormData({ question: item.question, answer: item.answer, category: item.category || '' });
    setIsModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingItem) {
        await updateFaq(editingItem.id, formData);
        toast.success('Savol yangilandi.');
      } else {
        await createFaq(formData);
        toast.success("Savol qo'shildi.");
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
      await deleteFaq(deleteTarget.id);
      toast.success("Savol o'chirildi.");
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
        title="Tez-tez so'raladigan savollar"
        description={`Jami ${faqs.length} ta savol`}
        action={
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-300 text-ink-900 font-semibold text-sm px-4 py-2.5 rounded-full transition-colors"
          >
            <Plus className="w-4 h-4" />
            Yangi savol
          </button>
        }
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : faqs.length === 0 ? (
        <EmptyState icon={HelpCircle} title="Savollar mavjud emas" />
      ) : (
        <div className="flex flex-col gap-3">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-xl border border-slate-100 p-5 flex items-start justify-between gap-4">
              <div>
                {faq.category && (
                  <span className="text-xs font-medium text-gold-600 bg-gold-50 px-2 py-0.5 rounded-full mb-2 inline-block">
                    {faq.category}
                  </span>
                )}
                <p className="font-medium text-ink-900 text-sm mb-1">{faq.question}</p>
                <p className="text-sm text-slate-500">{faq.answer}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => openEditModal(faq)} className="p-1.5 text-slate-400 hover:text-ink-900">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteTarget(faq)} className="p-1.5 text-slate-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Savolni tahrirlash' : "Yangi savol qo'shish"}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <FormField label="Savol *">
            <input required value={formData.question} onChange={(e) => setFormData((p) => ({ ...p, question: e.target.value }))} className="input-base" />
          </FormField>
          <FormField label="Javob *">
            <textarea required rows={4} value={formData.answer} onChange={(e) => setFormData((p) => ({ ...p, answer: e.target.value }))} className="input-base resize-none" />
          </FormField>
          <FormField label="Kategoriya">
            <input value={formData.category} onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))} placeholder="Masalan: Narxlar" className="input-base" />
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
        description="Bu savolni o'chirmoqchimisiz?"
      />
    </div>
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
