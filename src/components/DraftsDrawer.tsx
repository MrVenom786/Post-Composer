import React from 'react';
import {
  Bookmark,
  X,
  Trash2,
  FolderOpen,
  Calendar,
  Clock,
  Layers,
  Search,
} from 'lucide-react';
import { SavedDraft } from '../types';

interface DraftsDrawerProps {
  drafts: SavedDraft[];
  onLoadDraft: (draft: SavedDraft) => void;
  onDeleteDraft: (id: string) => void;
  onClose: () => void;
}

export const DraftsDrawer: React.FC<DraftsDrawerProps> = ({
  drafts,
  onLoadDraft,
  onDeleteDraft,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredDrafts = drafts.filter(
    (d) =>
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md h-full glass-panel bg-slate-900 border-l border-cyan-500/30 p-6 flex flex-col shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-mono">
              SAVED DRAFTS & SCHEDULES
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search saved drafts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        {/* Drafts List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredDrafts.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500 font-mono space-y-2">
              <FolderOpen className="w-10 h-10 text-slate-700" />
              <p className="text-xs">No saved drafts found.</p>
              <p className="text-[11px] text-slate-600">
                Type a post in the composer and click "Save Draft" to store it here.
              </p>
            </div>
          ) : (
            filteredDrafts.map((draft) => (
              <div
                key={draft.id}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2.5 group"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white font-mono truncate max-w-[200px]">
                    {draft.title}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {draft.updatedAt}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {draft.content || '(Empty post text)'}
                </p>

                {draft.scheduledTime && (
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30 text-[10px] text-cyan-300 font-mono">
                    <Calendar className="w-3 h-3 text-cyan-400" />
                    <span>Scheduled: {draft.scheduledTime}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {draft.media.length} media attached
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onDeleteDraft(draft.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onLoadDraft(draft)}
                      className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500 text-xs font-mono font-bold hover:text-slate-950 transition-colors cursor-pointer"
                    >
                      Load Post
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
