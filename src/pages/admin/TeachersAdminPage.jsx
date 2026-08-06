import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Users2 } from 'lucide-react';
import {
  getAllTeachersAdmin, createTeacher, updateTeacher, deleteTeacher,
} from '../../services/contentService';
import { LoadingSpinner, EmptyState } from '../../components/shared/Common';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const EMPTY_FORM = { fullName: '', specialty: '', experienceYears: '', bio: '', cefrLevels: '', isActive: true };

export default function TeachersAdminPage() {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [photoFile, setPhotoFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadData() {
    setIsLoading(true);
    try {
      setTeachers(await getAllTeachersAdmin());
    } catch (error) {
      toast.error('Yuklashda xatolik yuz berdi.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  function openCreateModal() {
    setEditingTeacher(null);
    setFormData(EMPTY_FORM);
    setPhotoFile(null);
    setIsModalOpen(true);
  }

  function openEditModal(teacher) {
    setEditingTeacher(teacher);
    setFormData({
      fullName: teacher.full_name,
      specialty: teacher.specialty || '',
      experienceYears: teacher.experience_years || '',
      bio: teacher.bio || '',
      cefrLevels: teacher.cefr_levels || '',
      isActive: Boolean(teacher.is_active),
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

      if (editingTeacher) {
        await updateTeacher(editingTeacher.id, payload);
        toast.success("O'qituvchi ma'lumotlari yangilandi.");
      } else {
        await createTeacher(payload);
        toast.success("O'qituvchi qo'shildi.");
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
      await deleteTeacher(deleteTarget.id);
      toast.success("O'qituvchi o'chirildi.");
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
        title="O'qituvchilar"
        description={`Jami ${teachers.length} ta o'qituvchi`}
        action={
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-300 text-ink-900 font-semibold text-sm px-4 py-2.5 rounded-full transition-colors"
          >
            <Plus className="w-4 h-4" />
            Yangi o'qituvchi
          </button>
        }
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : teachers.length === 0 ? (
        <EmptyState icon={Users2} title="O'qituvchilar mavjud emas" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="bg-white rounded-2xl border border-slate-100 p-5 text-center">
              {teacher.photo_url ? (
                <img src={teacher.photo_url} alt={teacher.full_name} className="w-16 h-16 rounded-full object-cover mx-auto mb-3" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-ink-900 flex items-center justify-center text-gold-400 font-semibold mx-auto mb-3">
                  {teacher.full_name.charAt(0)}
                </div>
              )}
              <h3 className="font-medium text-ink-900 text-sm">{teacher.full_name}</h3>
              <p className="text-xs text-gold-600 mb-3">{teacher.specialty}</p>
              {!teacher.is_active && (
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Nofaol</span>
              )}
              <div className="flex justify-center gap-1 mt-3 pt-3 border-t border-slate-100">
                <button onClick={() => openEditModal(teacher)} className="p-1.5 text-slate-400 hover:text-ink-900">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteTarget(teacher)} className="p-1.5 text-slate-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTeacher ? "O'qituvchini tahrirlash" : "Yangi o'qituvchi qo'shish"}
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <FormField label="Ism familiya *">
            <input
              required
              value={formData.fullName}
              onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
              className="input-base"
            />
          </FormField>

          <FormField label="Mutaxassisligi">
            <input
              value={formData.specialty}
              onChange={(e) => setFormData((p) => ({ ...p, specialty: e.target.value }))}
              placeholder="Masalan: IELTS, Business English"
              className="input-base"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Tajriba (yil)">
              <input
                type="number" min={0}
                value={formData.experienceYears}
                onChange={(e) => setFormData((p) => ({ ...p, experienceYears: e.target.value }))}
                className="input-base"
              />
            </FormField>
            <FormField label="CEFR darajalari">
              <input
                placeholder="Masalan: A1-C1"
                value={formData.cefrLevels}
                onChange={(e) => setFormData((p) => ({ ...p, cefrLevels: e.target.value }))}
                className="input-base"
              />
            </FormField>
          </div>

          <FormField label="Bio">
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value }))}
              className="input-base resize-none"
            />
          </FormField>

          <FormField label="Rasm">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setPhotoFile(e.target.files[0])}
              className="input-base"
            />
          </FormField>

          {editingTeacher && (
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                className="rounded"
              />
              Faol (saytda ko'rsatiladi)
            </label>
          )}

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
        description={`"${deleteTarget?.full_name}"ni o'chirmoqchimisiz?`}
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
