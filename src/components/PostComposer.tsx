import React, { useState, useRef, ChangeEvent } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link as LinkIcon,
  Smile,
  Hash,
  Upload,
  Image as ImageIcon,
  Film,
  X,
  Plus,
  Sparkles,
  Trash2,
  FileText,
  Wand2,
  Eye,
  Check,
} from 'lucide-react';
import { MediaFile, PostPreset } from '../types';
import { SAMPLE_MEDIA_LIBRARY } from '../data/platformConfigs';

interface PostComposerProps {
  content: string;
  onChangeContent: (value: string) => void;
  media: MediaFile[];
  onAddMedia: (files: MediaFile[]) => void;
  onRemoveMedia: (id: string) => void;
  onClearMedia: () => void;
  onAiAutoTrim: () => void;
  isAiThinking?: boolean;
}

const COMMON_EMOJIS = [
  '🚀', '✨', '⚡', '🔥', '💡', '🎨', '💻', '🌐', '🤖', '🔮',
  '❤️', '👍', '🎯', '📢', '💎', '🎉', '🌟', '👇', '🔗', '🧠',
];

const POPULAR_HASHTAGS = [
  '#CyberDev', '#TechLaunch', '#ReactJS', '#Web3', '#UIDesign',
  '#ContentCreator', '#AI2026', '#SocialMedia', '#CodingLife', '#Innovation',
];

