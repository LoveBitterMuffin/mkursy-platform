import React, { useState } from 'react';
import { Camera, CheckCircle2, FileText, Upload, Sparkles } from 'lucide-react';
import { PhotoSubmissionBlock as PhotoSubmissionBlockType } from '../../types';
import { MathText } from './MathText';

interface PhotoSubmissionProps {
  block: PhotoSubmissionBlockType;
  onSubmitted?: (photoUrl: string) => void;
}

export const PhotoSubmissionBlock: React.FC<PhotoSubmissionProps> = ({ block, onSubmitted }) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(block.uploadedPhotoUrl || null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(Boolean(block.uploadedPhotoUrl));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setPhotoUrl(fakeUrl);
      setIsSubmitted(true);
      if (onSubmitted) onSubmitted(fakeUrl);
    }
  };

  const handleSimulatedCamera = () => {
    const samplePreview = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="400" height="200" fill="%231e293b"/><text x="20" y="100" fill="%2394a3b8" font-size="16" font-family="sans-serif">Снимок страницы тетради с решением</text></svg>';
    setPhotoUrl(samplePreview);
    setIsSubmitted(true);
    if (onSubmitted) onSubmitted(samplePreview);
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 rounded-3xl space-y-4 shadow-sm dark:shadow-xl text-slate-900 dark:text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <span className="flex items-center gap-2 text-xs font-bold text-amber-500 dark:text-amber-400 uppercase tracking-wider">
          <Camera className="w-4 h-4 text-amber-500 dark:text-amber-400" /> Развернутый ответ (часть «С»)
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20 text-xs font-bold rounded-xl">
          <Sparkles className="w-3.5 h-3.5" /> Макс. {block.maxScore} первичных балла
        </span>
      </div>

      <div className="text-sm text-slate-900 dark:text-slate-100 leading-relaxed font-medium">
        <MathText text={block.prompt} />
      </div>

      {block.criteria && (
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
          <FileText className="w-4 h-4 text-[#0066FF] dark:text-indigo-400 shrink-0 mt-0.5" />
          <span>{block.criteria}</span>
        </div>
      )}

      {photoUrl && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Предпросмотр прикрепленного фото:</div>
          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 max-h-48 flex items-center justify-center">
            <img src={photoUrl} alt="Фото рукописного решения" className="max-h-48 object-contain" />
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <label className="min-h-[44px] px-4 py-2.5 bg-[#0066FF] hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-md shadow-blue-500/25">
          <Upload className="w-4 h-4" />
          <span>{isSubmitted ? 'Заменить фотографию' : 'Загрузить фото тетради'}</span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" aria-label="Выбрать фото тетради с решением" />
        </label>

        <button
          type="button"
          onClick={handleSimulatedCamera}
          className="min-h-[44px] px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-700"
        >
          <Camera className="w-4 h-4 text-amber-400" /> Сделать снимок (демо)
        </button>

        {isSubmitted && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" /> Прикреплено на проверку куратору
          </span>
        )}
      </div>
    </div>
  );
};
