import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Images, EyeOff } from 'lucide-react';
import {
  getAllGalleryImagesAdmin, createGalleryImage, updateGalleryImage, deleteGalleryImage,
} from '../../services/contentService';
import { LoadingSpinner, EmptyState } from '../../components/shared/Common';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const EMPTY_FORM = { caption: '', category: '', displayOrder: 0, isActive: true };

export default function GalleryAdminPage() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadData() {
    setIsLoading(true);
    try {
      setImages(await getAllGalleryImagesAdmin());
    } catch (error) {
      toast.error('Suratlarni yuklashda xatolik yuz berdi.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  // Yuklangan faylning oldindan ko'rinishini yaratish, modal yopilganda tozalash
  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  function openCreateModal() {
    setEditingItem(null);
    setFormData(EMPTY_FORM);
    setImageFile(null);
    setIsModalOpen(true);
  }

  function openEditModal(item) {
    setEditingItem(item);
    setFormData({
      caption: item.caption || '',
      category: item.category || '',
      displayOrder: item.display_order,
      isActive: Boolean(item.is_active),
    });
    setImageFile(null);
    setIsModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();

    if (!editingItem && !imageFile) {
      toast.error('Iltimos, rasm faylini tanlang.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
      if (imageFile) payload.append('image', imageFile);

      if (editingItem) {
        await updateGalleryImage(editingItem.id, payload);
        toast.success('Surat yangilandi.');
      } else {
        await createGalleryImage(payload);
        toast.success("Surat qo'shildi.");
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
      await deleteGalleryImage(deleteTarget.id);
      toast.success("Surat o'chirildi.");
      setDeleteTarget(null);
      loadData();
    } catch (error) {
      toast.error("O'chirishda xatolik yuz berdi.");
    } finally {
      setIsDeleting(false);
    }
  }

  async function toggleActive(item) {
    try {
      const payload = new FormData();
      payload.append('isActive', !item.is_active);
      await updateGalleryImage(item.id, payload);
      loadData();
    } catch (error) {
      toast.error('Xatolik yuz berdi.');
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Galereya"
        description={`Jami ${images.length} ta surat — bosh sahifada va "Biz haqimizda" sahifasida ko'rinadi`}
        action={
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-300 text-ink-900 font-semibold text-sm px-4 py-2.5 rounded-full transition-colors"
          >
            <Plus className="w-4 h-4" />
            Yangi surat
          </button>
        }
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : images.length === 0 ? (
        <EmptyState icon={Images} title="Suratlar mavjud emas" description="Birinchi suratni qo'shing." />
      ) : (
        <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border overflow-hidden ${item.is_active ? 'border-slate-100' : 'border-slate-100 opacity-60'}`}
            >
              <div className="aspect-square bg-slate-100 relative">
                <img src={item.image_url} alt={item.caption || ''} className="w-full h-full object-cover" />
                {!item.is_active && (
                  <div className="absolute top-2 right-2 bg-ink-900/80 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                    <EyeOff className="w-3 h-3" /> Yashirin
                  </div>
                )}
              </div>
              <div className="p-3">
                {item.caption && <p className="text-xs text-slate-600 line-clamp-1 mb-2">{item.caption}</p>}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(item)}
                    className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <Pencil className="w-3 h-3" /> Tahrirlash
                  </button>
                  <button
                    onClick={() => toggleActive(item)}
                    className="py-1.5 px-2.5 rounded-full border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"
                    title={item.is_active ? 'Yashirish' : "Ko'rsatish"}
                  >
                    {item.is_active ? <EyeOff className="w-3 h-3" /> : <Images className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="py-1.5 px-2.5 rounded-full border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
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
        title={editingItem ? 'Suratni tahrirlash' : "Yangi surat qo'shish"}
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <FormField label={editingItem ? 'Rasm (o\'zgartirish uchun tanlang)' : 'Rasm *'}>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="input-base"
            />
          </FormField>

          {(previewUrl || editingItem?.image_url) && (
            <div className="rounded-xl overflow-hidden bg-slate-100 aspect-video">
              <img
                src={previewUrl || editingItem.image_url}
                alt="Oldindan ko'rish"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <FormField label="Izoh">
            <input
              value={formData.caption}
              onChange={(e) => setFormData((p) => ({ ...p, caption: e.target.value }))}
              placeholder="Masalan: Sertifikat topshirish kuni"
              className="input-base"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Kategoriya">
              <input
                value={formData.category}
                onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                placeholder="Masalan: Darslar"
                className="input-base"
              />
            </FormField>
            <FormField label="Tartib raqami">
              <input
                type="number"
                min={0}
                value={formData.displayOrder}
                onChange={(e) => setFormData((p) => ({ ...p, displayOrder: e.target.value }))}
                className="input-base"
              />
            </FormField>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="mt-2 bg-gold-400 hover:bg-gold-300 disabled:opacity-50 text-ink-900 font-semibold py-3 rounded-full transition-colors"
          >
            {isSaving ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        description="Bu suratni butunlay o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi."
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
