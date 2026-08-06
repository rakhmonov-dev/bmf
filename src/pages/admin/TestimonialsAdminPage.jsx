import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Quote, Star } from 'lucide-react';
import {
  getAllTestimonialsAdmin, createTestimonial, updateTestimonial, deleteTestimonial,
} from '../../services/contentService';
import { LoadingSpinner, EmptyState } from '../../components/shared/Common';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const CEFR_OPTIONS = ['Boshlangich', 'A1', 'A2', 'B1', 'B2', 'C1'];
const EMPTY_FORM = { fullName: '', achievedLevel: '', quoteText: '', rating: 5, isActive: true };

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [photoFile, setPhotoFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadData() {
    setIsLoading(true);
    try {
      setTestimonials(await getAllTestimonialsAdmin());
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
    setPhotoFile(null);
    setIsModalOpen(true);
  }

  function openEditModal(item) {
    setEditingItem(item);
    setFormData({
      fullName: item.full_name,
      achievedLevel: item.achieved_level || '',
      quoteText: item.quote_text,
      rating: item.rating,
      isActive: Boolean(item.is_active),
    });
    setPhotoFile(null);
    setIsModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
      if (photoFile) payload.append('photo', photoFile);

      if (editingItem) {
        await updateTestimonial(editingItem.id, payload);
        toast.success('Fikr yangilandi.');
      } else {
        await createTestimonial(payload);
        toast.success("Fikr qo'shildi.");
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
      await deleteTestimonial(deleteTarget.id);
      toast.success("Fikr o'chirildi.");
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
        title="Fikrlar"
        description={`Jami ${testimonials.length} ta fikr`}
        action={
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-300 text-ink-900 font-semibold text-sm px-4 py-2.5 rounded-full transition-colors"
          >
            <Plus className="w-4 h-4" />
            Yangi fikr
          </button>
        }
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : testimonials.length === 0 ? (
        <EmptyState icon={Quote} title="Fikrlar mavjud emas" />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <p className="text-sm text-slate-600 mb-4 line-clamp-3">"{item.quote_text}"</p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <p className="text-sm font-medium text-ink-900">{item.full_name}</p>
                  {item.achieved_level && <p className="text-xs text-gold-600">{item.achieved_level}</p>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEditModal(item)} className="p-1.5 text-slate-400 hover:text-ink-900">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(item)} className="p-1.5 text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Fikrni tahrirlash' : "Yangi fikr qo'shish"}
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <FormField label="Ism familiya *">
            <input required value={formData.fullName} onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))} className="input-base" />
          </FormField>
          <FormField label="Fikr matni *">
            <textarea required rows={3} value={formData.quoteText} onChange={(e) => setFormData((p) => ({ ...p, quoteText: e.target.value }))} className="input-base resize-none" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Erishgan daraja">
              <select value={formData.achievedLevel} onChange={(e) => setFormData((p) => ({ ...p, achievedLevel: e.target.value }))} className="input-base">
                <option value="">Tanlanmagan</option>
                {CEFR_OPTIONS.map((lvl) => <option key={lvl} value={lvl}>{lvl}</option>)}
              </select>
            </FormField>
            <FormField label="Baho (1-5)">
              <input type="number" min={1} max={5} value={formData.rating} onChange={(e) => setFormData((p) => ({ ...p, rating: e.target.value }))} className="input-base" />
            </FormField>
          </div>
          <FormField label="Rasm">
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setPhotoFile(e.target.files[0])} className="input-base" />
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
        description={`"${deleteTarget?.full_name}" fikrini o'chirmoqchimisiz?`}
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
