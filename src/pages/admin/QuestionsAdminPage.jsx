import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, FileQuestion } from 'lucide-react';
import { getAllQuestionsAdmin, createQuestion, updateQuestion, deleteQuestion } from '../../services/testService';
import { LoadingSpinner, EmptyState } from '../../components/shared/Common';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const CEFR_TESTABLE = ['A1', 'A2', 'B1', 'B2', 'C1'];

const EMPTY_FORM = {
  questionText: '', optionA: '', optionB: '', optionC: '', optionD: '',
  correctOption: 'a', cefrLevel: 'A1', points: 1,
};

export default function QuestionsAdminPage() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadData() {
    setIsLoading(true);
    try {
      setQuestions(await getAllQuestionsAdmin());
    } catch (error) {
      toast.error('Yuklashda xatolik yuz berdi.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  function openCreateModal() {
    setEditingQuestion(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  }

  function openEditModal(question) {
    setEditingQuestion(question);
    setFormData({
      questionText: question.question_text,
      optionA: question.option_a,
      optionB: question.option_b,
      optionC: question.option_c,
      optionD: question.option_d,
      correctOption: question.correct_option,
      cefrLevel: question.cefr_level,
      points: question.points,
    });
    setIsModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = { ...formData, points: Number(formData.points) };
      if (editingQuestion) {
        await updateQuestion(editingQuestion.id, payload);
        toast.success('Savol yangilandi.');
      } else {
        await createQuestion(payload);
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
      await deleteQuestion(deleteTarget.id);
      toast.success("Savol o'chirildi.");
      setDeleteTarget(null);
      loadData();
    } catch (error) {
      toast.error("O'chirishda xatolik yuz berdi.");
    } finally {
      setIsDeleting(false);
    }
  }

  const groupedByLevel = CEFR_TESTABLE.reduce((acc, level) => {
    acc[level] = questions.filter((q) => q.cefr_level === level);
    return acc;
  }, {});

  return (
    <div>
      <AdminPageHeader
        title="Test savollari"
        description={`Jami ${questions.length} ta savol`}
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
      ) : questions.length === 0 ? (
        <EmptyState icon={FileQuestion} title="Savollar mavjud emas" />
      ) : (
        <div className="flex flex-col gap-8">
          {CEFR_TESTABLE.map((level) => (
            groupedByLevel[level].length > 0 && (
              <div key={level}>
                <h3 className="text-sm font-semibold text-gold-600 uppercase tracking-wide mb-3">
                  {level} daraja ({groupedByLevel[level].length})
                </h3>
                <div className="flex flex-col gap-2">
                  {groupedByLevel[level].map((q) => (
                    <div key={q.id} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-ink-900">{q.question_text}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          To'g'ri javob: <span className="font-medium text-emerald-600 uppercase">{q.correct_option}</span>
                          {' · '}{q.points} ball
                        </p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0 ml-3">
                        <button onClick={() => openEditModal(q)} className="p-1.5 text-slate-400 hover:text-ink-900">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(q)} className="p-1.5 text-slate-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingQuestion ? 'Savolni tahrirlash' : 'Yangi savol qo\'shish'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <FormField label="Savol matni *">
            <textarea
              required
              rows={2}
              value={formData.questionText}
              onChange={(e) => setFormData((p) => ({ ...p, questionText: e.target.value }))}
              className="input-base resize-none"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="A varianti *">
              <input required value={formData.optionA} onChange={(e) => setFormData((p) => ({ ...p, optionA: e.target.value }))} className="input-base" />
            </FormField>
            <FormField label="B varianti *">
              <input required value={formData.optionB} onChange={(e) => setFormData((p) => ({ ...p, optionB: e.target.value }))} className="input-base" />
            </FormField>
            <FormField label="C varianti *">
              <input required value={formData.optionC} onChange={(e) => setFormData((p) => ({ ...p, optionC: e.target.value }))} className="input-base" />
            </FormField>
            <FormField label="D varianti *">
              <input required value={formData.optionD} onChange={(e) => setFormData((p) => ({ ...p, optionD: e.target.value }))} className="input-base" />
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <FormField label="To'g'ri javob">
              <select value={formData.correctOption} onChange={(e) => setFormData((p) => ({ ...p, correctOption: e.target.value }))} className="input-base">
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
                <option value="d">D</option>
              </select>
            </FormField>
            <FormField label="CEFR darajasi">
              <select value={formData.cefrLevel} onChange={(e) => setFormData((p) => ({ ...p, cefrLevel: e.target.value }))} className="input-base">
                {CEFR_TESTABLE.map((lvl) => <option key={lvl} value={lvl}>{lvl}</option>)}
              </select>
            </FormField>
            <FormField label="Ball">
              <input type="number" min={1} max={10} value={formData.points} onChange={(e) => setFormData((p) => ({ ...p, points: e.target.value }))} className="input-base" />
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
