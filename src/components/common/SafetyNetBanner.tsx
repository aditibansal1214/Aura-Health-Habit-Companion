import React, { useState } from 'react';
import { HeartHandshake, Phone, PauseCircle, PlayCircle, X } from 'lucide-react';
import { soundService } from '../../services/sound';

interface SafetyNetBannerProps {
  isCoachingPaused: boolean;
  onTogglePauseCoaching: () => void;
  recentAvgMood?: number;
}

export const SafetyNetBanner: React.FC<SafetyNetBannerProps> = ({
  isCoachingPaused,
  onTogglePauseCoaching,
  recentAvgMood = 3.5,
}) => {
  const [showHelpline, setShowHelpline] = useState(false);
  const [dismissedForNow, setDismissedForNow] = useState(false);

  // Trigger safety net condition: coaching paused OR average mood is low (< 2.5)
  const isDistressedCondition = recentAvgMood < 2.5;

  if (dismissedForNow && !isCoachingPaused) return null;
  if (!isCoachingPaused && !isDistressedCondition) return null;

  return (
    <div className="mb-4">
      {isCoachingPaused ? (
        <div className="p-3.5 bg-amber-50/90 border border-amber-200/80 rounded-2xl flex items-center justify-between gap-3 text-amber-950">
          <div className="flex items-center gap-2.5">
            <PauseCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-semibold">Coaching is currently paused</p>
              <p className="text-[11px] text-amber-800">
                All nudges and goals are silenced. You can still track freely whenever you wish.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundService.playTap();
              onTogglePauseCoaching();
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-200/80 hover:bg-amber-300/80 text-amber-900 text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Resume</span>
          </button>
        </div>
      ) : (
        <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl relative shadow-xs">
          <button
            onClick={() => setDismissedForNow(true)}
            className="absolute top-3 right-3 text-sky-400 hover:text-sky-700"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div className="pr-5">
              <h4 className="text-xs font-bold text-sky-950 mb-0.5">
                Take it gently today
              </h4>
              <p className="text-xs text-sky-800 leading-relaxed mb-3">
                We noticed your recent energy or mood has been lower. You do not need to push through goals or streaks right now. Real health includes rest.
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    soundService.playTap();
                    onTogglePauseCoaching();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-sky-200/80 hover:bg-sky-300 text-sky-950 text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <PauseCircle className="w-3.5 h-3.5" />
                  <span>Pause coaching for now</span>
                </button>
                <button
                  onClick={() => {
                    soundService.playTap();
                    setShowHelpline(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white border border-sky-200 hover:bg-sky-50 text-sky-800 text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Support resources</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verified Support Hotline Modal */}
      {showHelpline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Support Resources</h3>
              <button
                onClick={() => setShowHelpline(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              If you’re feeling overwhelmed, anxious, or facing heavy thoughts, compassionate professionals are available 24/7.
            </p>
            <div className="space-y-2.5 mb-5">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-900">988 Suicide & Crisis Lifeline</p>
                <p className="text-[11px] text-slate-500 mb-1">Free, confidential 24/7 support in US/Canada</p>
                <span className="text-xs font-mono font-semibold text-teal-700">Call or Text 988</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-900">Crisis Text Line</p>
                <p className="text-[11px] text-slate-500 mb-1">Connect with a volunteer crisis counselor</p>
                <span className="text-xs font-mono font-semibold text-teal-700">Text HOME to 741741</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-900">International Helplines</p>
                <p className="text-[11px] text-slate-500">Find free resources worldwide</p>
                <span className="text-xs text-teal-700 underline">findahelpline.com</span>
              </div>
            </div>
            <button
              onClick={() => setShowHelpline(false)}
              className="w-full h-10 rounded-xl bg-slate-900 text-white text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
