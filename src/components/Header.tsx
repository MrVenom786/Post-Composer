import React, { useState } from 'react';
import {
  Sparkles,
  Bookmark,
  FolderDown,
  Layers,
  ChevronDown,
  CheckCircle2,
  Wand2,
  Zap,
} from 'lucide-react';
import { POST_PRESETS } from '../data/platformConfigs';
import { PostPreset } from '../types';

interface HeaderProps {
  draftsCount: number;
  onOpenDrafts: () => void;
  onSelectPreset: (preset: PostPreset) => void;
  onAiEnhanceAll: () => void;
  isAiThinking?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  draftsCount,
  onOpenDrafts,
  onSelectPreset,
  onAiEnhanceAll,
  isAiThinking = false,
}) => {
  const [showPresetDropdown, setShowPresetDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-cyan-500/20 bg-slate-950/70 backdrop-blur-xl px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 p-0.5 glow-cyan">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-wider text-white text-glow-cyan font-mono">
                  POST <span className="text-cyan-400">COMPOSER</span>
                </h1>
                <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  v1.0.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Multi-Platform Real-time Constraint & Media Validator
              </p>
            </div>
          </div>

          {/* Drafts count quick button for mobile */}
          <button
            onClick={onOpenDrafts}
            className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300 hover:text-white hover:border-cyan-500/40 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
            <span>Drafts</span>
            {draftsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-bold">
                {draftsCount}
              </span>
            )}
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Preset Templates Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPresetDropdown(!showPresetDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs font-medium text-slate-200 hover:border-cyan-500/40 hover:text-cyan-300 transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span className="hidden xs:inline">Load Preset</span>
              <span className="xs:hidden">Presets</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showPresetDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowPresetDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-72 rounded-2xl glass-panel bg-slate-900/95 border border-cyan-500/30 shadow-2xl z-50 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Quick Post Templates
                  </div>
                  <div className="py-1 space-y-1">
                    {POST_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => {
                          onSelectPreset(preset);
                          setShowPresetDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-800/80 hover:border hover:border-cyan-500/30 transition-all flex flex-col gap-0.5 group cursor-pointer"
                      >
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 flex items-center justify-between">
                          <span>{preset.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {preset.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {preset.content}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* AI Optimizer / Trim Helper Button */}
          <button
            onClick={onAiEnhanceAll}
            disabled={isAiThinking}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900 border border-purple-500/30 text-xs font-medium text-purple-200 hover:border-purple-400 hover:text-white transition-all glow-purple cursor-pointer disabled:opacity-50"
          >
            <Wand2 className={`w-4 h-4 text-purple-400 ${isAiThinking ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">AI Auto-Format</span>
          </button>

          {/* Drafts Drawer Trigger button */}
          <button
            onClick={onOpenDrafts}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs font-medium text-slate-200 hover:border-cyan-500/40 hover:text-cyan-300 transition-all cursor-pointer relative"
          >
            <Bookmark className="w-4 h-4 text-cyan-400" />
            <span>Drafts</span>
            {draftsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-bold">
                {draftsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
