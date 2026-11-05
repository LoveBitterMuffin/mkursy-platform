import React, { useEffect } from 'react';
import { X, Send, Phone } from 'lucide-react';

interface CuratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CuratorModal: React.FC<CuratorModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="curator-title"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-3xl p-6 space-y-4 relative shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Закрыть контакты"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center absolute top-3 right-3 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h4 id="curator-title" className="text-lg font-bold text-white">Куратор учебной группы</h4>
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 bg-slate-950 rounded-xl space-y-1">
            <span className="text-slate-400">Преподаватель-наставник:</span>
            <p className="text-sm font-semibold text-white">Екатерина Михайловна В.</p>
          </div>
          <a
            href="https://t.me"
            target="_blank"
            rel="noreferrer"
            className="min-h-[44px] flex items-center justify-center gap-2 p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors"
          >
            <Send className="w-4 h-4" /> Написать в Telegram
          </a>
          <a
            href="tel:+74950000000"
            className="min-h-[44px] flex items-center justify-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium transition-colors"
          >
            <Phone className="w-4 h-4" /> Позвонить куратору
          </a>
        </div>
      </div>
    </div>
  );
};
