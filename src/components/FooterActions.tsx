import React from 'react';
import {
  Calendar,
  Save,
  Send,
  Zap,
  Sparkles,
  CheckCircle2,
  AlertOctagon,
} from 'lucide-react';

interface FooterActionsProps {
  isValidAll: boolean;
  onSaveDraft: () => void;
  onOpenSchedule: () => void;
  onPublishNow: () => void;
  isPublishing?: boolean;
}

export const FooterActions: React.FC<FooterActionsProps> = ({
  isValidAll,
  onSaveDraft,
  onOpenSchedule,
  onPublishNow,
  isPublishing = false,
}) => {
  return (
    <div className="sticky bottom-0 z-30 w-full glass-panel border-t border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl px-4 py-3 sm:px-6 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Readiness Status indicator */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          {isValidAll ? (
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>All enabled platforms pass constraints! Ready to broadcast.</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-amber-400">
              <AlertOctagon className="w-4 h-4" />
              <span>Some platforms require attention before live broadcast.</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Save Draft Button */}
          <button
            type="button"
            onClick={onSaveDraft}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-cyan-300 hover:border-cyan-500/50 transition-all font-mono text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4 text-slate-400" />
            <span>Save Draft</span>
          </button>

          {/* Schedule Post Button (Glowing cyan/blue cyber button) */}
          <button
            type="button"
            onClick={onOpenSchedule}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-slate-950 hover:text-white font-mono text-xs font-bold transition-all shadow-lg glow-cyan flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Post</span>
          </button>

          {/* Publish Now Button */}
          <button
            type="button"
            onClick={onPublishNow}
            disabled={isPublishing}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isValidAll
                ? 'bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 hover:brightness-110 glow-emerald'
                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-amber-500/50'
            }`}
          >
            <Send className={`w-4 h-4 ${isPublishing ? 'animate-bounce' : ''}`} />
            <span>{isPublishing ? 'Broadcasting...' : 'Publish Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
