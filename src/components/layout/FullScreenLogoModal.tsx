import React, { useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import logoIcon from '../../assets/logo-icon.png';

interface FullScreenLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FullScreenLogoModal: React.FC<FullScreenLogoModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Полноэкранный логотип МКурсы в рамке"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Закрыть полноэкранный просмотр"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 min-h-[44px] min-w-[44px] p-2.5 text-slate-400 hover:text-white rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 flex items-center justify-center"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="relative w-full max-w-sm sm:max-w-md flex flex-col items-center justify-center p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/80 shadow-2xl shadow-blue-500/10 dark:shadow-blue-950/50 text-center">
        <div className="w-48 h-48 sm:w-60 sm:h-60 bg-white rounded-2xl flex items-center justify-center p-4 shadow-md overflow-hidden">
          <img
            src={logoIcon}
            alt="Символ бренда МКурсы"
            className="w-full h-full object-contain scale-140 select-none"
          />
        </div>

        <div className="mt-6 space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            МКурсы
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
            Центр дополнительного образования
          </p>
        </div>

        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-brand-primary-light text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Лицензия № Л035-01298-77/01609816</span>
        </div>

        <p className="mt-4 text-[11px] text-slate-500">
          Нажмите Esc или кликните вне рамки для возврата
        </p>
      </div>
    </div>
  );
};
