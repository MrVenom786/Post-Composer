import React, { useState } from 'react';
import {
  X,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  Heart,
  MessageCircle,
  Repeat2,
  Share2,
  MoreHorizontal,
  ThumbsUp,
  Bookmark,
  Send,
} from 'lucide-react';
import { MediaFile, PlatformId } from '../types';
import { PLATFORM_CONFIGS } from '../data/platformConfigs';

interface PostPreviewModalProps {
  platformId: PlatformId;
  content: string;
  media: MediaFile[];
  onClose: () => void;
}

export const PostPreviewModal: React.FC<PostPreviewModalProps> = ({
  platformId: initialPlatformId,
  content,
  media,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<PlatformId>(initialPlatformId);

  const config = PLATFORM_CONFIGS[activeTab] || PLATFORM_CONFIGS.twitter;

  // Format hashtags highlighting
  const renderFormattedContent = (text: string) => {
    if (!text) return <p className="italic text-slate-500">No content typed yet...</p>;

    const lines = text.split('\n');
    return lines.map((line, lIdx) => {
      const parts = line.split(/(#[a-zA-Z0-9_]+)/g);
      return (
        <p key={lIdx} className="mb-2 font-sans leading-relaxed text-slate-100">
          {parts.map((part, pIdx) => {
            if (part.startsWith('#')) {
              return (
                <span key={pIdx} className="text-cyan-400 font-semibold hover:underline">
                  {part}
                </span>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-lg animate-in fade-in">
      <div className="w-full max-w-2xl rounded-2xl glass-panel bg-slate-900 border border-cyan-500/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              REAL-TIME FEED MOCKUP PREVIEW
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

        {/* Platform Selector Tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-950 border-b border-slate-800 overflow-x-auto">
          {(['twitter', 'facebook', 'linkedin', 'instagram'] as PlatformId[]).map(
            (pid) => {
              const pConf = PLATFORM_CONFIGS[pid];
              const isActive = activeTab === pid;

              return (
                <button
                  key={pid}
                  type="button"
                  onClick={() => setActiveTab(pid)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span>{pConf.name}</span>
                </button>
              );
            }
          )}
        </div>

        {/* Platform Specific Mockup Feed Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-950/60 flex items-center justify-center">
          {/* TWITTER / X CARD MOCKUP */}
          {activeTab === 'twitter' && (
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-xl space-y-3 font-sans">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    CY
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-sm">
                        Cyber Creator
                      </span>
                      <Twitter className="w-3.5 h-3.5 text-sky-400" />
                    </div>
                    <span className="text-xs text-slate-500">@cyber_creator • 1m</span>
                  </div>
                </div>
                <MoreHorizontal className="w-4 h-4 text-slate-500" />
              </div>

              <div className="text-sm text-slate-200">
                {renderFormattedContent(content)}
              </div>

              {/* Media gallery */}
              {media.length > 0 && (
                <div
                  className={`grid gap-2 rounded-2xl overflow-hidden border border-slate-800 ${
                    media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                  }`}
                >
                  {media.slice(0, 4).map((m) => (
                    <img
                      key={m.id}
                      src={m.url}
                      alt={m.name}
                      className="w-full h-48 object-cover"
                    />
                  ))}
                </div>
              )}

              {/* Engagement icons */}
              <div className="flex items-center justify-between text-slate-500 pt-2 border-t border-slate-800/80 text-xs font-mono">
                <button className="flex items-center gap-1.5 hover:text-sky-400">
                  <MessageCircle className="w-4 h-4" />
                  <span>24</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-emerald-400">
                  <Repeat2 className="w-4 h-4" />
                  <span>12</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-rose-400">
                  <Heart className="w-4 h-4" />
                  <span>148</span>
                </button>
                <button className="hover:text-cyan-400">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* INSTAGRAM FEED MOCKUP */}
          {activeTab === 'instagram' && (
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl font-sans">
              <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600">
                    <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-[10px] font-bold text-white">
                      IG
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white">cyber.vision</span>
                    <p className="text-[10px] text-slate-400">Cyber City, Metaverse</p>
                  </div>
                </div>
                <MoreHorizontal className="w-4 h-4 text-slate-500" />
              </div>

              {/* Main Feed Image */}
              {media.length > 0 ? (
                <div className="w-full h-72 bg-slate-950 relative">
                  <img
                    src={media[0].url}
                    alt="Instagram Post"
                    className="w-full h-full object-cover"
                  />
                  {media.length > 1 && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] font-mono text-white">
                      1/{media.length}
                    </span>
                  )}
                </div>
              ) : (
                <div className="w-full h-60 bg-pink-950/20 border border-dashed border-pink-500/40 flex flex-col items-center justify-center text-pink-400 p-4 text-center">
                  <Instagram className="w-8 h-8 mb-2" />
                  <span className="text-xs font-bold font-mono">
                    MEDIA REQUIRED FOR INSTAGRAM
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Attach at least 1 image or video to satisfy Instagram constraint.
                  </p>
                </div>
              )}

              {/* Actions & Caption */}
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-rose-500 hover:scale-110 transition-transform cursor-pointer" />
                    <MessageCircle className="w-5 h-5 hover:text-white cursor-pointer" />
                    <Send className="w-5 h-5 hover:text-white cursor-pointer" />
                  </div>
                  <Bookmark className="w-5 h-5 hover:text-white cursor-pointer" />
                </div>

                <p className="text-xs font-bold text-white">342 likes</p>

                <div className="text-xs text-slate-200">
                  <span className="font-bold text-white mr-1.5">cyber.vision</span>
                  {renderFormattedContent(content)}
                </div>
              </div>
            </div>
          )}

          {/* LINKEDIN MOCKUP */}
          {activeTab === 'linkedin' && (
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-xl space-y-3 font-sans">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                    IN
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs text-white">
                        Cyber Analytics Inc.
                      </span>
                      <Linkedin className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      12,400 followers • 2h • Edited
                    </p>
                  </div>
                </div>
                <MoreHorizontal className="w-4 h-4 text-slate-500" />
              </div>

              <div className="text-xs text-slate-200">
                {renderFormattedContent(content)}
              </div>

              {media.length > 0 && (
                <div className="rounded-xl overflow-hidden border border-slate-800">
                  <img
                    src={media[0].url}
                    alt="LinkedIn attachment"
                    className="w-full h-52 object-cover"
                  />
                </div>
              )}

              <div className="flex items-center justify-between text-slate-400 pt-2 border-t border-slate-800 text-xs font-mono">
                <button className="flex items-center gap-1.5 hover:text-indigo-400">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Like</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-indigo-400">
                  <MessageCircle className="w-4 h-4" />
                  <span>Comment</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-indigo-400">
                  <Repeat2 className="w-4 h-4" />
                  <span>Repost</span>
                </button>
              </div>
            </div>
          )}

          {/* FACEBOOK MOCKUP */}
          {activeTab === 'facebook' && (
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-xl space-y-3 font-sans">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    FB
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs text-white">
                        Cyber Space Community
                      </span>
                      <Facebook className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <p className="text-[10px] text-slate-400">Public • 5 mins ago</p>
                  </div>
                </div>
                <MoreHorizontal className="w-4 h-4 text-slate-500" />
              </div>

              <div className="text-xs text-slate-200">
                {renderFormattedContent(content)}
              </div>

              {media.length > 0 && (
                <div className="rounded-xl overflow-hidden border border-slate-800">
                  <img
                    src={media[0].url}
                    alt="Facebook attachment"
                    className="w-full h-56 object-cover"
                  />
                </div>
              )}

              <div className="flex items-center justify-between text-slate-400 pt-2 border-t border-slate-800 text-xs font-mono">
                <button className="flex items-center gap-1.5 hover:text-blue-400">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Like</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-blue-400">
                  <MessageCircle className="w-4 h-4" />
                  <span>Comment</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-blue-400">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
