import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { ThreeBackground } from './components/ThreeBackground';
import { Header } from './components/Header';
import { PostComposer } from './components/PostComposer';
import { PlatformCards } from './components/PlatformCards';
import { ValidationSummary } from './components/ValidationSummary';
import { FooterActions } from './components/FooterActions';
import { PostPreviewModal } from './components/PostPreviewModal';
import { ScheduleModal } from './components/ScheduleModal';
import { DraftsDrawer } from './components/DraftsDrawer';
import { Toasts } from './components/Toasts';

import {
  MediaFile,
  PlatformId,
  PlatformValidation,
  SavedDraft,
  ToastMessage,
  PostPreset,
} from './types';
import { PLATFORM_CONFIGS, POST_PRESETS } from './data/platformConfigs';

export default function App() {
  // Post content state
  const [content, setContent] = useState<string>(POST_PRESETS[0].content);
  const [media, setMedia] = useState<MediaFile[]>(POST_PRESETS[0].sampleMedia || []);

  // Enabled platforms toggles state
  const [enabledPlatforms, setEnabledPlatforms] = useState<Record<PlatformId, boolean>>({
    twitter: true,
    facebook: true,
    linkedin: true,
    instagram: true,
    threads: false,
  });

  // Saved Drafts state
  const [drafts, setDrafts] = useState<SavedDraft[]>(() => {
    try {
      const saved = localStorage.getItem('cyber_post_drafts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'draft-sample-1',
        title: 'Quantum OS Launch',
        content: POST_PRESETS[0].content,
        media: POST_PRESETS[0].sampleMedia || [],
        enabledPlatforms: ['twitter', 'facebook', 'linkedin', 'instagram'],
        createdAt: 'Just now',
        updatedAt: 'Just now',
      },
    ];
  });

  // UI Modals & Drawers state
  const [previewPlatform, setPreviewPlatform] = useState<PlatformId | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [showDraftsDrawer, setShowDraftsDrawer] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Sync drafts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cyber_post_drafts', JSON.stringify(drafts));
    } catch (e) {
      console.error(e);
    }
  }, [drafts]);

  // Toast notification helper
  const addToast = (
    title: string,
    description?: string,
    type: 'success' | 'warning' | 'error' | 'info' = 'info'
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, title, description, type };
    setToasts((prev) => [newToast, ...prev].slice(0, 4));

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Real-time Constraint Validations Logic
  const validations = useMemo(() => {
    const result: Record<PlatformId, PlatformValidation> = {} as any;

    (Object.keys(PLATFORM_CONFIGS) as PlatformId[]).forEach((pid) => {
      const config = PLATFORM_CONFIGS[pid];
      const isEnabled = enabledPlatforms[pid] ?? true;
      const charCount = content.length;
      const mediaCount = media.length;

      const errors: string[] = [];
      const warnings: string[] = [];

      // Character limit check
      const isCharValid = charCount <= config.maxChars;
      if (!isCharValid) {
        errors.push(
          `Exceeds maximum limit of ${config.maxChars.toLocaleString()} characters by ${
            charCount - config.maxChars
          } chars.`
        );
      }

      // Media requirement check
      let isMediaValid = true;
      if (config.requiresMedia && mediaCount === 0) {
        isMediaValid = false;
        errors.push(
          `${config.name} REQUIRES at least 1 image or video attachment to publish.`
        );
      } else if (mediaCount > config.maxMediaCount) {
        isMediaValid = false;
        errors.push(
          `Exceeds maximum allowed media count of ${config.maxMediaCount} for ${config.name}.`
        );
      }

      const isValid = isEnabled ? isCharValid && isMediaValid : true;

      let status: 'pass' | 'warning' | 'error' | 'disabled' = 'disabled';
      if (isEnabled) {
        if (isValid) status = 'pass';
        else status = 'error';
      }

      result[pid] = {
        platformId: pid,
        enabled: isEnabled,
        charCount,
        maxChars: config.maxChars,
        mediaCount,
        isCharValid,
        isMediaValid,
        isValid,
        status,
        errors,
        warnings,
      };
    });

    return result;
  }, [content, media, enabledPlatforms]);

  // Overall validity across enabled platforms
  const isValidAll = useMemo(() => {
    return (Object.values(validations) as PlatformValidation[])
      .filter((v) => v.enabled)
      .every((v) => v.isValid);
  }, [validations]);

  // Media Management
  const handleAddMedia = (newFiles: MediaFile[]) => {
    setMedia((prev) => [...prev, ...newFiles]);
    addToast(
      'Media Attached',
      `Added ${newFiles.length} file(s). Total: ${media.length + newFiles.length}`,
      'success'
    );
  };

  const handleRemoveMedia = (id: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
  };

  const handleClearMedia = () => {
    setMedia([]);
    addToast('Media Cleared', 'All media attachments removed.', 'info');
  };

  // Toggle Platform switch
  const handleTogglePlatform = (pid: PlatformId) => {
    setEnabledPlatforms((prev) => ({
      ...prev,
      [pid]: !prev[pid],
    }));
  };

  // Load Preset Post
  const handleSelectPreset = (preset: PostPreset) => {
    setContent(preset.content);
    if (preset.sampleMedia && preset.sampleMedia.length > 0) {
      setMedia(preset.sampleMedia);
    }
    addToast('Preset Loaded', `Loaded template: "${preset.title}"`, 'success');
  };

  // Trim for specific platform
  const handleTrimForPlatform = (pid: PlatformId) => {
    const config = PLATFORM_CONFIGS[pid];
    if (!config) return;

    if (content.length > config.maxChars) {
      // Smart trim at last space or word boundary
      let trimmed = content.substring(0, config.maxChars - 3).trim();
      const lastSpace = trimmed.lastIndexOf(' ');
      if (lastSpace > config.maxChars * 0.7) {
        trimmed = trimmed.substring(0, lastSpace);
      }
      trimmed += '...';

      setContent(trimmed);
      addToast(
        'Post Auto-Trimmed',
        `Adjusted content to fit ${config.name}'s ${config.maxChars} character limit.`,
        'success'
      );
    }
  };

  // Auto-Fix All Issues
  const handleFixAllIssues = () => {
    setIsAiThinking(true);

    setTimeout(() => {
      let updatedText = content;

      // Find lowest character limit among enabled platforms
      const enabledConfigs = (Object.values(validations) as PlatformValidation[])
        .filter((v) => v.enabled)
        .map((v) => PLATFORM_CONFIGS[v.platformId]);

      const minMaxChars = Math.min(...enabledConfigs.map((c) => c.maxChars));

      if (updatedText.length > minMaxChars) {
        let trimmed = updatedText.substring(0, minMaxChars - 3).trim();
        const lastSpace = trimmed.lastIndexOf(' ');
        if (lastSpace > minMaxChars * 0.7) {
          trimmed = trimmed.substring(0, lastSpace);
        }
        updatedText = trimmed + '...';
      }

      // Check if media required for enabled platforms like Instagram
      let updatedMedia = [...media];
      const requiresMediaPlatform = enabledConfigs.find((c) => c.requiresMedia);
      if (requiresMediaPlatform && updatedMedia.length === 0) {
        // Auto attach 1 sample media
        updatedMedia = [PLATFORM_CONFIGS.instagram ? {
          id: `sample-auto-${Date.now()}`,
          url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
          name: 'Cyberpunk_Circuit.jpg',
          type: 'image',
          size: '1.2 MB',
        } : media[0]];
      }

      setContent(updatedText);
      setMedia(updatedMedia);
      setIsAiThinking(false);

      addToast(
        'Constraint Issues Resolved',
        'Auto-trimmed text and attached required media for selected platforms.',
        'success'
      );
    }, 400);
  };

  // Save Draft
  const handleSaveDraft = () => {
    const title = content.trim()
      ? content.trim().slice(0, 28) + '...'
      : 'Untitled Draft';

    const newDraft: SavedDraft = {
      id: `draft-${Date.now()}`,
      title,
      content,
      media,
      enabledPlatforms: Object.keys(enabledPlatforms).filter(
        (p) => enabledPlatforms[p as PlatformId]
      ) as PlatformId[],
      createdAt: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      updatedAt: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setDrafts((prev) => [newDraft, ...prev]);
    addToast('Draft Saved', `Saved "${title}" to your draft library.`, 'success');
  };

  // Load Draft from Drawer
  const handleLoadDraft = (draft: SavedDraft) => {
    setContent(draft.content);
    setMedia(draft.media);

    const newEnabled = { ...enabledPlatforms };
    Object.keys(newEnabled).forEach((p) => {
      newEnabled[p as PlatformId] = draft.enabledPlatforms.includes(
        p as PlatformId
      );
    });
    setEnabledPlatforms(newEnabled);

    setShowDraftsDrawer(false);
    addToast('Draft Loaded', `Loaded draft: "${draft.title}"`, 'info');
  };

  // Delete Draft
  const handleDeleteDraft = (id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
    addToast('Draft Deleted', 'Removed draft from storage.', 'info');
  };

  // Schedule Post Confirmation
  const handleConfirmSchedule = (formattedTime: string) => {
    setShowScheduleModal(false);

    // Fire Confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#3b82f6', '#10b981', '#a855f7'],
    });

    addToast(
      'Post Scheduled!',
      `Scheduled broadcast for ${formattedTime}.`,
      'success'
    );
  };

  // Publish Now Execution
  const handlePublishNow = () => {
    if (!isValidAll) {
      addToast(
        'Validation Warning',
        'Please fix platform constraint errors before publishing.',
        'warning'
      );
      return;
    }

    setIsPublishing(true);

    setTimeout(() => {
      setIsPublishing(false);

      // Trigger Celebration Confetti
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#06b6d4', '#10b981', '#3b82f6', '#f59e0b'],
      });

      addToast(
        'Broadcast Successful! 🚀',
        'Your post has been successfully dispatched across all selected platforms.',
        'success'
      );
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative selection:bg-cyan-500/30 selection:text-cyan-300">
      {/* Three.js Animated Particle Grid 3D Background */}
      <ThreeBackground gridSpeed={0.006} />

      {/* Floating Glass Toast System */}
      <Toasts toasts={toasts} onDismiss={removeToast} />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header Bar */}
        <Header
          draftsCount={drafts.length}
          onOpenDrafts={() => setShowDraftsDrawer(true)}
          onSelectPreset={handleSelectPreset}
          onAiEnhanceAll={handleFixAllIssues}
          isAiThinking={isAiThinking}
        />

        {/* Main Content Layout */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Top Real-time Validation Summary Bar */}
          <ValidationSummary
            validations={validations}
            onFixAllIssues={handleFixAllIssues}
          />

          {/* Two Column Grid: Left Composer, Right Platform Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Post Composition Panel (7 cols on lg) */}
            <div className="lg:col-span-7">
              <PostComposer
                content={content}
                onChangeContent={setContent}
                media={media}
                onAddMedia={handleAddMedia}
                onRemoveMedia={handleRemoveMedia}
                onClearMedia={handleClearMedia}
                onAiAutoTrim={handleFixAllIssues}
                isAiThinking={isAiThinking}
              />
            </div>

            {/* Right Column: Platform Selection & Constraint Cards (5 cols on lg) */}
            <div className="lg:col-span-5">
              <PlatformCards
                validations={validations}
                onTogglePlatform={handleTogglePlatform}
                onPreviewPlatform={(pid) => setPreviewPlatform(pid)}
                onTrimForPlatform={handleTrimForPlatform}
              />
            </div>
          </div>
        </main>

        {/* Footer Actions */}
        <FooterActions
          isValidAll={isValidAll}
          onSaveDraft={handleSaveDraft}
          onOpenSchedule={() => setShowScheduleModal(true)}
          onPublishNow={handlePublishNow}
          isPublishing={isPublishing}
        />
      </div>

      {/* MODALS & DRAWERS */}
      {previewPlatform && (
        <PostPreviewModal
          platformId={previewPlatform}
          content={content}
          media={media}
          onClose={() => setPreviewPlatform(null)}
        />
      )}

      {showScheduleModal && (
        <ScheduleModal
          onConfirmSchedule={handleConfirmSchedule}
          onClose={() => setShowScheduleModal(false)}
        />
      )}

      {showDraftsDrawer && (
        <DraftsDrawer
          drafts={drafts}
          onLoadDraft={handleLoadDraft}
          onDeleteDraft={handleDeleteDraft}
          onClose={() => setShowDraftsDrawer(false)}
        />
      )}
    </div>
  );
}
