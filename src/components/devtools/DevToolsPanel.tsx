import React, { useState } from 'react';
import { Terminal, Zap, ShieldAlert } from 'lucide-react';
import { paymentAdapter } from '../../services/paymentAdapter';
import { groupManager, GroupCapacityExceededError } from '../../services/groupManager';

export const DevToolsPanel: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([
    'DevTools initialized. Payment gateway: mock/tbank ready.',
  ]);
  const [testAmount, setTestAmount] = useState<number>(4900);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 15)]);
  };

  const handleSimulateWebhook = async (status: 'succeeded' | 'canceled') => {
    try {
      const inv = await paymentAdapter.createInvoice({
        studentId: `dev-stud-${Date.now().toString(36)}`,
        studentEmail: 'developer.test@mcourses.ru',
        courseId: 'ege-profile',
        courseTitle: 'ЕГЭ Профиль 2026: Математика',
        amount: testAmount,
      });
      addLog(`Создан тестовый инвойс: ${inv.id} (${inv.amount} ₽)`);

      const processed = await paymentAdapter.processWebhook({
        eventId: `dev-evt-${Date.now()}`,
        paymentId: inv.id,
        status,
        amount: testAmount,
      });
      addLog(`Вебхук обработан: статус -> ${processed.status}`);
    } catch (err: unknown) {
      addLog(`Ошибка вебхука: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleTestGroupOverflow = () => {
    const groups = groupManager.getAllGroups();
    const target = groups[0];
    if (!target) return;
    try {
      addLog(`Тестирование лимита 10 чел. для группы "${target.title}"...`);
      for (let i = target.studentIds.length; i <= 10; i++) {
        groupManager.addStudentToGroup(target.id, `stud-overflow-${i}`);
      }
      addLog('Успех: группа заполнена ровно до 10 человек.');
    } catch (err) {
      if (err instanceof GroupCapacityExceededError) {
        addLog(`Инвариант подтвержден: ${err.message}`);
      } else {
        addLog(`Ошибка: ${String(err)}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[#0066FF]">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Инженерная консоль разработчика (DevTools)</h2>
            <p className="text-xs text-slate-400">Тестирование шины данных, вебхуков эквайринга и инвариантов системы</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white">
            <Zap className="w-4 h-4 text-amber-500" /> Симулятор платежных вебхуков
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Сумма инвойса:</label>
            <input
              type="number"
              value={testAmount}
              onChange={e => setTestAmount(Number(e.target.value))}
              className="w-24 px-2 py-1 text-xs font-bold rounded border bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
            <span className="text-xs text-slate-500">₽</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleSimulateWebhook('succeeded')}
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow"
            >
              Вебхук: Успешная оплата
            </button>
            <button
              onClick={() => handleSimulateWebhook('canceled')}
              className="py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all shadow"
            >
              Вебхук: Отмена платежа
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white">
            <ShieldAlert className="w-4 h-4 text-[#0066FF]" /> Проверка инвариантов
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Проверка ограничения вместимости группы (строго до 10 студентов, отказ при 11-м).
          </p>
          <button
            onClick={handleTestGroupOverflow}
            className="w-full py-2.5 px-3 bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all shadow"
          >
            Смоделировать переполнение группы
          </button>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 space-y-1">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Журнал событий DevTools:</div>
        {logs.map((log, i) => (
          <div key={i} className="text-slate-300">{log}</div>
        ))}
      </div>
    </div>
  );
};
