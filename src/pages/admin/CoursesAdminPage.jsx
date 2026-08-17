import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import {
  getAllCoursesAdmin, createCourse, updateCourse, deleteCourse,
} from '../../services/contentService';
import { getAllTeachersAdmin } from '../../services/contentService';
import { LoadingSpinner, EmptyState } from '../../components/shared/Common';
import { formatPrice, CEFR_DISPLAY } from '../../utils/formatters';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const CEFR_OPTIONS = ['Boshlangich', 'A1', 'A2', 'B1', 'B2', 'C1'];
const ICON_OPTIONS = ['BookOpen', 'MessageCircle', 'TrendingUp', 'Award', 'Briefcase', 'Smile', 'Globe', 'Mic'];

const EMPTY_FORM = {
  title: '', description: '', cefrLevelFrom: 'A1', cefrLevelTo: 'A2',
  durationMonths: 6, lessonsPerWeek: 3, priceAmount: '', originalPrice: '', pricePeriod: 'oylik',
  groupSizeMax: '', iconName: 'BookOpen', teacherId: '', isActive: true,
};

export default function CoursesAdminPage() {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadData() {
    setIsLoading(true);
    try {
      const [coursesData, teachersData] = await Promise.all([getAllCoursesAdmin(), getAllTeachersAdmin()]);
      setCourses(coursesData);
      setTeachers(teachersData);
    } catch (error) {
      toast.error('Ma\'lumotlarni yuklashda xatolik yuz berdi.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  function openCreateModal() {
    setEditingCourse(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  }

  function openEditModal(course) {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      cefrLevelFrom: course.cefr_level_from,
      cefrLevelTo: course.cefr_level_to,
      durationMonths: course.duration_months,
      lessonsPerWeek: course.lessons_per_week,
      priceAmount: course.price_amount,
      originalPrice: course.original_price || '',
      pricePeriod: course.price_period,
      groupSizeMax: course.group_size_max || '',
      iconName: course.icon_name || 'BookOpen',
      teacherId: course.teacher_id || '',
      isActive: Boolean(course.is_active),
    });
    setIsModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        durationMonths: Number(formData.durationMonths),
        lessonsPerWeek: Number(formData.lessonsPerWeek),
        priceAmount: Number(formData.priceAmount),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        groupSizeMax: formData.groupSizeMax ? Number(formData.groupSizeMax) : null,
        teacherId: formData.teacherId ? Number(formData.teacherId) : null,
      };

      if (editingCourse) {
        await updateCourse(editingCourse.id, payload);
        toast.success('Kurs yangilandi.');
      } else {
        await createCourse(payload);
        toast.success("Kurs qo'shildi.");
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
      await deleteCourse(deleteTarget.id);
      toast.success("Kurs o'chirildi.");
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
        title="Kurslar"
        description={`Jami ${courses.length} ta kurs`}
        action={
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-300 text-ink-900 font-semibold text-sm px-4 py-2.5 rounded-full transition-colors"
          >
            <Plus className="w-4 h-4" />
            Yangi kurs
          </button>
        }
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : courses.length === 0 ? (
        <EmptyState icon={BookOpen} title="Kurslar mavjud emas" description="Birinchi kursni qo'shing." />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-semibold text-gold-600 bg-gold-50 px-2.5 py-1 rounded-full">
                  {CEFR_DISPLAY[course.cefr_level_from]} — {CEFR_DISPLAY[course.cefr_level_to]}
                </span>
                {!course.is_active && (
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    Nofaol
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-ink-900 mb-1">{course.title}</h3>
              <p className="text-xs text-slate-400 mb-4 line-clamp-2">{course.description}</p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="font-display font-semibold text-sm text-ink-900">
                  {formatPrice(course.price_amount)}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => openEditModal(course)} className="p-1.5 text-slate-400 hover:text-ink-900">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(course)} className="p-1.5 text-slate-400 hover:text-red-500">
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
        title={editingCourse ? 'Kursni tahrirlash' : 'Yangi kurs qo\'shish'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <FormField label="Kurs nomi *">
            <input
              required
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              className="input-base"
            />
          </FormField>

          <FormField label="Tavsif *">
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              className="input-base resize-none"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Boshlang'ich daraja">
              <select
                value={formData.cefrLevelFrom}
                onChange={(e) => setFormData((p) => ({ ...p, cefrLevelFrom: e.target.value }))}
                className="input-base"
              >
                {CEFR_OPTIONS.map((lvl) => <option key={lvl} value={lvl}>{CEFR_DISPLAY[lvl]}</option>)}
              </select>
            </FormField>
            <FormField label="Yakuniy daraja">
              <select
                value={formData.cefrLevelTo}
                onChange={(e) => setFormData((p) => ({ ...p, cefrLevelTo: e.target.value }))}
                className="input-base"
              >
                {CEFR_OPTIONS.map((lvl) => <option key={lvl} value={lvl}>{CEFR_DISPLAY[lvl]}</option>)}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Davomiyligi (oy)">
              <input
                type="number" min={1} required
                value={formData.durationMonths}
                onChange={(e) => setFormData((p) => ({ ...p, durationMonths: e.target.value }))}
                className="input-base"
              />
            </FormField>
            <FormField label="Haftada dars">
              <input
                type="number" min={1} required
                value={formData.lessonsPerWeek}
                onChange={(e) => setFormData((p) => ({ ...p, lessonsPerWeek: e.target.value }))}
                className="input-base"
              />
            </FormField>
            <FormField label="Guruh hajmi">
              <input
                type="number" min={1}
                value={formData.groupSizeMax}
                onChange={(e) => setFormData((p) => ({ ...p, groupSizeMax: e.target.value }))}
                className="input-base"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Narx (so'm) *">
              <input
                type="number" min={0} required
                value={formData.priceAmount}
                onChange={(e) => setFormData((p) => ({ ...p, priceAmount: e.target.value }))}
                className="input-base"
              />
            </FormField>
            <FormField label="Asl narx (chegirmasiz)">
              <input
                type="number" min={0}
                placeholder="Ixtiyoriy"
                value={formData.originalPrice}
                onChange={(e) => setFormData((p) => ({ ...p, originalPrice: e.target.value }))}
                className="input-base"
              />
            </FormField>
          </div>
          <p className="text-xs text-slate-400 -mt-2">
            Asl narx kiritilsa, saytda chegirma (chiziqcha bilan) ko'rsatiladi. Bo'sh qoldirsangiz, chegirma ko'rsatilmaydi.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Narx davri">
              <select
                value={formData.pricePeriod}
                onChange={(e) => setFormData((p) => ({ ...p, pricePeriod: e.target.value }))}
                className="input-base"
              >
                <option value="oylik">Oylik</option>
                <option value="kurs_uchun">Kurs uchun</option>
              </select>
            </FormField>
            <FormField label="Ikonka">
              <select
                value={formData.iconName}
                onChange={(e) => setFormData((p) => ({ ...p, iconName: e.target.value }))}
                className="input-base"
              >
                {ICON_OPTIONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="O'qituvchi">
              <select
                value={formData.teacherId}
                onChange={(e) => setFormData((p) => ({ ...p, teacherId: e.target.value }))}
                className="input-base"
              >
                <option value="">Tanlanmagan</option>
                {teachers.map((t) => <option key={t.id} value={t.id}>{t.full_name}</option>)}
              </select>
            </FormField>
          </div>

          {editingCourse && (
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
        description={`"${deleteTarget?.title}" kursini o'chirmoqchimisiz?`}
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
