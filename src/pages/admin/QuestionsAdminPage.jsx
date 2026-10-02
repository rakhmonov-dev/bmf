import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, FileQuestion } from 'lucide-react';
import { getAllQuestionsAdmin, createQuestion, updateQuestion, deleteQuestion } from '../../services/testService';
import { LoadingSpinner, EmptyState } from '../../components/shared/Common';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const CEFR = ['A1','A2','B1','B2','C1'];
const GRADES = [5,6,7,8,9,10,11];
const EMPTY = { questionText:'', optionA:'', optionB:'', optionC:'', optionD:'', correctOption:'a', subject:'english', cefrLevel:'A1', gradeLevel:5, points:1 };

export default function QuestionsAdminPage() {
  const [questions,setQuestions]=useState([]), [loading,setLoading]=useState(true), [modal,setModal]=useState(false);
  const [editing,setEditing]=useState(null), [form,setForm]=useState(EMPTY), [saving,setSaving]=useState(false);
  const [del,setDel]=useState(null), [deleting,setDeleting]=useState(false), [tab,setTab]=useState('english');
  async function load(){setLoading(true);try{setQuestions(await getAllQuestionsAdmin())}catch{toast.error('Yuklashda xatolik yuz berdi.')}finally{setLoading(false)}}
  useEffect(()=>{load()},[]);
  function create(){setEditing(null);setForm({...EMPTY,subject:tab});setModal(true)}
  function edit(q){setEditing(q);setForm({questionText:q.question_text,optionA:q.option_a,optionB:q.option_b,optionC:q.option_c,optionD:q.option_d,correctOption:q.correct_option,subject:q.subject||'english',cefrLevel:q.cefr_level||'A1',gradeLevel:q.grade_level||5,points:q.points});setModal(true)}
  async function save(e){e.preventDefault();setSaving(true);try{const payload={...form,points:Number(form.points),gradeLevel:Number(form.gradeLevel)};editing?await updateQuestion(editing.id,payload):await createQuestion(payload);toast.success(editing?'Savol yangilandi.':"Savol qo'shildi.");setModal(false);load()}catch(e){toast.error(e.response?.data?.message||'Saqlashda xatolik yuz berdi.')}finally{setSaving(false)}}
  async function remove(){if(!del)return;setDeleting(true);try{await deleteQuestion(del.id);toast.success("Savol o'chirildi.");setDel(null);load()}catch{toast.error("O'chirishda xatolik yuz berdi.")}finally{setDeleting(false)}}
  const visible=questions.filter(q=>(q.subject||'english')===tab);
  const groups=tab==='english'?CEFR:GRADES;
  return <div>
    <AdminPageHeader title="Test savollari" description={`English: ${questions.filter(q=>(q.subject||'english')==='english').length} · Matematika: ${questions.filter(q=>q.subject==='math').length}`} action={<button onClick={create} className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-300 text-ink-900 font-semibold text-sm px-4 py-2.5 rounded-full"><Plus className="w-4 h-4"/>Yangi savol</button>}/>
    <div className="inline-flex bg-slate-100 p-1 rounded-xl mb-6"><button onClick={()=>setTab('english')} className={`px-5 py-2 rounded-lg text-sm font-medium ${tab==='english'?'bg-white shadow text-ink-900':'text-slate-500'}`}>English</button><button onClick={()=>setTab('math')} className={`px-5 py-2 rounded-lg text-sm font-medium ${tab==='math'?'bg-white shadow text-ink-900':'text-slate-500'}`}>Matematika</button></div>
    {loading?<LoadingSpinner/>:visible.length===0?<EmptyState icon={FileQuestion} title="Savollar mavjud emas"/>:<div className="flex flex-col gap-8">{groups.map(level=>{const rows=visible.filter(q=>tab==='english'?q.cefr_level===level:Number(q.grade_level)===level);return rows.length?<div key={level}><h3 className="text-sm font-semibold text-gold-600 uppercase tracking-wide mb-3">{tab==='english'?`${level} daraja`:`${level}-sinf`} ({rows.length})</h3><div className="flex flex-col gap-2">{rows.map(q=><div key={q.id} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center justify-between"><div className="flex-1"><p className="text-sm text-ink-900">{q.question_text}</p><p className="text-xs text-slate-400 mt-1">To'g'ri: <span className="font-medium text-emerald-600 uppercase">{q.correct_option}</span> · {q.points} ball</p></div><div className="flex gap-1 ml-3"><button onClick={()=>edit(q)} className="p-1.5 text-slate-400 hover:text-ink-900"><Pencil className="w-4 h-4"/></button><button onClick={()=>setDel(q)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button></div></div>)}</div></div>:null})}</div>}
    <Modal isOpen={modal} onClose={()=>setModal(false)} title={editing?'Savolni tahrirlash':"Yangi savol qo'shish"} maxWidth="max-w-xl"><form onSubmit={save} className="flex flex-col gap-4">
      <Field label="Fan"><select value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))} className="input-base"><option value="english">English</option><option value="math">Matematika</option></select></Field>
      <Field label="Savol matni *"><textarea required rows={2} value={form.questionText} onChange={e=>setForm(p=>({...p,questionText:e.target.value}))} className="input-base resize-none"/></Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{['A','B','C','D'].map(x=><Field key={x} label={`${x} varianti *`}><input required value={form[`option${x}`]} onChange={e=>setForm(p=>({...p,[`option${x}`]:e.target.value}))} className="input-base"/></Field>)}</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3"><Field label="To'g'ri javob"><select value={form.correctOption} onChange={e=>setForm(p=>({...p,correctOption:e.target.value}))} className="input-base">{['a','b','c','d'].map(x=><option key={x} value={x}>{x.toUpperCase()}</option>)}</select></Field>
      {form.subject==='english'?<Field label="CEFR darajasi"><select value={form.cefrLevel} onChange={e=>setForm(p=>({...p,cefrLevel:e.target.value}))} className="input-base">{CEFR.map(x=><option key={x}>{x}</option>)}</select></Field>:<Field label="Sinf"><select value={form.gradeLevel} onChange={e=>setForm(p=>({...p,gradeLevel:e.target.value}))} className="input-base">{GRADES.map(x=><option key={x} value={x}>{x}-sinf</option>)}</select></Field>}
      <Field label="Ball"><input type="number" min="1" max="10" value={form.points} onChange={e=>setForm(p=>({...p,points:e.target.value}))} className="input-base"/></Field></div>
      <button disabled={saving} className="mt-2 bg-gold-400 hover:bg-gold-300 disabled:opacity-50 text-ink-900 font-semibold py-3 rounded-full">{saving?'Saqlanmoqda...':'Saqlash'}</button>
    </form></Modal>
    <ConfirmDialog isOpen={Boolean(del)} onClose={()=>setDel(null)} onConfirm={remove} isLoading={deleting} description="Bu savolni o'chirmoqchimisiz?"/>
  </div>
}
function Field({label,children}){return <div><label className="text-sm font-medium text-slate-600 mb-1.5 block">{label}</label>{children}</div>}
