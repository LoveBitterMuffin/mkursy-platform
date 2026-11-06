import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';
import { PaymentInvoice, PaymentProvider } from '../../types';
import { paymentAdapter } from '../../services/paymentAdapter';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  courseId: string;
  amount: number;
  studentId: string;
  studentEmail: string;
  onSuccess: (invoice: PaymentInvoice) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  courseTitle,
  courseId,
  amount,
  studentId,
  studentEmail,
  onSuccess,
}) => {
  const [provider, setProvider] = useState<PaymentProvider>('tbank');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePay = async () => {
    setLoading(true);
    try {
      const inv = await paymentAdapter.createInvoice({
        studentId,
        studentEmail,
        courseId,
        courseTitle,
        amount,
        provider,
      });
      const paid = await paymentAdapter.simulatePaymentSuccess(inv.id);
      setTimeout(() => {
        setLoading(false);
        onSuccess(paid);
      }, 700);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0B132B] border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0DA0E3]">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Шлюз оплаты курса</h3>
            <p className="text-xs text-slate-400">Лицензия № Л035-01298-77/01609816</p>
          </div>
        </div>

        <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 mb-5 space-y-2">
          <div className="text-xs text-slate-400">Выбранная программа:</div>
          <div className="text-sm font-semibold text-white">{courseTitle}</div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-800">
            <span className="text-xs text-slate-400">Стоимость за месяц:</span>
            <span className="text-base font-extrabold text-[#0DA0E3]">{amount.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <label className="block text-xs font-semibold text-slate-300">Платежный шлюз (адаптер):</label>
          <div className="grid grid-cols-3 gap-2">
            {(['tbank', 'yookassa', 'mock'] as PaymentProvider[]).map(p => (
              <button
                key={p}
                onClick={() => setProvider(p)}
                className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all ${
                  provider === p
                    ? 'border-[#0DA0E3] bg-blue-500/15 text-white'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                }`}
              >
                {p === 'tbank' ? 'Т-Банк' : p === 'yookassa' ? 'ЮKassa' : 'Тест'}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full py-3 bg-[#FF8800] hover:bg-[#e07800] disabled:bg-slate-700 text-white font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 text-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Обработка платежа...
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" /> Оплатить и вступить в группу
            </>
          )}
        </button>

        <p className="text-[11px] text-slate-400 text-center mt-3">
          Безопасное соединение. Автоматическое закрепление за куратором.
        </p>
      </div>
    </div>
  );
};
