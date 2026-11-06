import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Send, MessageCircle } from 'lucide-react';

interface ParentReportModalProps {
  isOpen: boolean;
  reportText: string;
  onClose: () => void;
}

export const ParentReportModal: React.FC<ParentReportModalProps> = ({
  isOpen,
  reportText,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encoded = encodeURIComponent(reportText);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-lg rounded-3xl p-6 space-y-4 relative shadow-2xl text-slate-900 dark:text-slate-100">
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть окно отчета"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center absolute top-3 right-3 text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h4 id="report-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
          Отчет об успеваемости для родителей
        </h4>

        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 max-h-60 overflow-y-auto text-xs text-slate-800 dark:text-slate-300 font-mono whitespace-pre-line leading-relaxed">
          {reportText}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleCopy}
            className="min-h-[44px] px-4 py-2 bg-[#0066FF] hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-md shadow-blue-500/25"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Скопировано в буфер!' : 'Копировать отчет'}
          </button>

          <a
            href={`https://t.me/share/url?text=${encoded}`}
            target="_blank"
            rel="noreferrer"
            className="min-h-[44px] px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Send className="w-4 h-4 text-sky-400" /> Отправить в Telegram
          </a>

          <a
            href={`https://api.whatsapp.com/send?text=${encoded}`}
            target="_blank"
            rel="noreferrer"
            className="min-h-[44px] px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-700"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" /> В WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};
