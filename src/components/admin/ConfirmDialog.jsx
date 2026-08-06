import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title = "O'chirishni tasdiqlaysizmi?", description, isLoading = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        <p className="text-sm text-slate-500 mb-6">
          {description || "Bu amalni ortga qaytarib bo'lmaydi."}
        </p>
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Bekor qilish
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-full bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
          >
            {isLoading ? "O'chirilmoqda..." : "O'chirish"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