export const PostComposer: React.FC<PostComposerProps> = ({
  content,
  onChangeContent,
  media,
  onAddMedia,
  onRemoveMedia,
  onClearMedia,
  onAiAutoTrim,
  isAiThinking = false,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showHashtagsPopover, setShowHashtagsPopover] = useState(false);
  const [showSampleMediaModal, setShowSampleMediaModal] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to wrap or insert text at cursor position
  const insertTextAtCursor = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = `${before}${selectedText || 'text'}${after}`;

    const newContent =
      content.substring(0, start) + replacement + content.substring(end);
    onChangeContent(newContent);

    // Re-focus and set selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      );
    }, 0);
  };

  const handleBold = () => insertTextAtCursor('**', '**');
  const handleItalic = () => insertTextAtCursor('*', '*');
  const handleStrikethrough = () => insertTextAtCursor('~~', '~~');
  const handleCode = () => insertTextAtCursor('`', '`');

  const handleAddLink = () => {
    if (!linkInput.trim()) return;
    const formatted = ` [${linkInput}](${linkInput}) `;
    insertTextAtCursor('', formatted);
    setLinkInput('');
    setShowLinkModal(false);
  };

  const handleInsertEmoji = (emoji: string) => {
    insertTextAtCursor('', emoji);
    setShowEmojiPicker(false);
  };

  const handleInsertHashtag = (tag: string) => {
    insertTextAtCursor('', ` ${tag} `);
    setShowHashtagsPopover(false);
  };

  // Handle local file uploads
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newMediaFiles: MediaFile[] = Array.from(files).map((file: File, index: number) => {
      const isVideo = file.type.startsWith('video/');
      const url = URL.createObjectURL(file);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);

      return {
        id: `upload-${Date.now()}-${index}`,
        url,
        name: file.name,
        type: isVideo ? 'video' : 'image',
        size: `${sizeMB} MB`,
        file,
      };
    });

    onAddMedia(newMediaFiles);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const hashtagCount = (content.match(/#[a-zA-Z0-9_]+/g) || []).length;

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-2xl relative border border-cyan-500/20 bg-slate-900/70 backdrop-blur-md flex flex-col gap-5">
      {/* Panel Title & Meta */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white tracking-wide font-mono">
            POST COMPOSITION
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
            {wordCount} words
          </span>
          <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
            {hashtagCount} hashtags
          </span>
        </div>
      </div>

      {/* Rich Formatting Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-slate-950/80 border border-slate-800">
        <div className="flex items-center gap-1 flex-wrap">
          <button
            type="button"
            onClick={handleBold}
            title="Bold (**text**)"
            className="p-1.5 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleItalic}
            title="Italic (*text*)"
            className="p-1.5 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleStrikethrough}
            title="Strikethrough (~~text~~)"
            className="p-1.5 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleCode}
            title="Inline Code (`code`)"
            className="p-1.5 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <Code className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-slate-800 mx-1" />

          {/* Link Modal Toggle */}
          <button
            type="button"
            onClick={() => setShowLinkModal(!showLinkModal)}
            title="Add Link"
            className="p-1.5 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800/80 transition-colors cursor-pointer relative"
          >
            <LinkIcon className="w-4 h-4" />
          </button>

          {/* Emoji Popover Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowEmojiPicker(!showEmojiPicker);
                setShowHashtagsPopover(false);
              }}
              title="Insert Emoji"
              className="p-1.5 rounded-lg text-slate-300 hover:text-amber-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <Smile className="w-4 h-4" />
            </button>

            {showEmojiPicker && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowEmojiPicker(false)}
                />
                <div className="absolute left-0 mt-2 w-64 p-3 rounded-xl glass-panel bg-slate-900/95 border border-cyan-500/30 shadow-2xl z-40 grid grid-cols-5 gap-2">
                  {COMMON_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleInsertEmoji(emoji)}
                      className="p-2 text-lg rounded-lg hover:bg-slate-800 transition-transform active:scale-110 cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Hashtag Suggestions Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowHashtagsPopover(!showHashtagsPopover);
                setShowEmojiPicker(false);
              }}
              title="Insert Trending Hashtags"
              className="p-1.5 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <Hash className="w-4 h-4" />
            </button>

            {showHashtagsPopover && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowHashtagsPopover(false)}
                />
                <div className="absolute left-0 mt-2 w-72 p-3 rounded-xl glass-panel bg-slate-900/95 border border-cyan-500/30 shadow-2xl z-40">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Trending Tech Hashtags
                  </p>
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                    {POPULAR_HASHTAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleInsertHashtag(tag)}
                        className="px-2 py-1 rounded-md bg-slate-800 text-cyan-300 hover:bg-cyan-500/20 text-xs font-mono transition-colors cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* AI Smart Polish Action */}
        <button
          type="button"
          onClick={onAiAutoTrim}
          disabled={isAiThinking || !content.trim()}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:bg-cyan-500/20 transition-all cursor-pointer disabled:opacity-40"
        >
          <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Auto-Trim Text</span>
        </button>
      </div>

      {/* Link Input Popup Modal */}
      {showLinkModal && (
        <div className="p-3 rounded-xl bg-slate-950/90 border border-cyan-500/30 flex items-center gap-2 animate-in fade-in">
          <input
            type="url"
            placeholder="https://example.com/link"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="button"
            onClick={handleAddLink}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-semibold text-xs hover:bg-cyan-400 cursor-pointer"
          >
            Insert
          </button>
          <button
            type="button"
            onClick={() => setShowLinkModal(false)}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Rich Textarea Container */}
      <div className="relative group">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onChangeContent(e.target.value)}
          placeholder="What's happening in cyber space today? Type your post content..."
          rows={7}
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-all resize-y font-sans leading-relaxed tracking-wide"
        />

        {/* Live Total Character Count badge bottom right */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-xs font-mono text-cyan-400 shadow-md">
          {content.length} chars
        </div>
      </div>

      {/* ADD MEDIA SECTION */}
      <div className="space-y-3 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Attached Media ({media.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Sample Media Library Drawer Button */}
            <button
              type="button"
              onClick={() => setShowSampleMediaModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-cyan-300 hover:border-cyan-500/40 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sample Cyber Media</span>
            </button>

            {media.length > 0 && (
              <button
                type="button"
                onClick={onClearMedia}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Upload Button Dropzone */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept="image/*,video/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3.5 px-4 rounded-xl border border-dashed border-cyan-500/40 bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all flex items-center justify-center gap-2 text-cyan-300 font-medium text-xs cursor-pointer group glow-cyan"
          >
            <Upload className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>Upload Image / Video File</span>
          </button>
        </div>

        {/* Media Preview Grid */}
        {media.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {media.map((item) => (
              <div
                key={item.id}
                className="relative group rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 h-28 flex items-center justify-center shadow-lg"
              >
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-300 p-2 text-center">
                    <Film className="w-8 h-8 text-cyan-400 mb-1" />
                    <span className="text-[10px] font-mono truncate max-w-full">
                      {item.name}
                    </span>
                  </div>
                )}

                {/* Overlaid Badges */}
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-cyan-300 uppercase">
                  {item.type}
                </div>

                <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono text-slate-300">
                  {item.size}
                </div>

                {/* Delete Button overlay */}
                <button
                  type="button"
                  onClick={() => onRemoveMedia(item.id)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-950/90 text-rose-400 hover:text-white hover:bg-rose-600 transition-colors shadow-md cursor-pointer"
                  title="Remove media"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sample Media Drawer Modal */}
      {showSampleMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl glass-panel bg-slate-900 border border-cyan-500/40 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-mono">
                  SELECT CYBERPUNK SAMPLE MEDIA
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSampleMediaModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Attach high-resolution sample visuals to test Instagram and media validation instantly:
            </p>

            <div className="grid grid-cols-2 gap-3">
              {SAMPLE_MEDIA_LIBRARY.map((sample) => {
                const isSelected = media.some((m) => m.url === sample.url);

                return (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        const existing = media.find((m) => m.url === sample.url);
                        if (existing) onRemoveMedia(existing.id);
                      } else {
                        onAddMedia([sample]);
                      }
                    }}
                    className={`relative rounded-xl overflow-hidden border p-1 text-left transition-all cursor-pointer group ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-500/10 glow-cyan'
                        : 'border-slate-800 hover:border-slate-600 bg-slate-950'
                    }`}
                  >
                    <div className="h-24 w-full rounded-lg overflow-hidden relative">
                      <img
                        src={sample.url}
                        alt={sample.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-cyan-950/50 flex items-center justify-center">
                          <Check className="w-6 h-6 text-cyan-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-1.5 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-300 truncate max-w-[120px]">
                        {sample.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {sample.size}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowSampleMediaModal(false)}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-colors cursor-pointer"
              >
                Done Attaching
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
