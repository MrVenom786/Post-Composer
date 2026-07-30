import React from 'react';
import {
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  AtSign,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Scissors,
  Image as ImageIcon,
  ShieldCheck,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { PlatformConfig, PlatformValidation, PlatformId } from '../types';
import { PLATFORM_CONFIGS } from '../data/platformConfigs';

interface PlatformCardsProps {
  validations: Record<PlatformId, PlatformValidation>;
  onTogglePlatform: (platformId: PlatformId) => void;
  onPreviewPlatform: (platformId: PlatformId) => void;
  onTrimForPlatform: (platformId: PlatformId) => void;
}

export const PlatformCards: React.FC<PlatformCardsProps> = ({
  validations,
  onTogglePlatform,
  onPreviewPlatform,
  onTrimForPlatform,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Twitter':
        return <Twitter className="w-4 h-4 text-sky-400" />;
      case 'Facebook':
        return <Facebook className="w-4 h-4 text-blue-400" />;
      case 'Linkedin':
        return <Linkedin className="w-4 h-4 text-indigo-400" />;
      case 'Instagram':
        return <Instagram className="w-4 h-4 text-pink-400" />;
      case 'AtSign':
        return <AtSign className="w-4 h-4 text-purple-400" />;
      default:
        return <Twitter className="w-4 h-4 text-cyan-400" />;
    }
  };

  const platformList = Object.values(PLATFORM_CONFIGS);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white tracking-wide font-mono">
            PLATFORM VALIDATIONS
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Toggle platforms to enable rules
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {platformList.map((config) => {
          const val = validations[config.id];
          const isEnabled = val?.enabled ?? true;
          const charCount = val?.charCount ?? 0;
          const maxChars = config.maxChars;
          const charPercentage = Math.min(
            100,
            Math.round((charCount / maxChars) * 100)
          );
          const isOverCharLimit = charCount > maxChars;
          const isMissingMedia = config.requiresMedia && val?.mediaCount === 0;

          // Status colors & Badges
          let cardBorder = 'border-slate-800/80 bg-slate-900/60';
          let progressColor = 'bg-cyan-500';

          if (!isEnabled) {
            cardBorder = 'border-slate-800/40 opacity-60 bg-slate-950/40';
          } else if (val?.isValid) {
            cardBorder =
              'border-emerald-500/30 bg-emerald-950/10 hover:border-emerald-500/50';
            progressColor = 'bg-emerald-400';
          } else if (isOverCharLimit) {
            cardBorder =
              'border-rose-500/40 bg-rose-950/10 hover:border-rose-500/60 glow-amber';
            progressColor = 'bg-rose-500';
          } else if (isMissingMedia) {
            cardBorder =
              'border-amber-500/40 bg-amber-950/10 hover:border-amber-500/60 glow-amber';
            progressColor = 'bg-amber-400';
          }

          return (
            <div
              key={config.id}
              className={`glass-panel rounded-2xl p-4 transition-all duration-300 relative border backdrop-blur-md ${cardBorder}`}
            >
              {/* Header row: Platform identity & Toggle Switch */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
                    {getIcon(config.iconName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white font-mono">
                        {config.name}
                      </h3>
                      {config.requiresMedia && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                          MEDIA REQUIRED
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {config.description}
                    </p>
                  </div>
                </div>

                {/* Cyberpunk Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={() => onTogglePlatform(config.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 peer-checked:after:bg-slate-950 shadow-inner"></div>
                </label>
              </div>

              {/* Validation Content Body when enabled */}
              {isEnabled ? (
                <div className="space-y-3 pt-2 border-t border-slate-800/60">
                  {/* Character Counter & Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                      <span className="text-slate-400">Character Limit:</span>
                      <span
                        className={`font-bold ${
                          isOverCharLimit
                            ? 'text-rose-400 text-glow-cyan'
                            : charPercentage > 85
                            ? 'text-amber-400'
                            : 'text-cyan-300'
                        }`}
                      >
                        {charCount.toLocaleString()} / {maxChars.toLocaleString()}
                      </span>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full transition-all duration-300 ${progressColor}`}
                        style={{ width: `${Math.min(100, charPercentage)}%` }}
                      />
                    </div>
                  </div>

                  {/* DYNAMIC VALIDATION FEEDBACK BADGES */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1.5">
                      {val?.isValid ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>✓ Within Limit</span>
                        </div>
                      ) : isOverCharLimit ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/40 text-xs font-mono font-semibold glow-amber">
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          <span>
                            ⚠ Exceeds limit by {charCount - maxChars} chars
                          </span>
                        </div>
                      ) : isMissingMedia ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/40 text-xs font-mono font-semibold glow-amber">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          <span>⚠ Action Required / Media Required</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Validation Warning</span>
                        </div>
                      )}
                    </div>

                    {/* Action buttons: Auto-Trim & Preview */}
                    <div className="flex items-center gap-2">
                      {isOverCharLimit && (
                        <button
                          type="button"
                          onClick={() => onTrimForPlatform(config.id)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs hover:bg-cyan-500/20 transition-colors cursor-pointer"
                          title="Auto-trim text to fit this platform"
                        >
                          <Scissors className="w-3 h-3 text-cyan-400" />
                          <span>Auto-Trim</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onPreviewPlatform(config.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs hover:text-cyan-300 hover:border-cyan-500/40 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Preview</span>
                      </button>
                    </div>
                  </div>

                  {/* Error & Warning Messages */}
                  {val?.errors && val.errors.length > 0 && (
                    <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-500/20 text-[11px] text-rose-300 space-y-1 font-mono">
                      {val.errors.map((err, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                          <span>{err}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-1 text-xs text-slate-500 font-mono italic">
                  Validation disabled for this platform.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
