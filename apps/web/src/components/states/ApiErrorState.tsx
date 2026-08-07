import React from 'react';

interface ApiErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ApiErrorState({
  title = "Pripojenie k serveru zlyhalo",
  message = "Nepodarilo sa načítať katalóg hier. Skontrolujte prosím sieťové pripojenie alebo to skúste neskôr.",
  onRetry,
}: ApiErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-red-950/20 border border-red-900/50 rounded-xl my-6">
      <div className="w-16 h-16 bg-red-950 border border-red-800 text-red-500 rounded-full flex items-center justify-center mb-4 font-bold text-xl">
        !
      </div>
      <h3 className="text-lg font-bold text-red-400 mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 max-w-sm mb-6 leading-relaxed">{message}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center justify-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 text-sm font-bold rounded-lg transition-colors"
        >
          Skúsiť znova
        </button>
      )}
    </div>
  );
}
