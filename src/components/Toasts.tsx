import React from 'react';
import { ToastMessage } from '../types';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
} from 'lucide-react';

interface ToastsProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toasts: React.FC<ToastsProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-cyan-500/40 bg-slate-900/90 text-cyan-300';
        let icon = <Info className="w-4 h-4 text-cyan-400 shrink-0" />;

        if (toast.type === 'success') {
          borderClass = 'border-emerald-500/50 bg-slate-900/95 text-emerald-300 glow-emerald';
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-500/50 bg-slate-900/95 text-amber-300 glow-amber';
          icon = <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-500/50 bg-slate-900/95 text-rose-300 glow-amber';
          icon = <XCircle className="w-4 h-4 text-rose-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl glass-panel border shadow-2xl flex items-start justify-between gap-3 font-mono text-xs animate-in slide-in-from-right-5 fade-in duration-300 ${borderClass}`}
          >
            <div className="flex items-start gap-2.5">
              {icon}
              <div>
                <h5 className="font-bold">{toast.title}</h5>
                {toast.description && (
                  <p className="text-[11px] opacity-80 mt-0.5 leading-relaxed font-sans">
                    {toast.description}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 hover:opacity-100 opacity-60 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
