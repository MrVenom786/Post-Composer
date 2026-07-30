import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { PlatformValidation, PlatformId } from '../types';
import { PLATFORM_CONFIGS } from '../data/platformConfigs';

interface ValidationSummaryProps {
  validations: Record<PlatformId, PlatformValidation>;
  onFixAllIssues: () => void;
}

export const ValidationSummary: React.FC<ValidationSummaryProps> = ({
  validations,
  onFixAllIssues,
}) => {
  const enabledValidations = (Object.values(validations) as PlatformValidation[]).filter((v) => v.enabled);
  const totalEnabled = enabledValidations.length;
  const passedCount = enabledValidations.filter((v) => v.isValid).length;
  const hasErrors = enabledValidations.some((v) => !v.isValid);

  const passPercentage =
    totalEnabled > 0 ? Math.round((passedCount / totalEnabled) * 100) : 100;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 bg-slate-900/70 backdrop-blur-md space-y-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-white tracking-wide font-mono">
            REAL-TIME VALIDATION SUMMARY
          </h2>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">Overall Readiness:</span>
          <span
            className={`font-bold px-2.5 py-0.5 rounded-full border ${
              passPercentage === 100
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            {passedCount} / {totalEnabled} PASS ({passPercentage}%)
          </span>
        </div>
      </div>

      {/* Readiness Progress Bar */}
      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
        <div
          className={`h-full transition-all duration-500 ${
            passPercentage === 100
              ? 'bg-gradient-to-r from-cyan-500 to-emerald-400'
              : 'bg-gradient-to-r from-amber-500 to-rose-500'
          }`}
          style={{ width: `${passPercentage}%` }}
        />
      </div>

      {/* Summary Platform Status Badges List */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {enabledValidations.map((val) => {
          const config = PLATFORM_CONFIGS[val.platformId];
          if (!config) return null;

          return (
            <div
              key={val.platformId}
              className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs font-mono transition-colors ${
                val.isValid
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
              }`}
            >
              <span className="font-semibold truncate">{config.name}</span>
              {val.isValid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Action Suggestion Bar when errors exist */}
      {hasErrors && (
        <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-950 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
            <span>
              Constraints need attention on failed platforms before publishing.
            </span>
          </div>

          <button
            type="button"
            onClick={onFixAllIssues}
            className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Auto-Resolve All Issues</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
