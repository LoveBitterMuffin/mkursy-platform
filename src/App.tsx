import React from 'react';

export const App: React.FC = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-brand-dark text-slate-100">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-brand-accent tracking-tight">
          МКурсы
        </h1>
        <p className="text-slate-300 text-lg">
          Платформа интерактивной подготовки к ОГЭ и ЕГЭ по физике и математике.
        </p>
      </div>
    </main>
  );
};

export default App;
