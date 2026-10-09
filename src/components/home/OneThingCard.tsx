import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, RotateCcw, Info, ArrowRight, Zap } from 'lucide-react';
import { OneThingState } from '../../services/storage';
import { soundService } from '../../services/sound';
import { DelightMascot } from '../common/DelightMascot';
import { MicroLessonModal } from '../common/MicroLessonModal';

interface OneThingCardProps {
  oneThing: OneThingState;
  onToggleComplete: () => void;
  onSwapTwoMinute: () => void;
  isCoachingPaused?: boolean;
}

export const OneThingCard: React.FC<OneThingCardProps> = ({
  oneThing,
  onToggleComplete,
  onSwapTwoMinute,
  isCoachingPaused = false,
}) => {
  const [showExplainer, setShowExplainer] = useState(false);

  const handleComplete = () => {
    soundService.playWin();
    soundService.triggerHaptic(50);
    if (!oneThing.completedToday) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0d9488', '#14b8a6', '#2dd4bf', '#38bdf8'],
      });
    }
    onToggleComplete();
  };

  const handleSwap = () => {
    soundService.playTap();
    onSwapTwoMinute();
  };

  const currentVersion = oneThing.isTwoMinuteMode
    ? oneThing.twoMinuteVersion
    : oneThing.normalVersion;

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-sm p-5 transition-all">
        {/* Subtle accent glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-teal-100/40 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header Zone */}
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            <span className="text-xs font-semibold tracking-wide text-teal-800 uppercase">
              One Thing Today
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">
              {currentVersion.duration}
            </span>
          </div>

          <DelightMascot
            mood={oneThing.completedToday ? 'celebrating' : oneThing.isTwoMinuteMode ? 'resting' : 'calm'}
            size="sm"
          />
        </div>

        {/* Primary Action Title */}
        <div className="mb-4 relative z-10">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-snug mb-1.5">
            {currentVersion.action}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {currentVersion.impact}
          </p>
        </div>

        {/* Badges / Micro-Lesson Trigger */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-5 pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              soundService.playTap();
              setShowExplainer(true);
            }}
            className="flex items-center gap-1.5 text-teal-700 hover:text-teal-800 font-medium py-1 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Why this works (30s explainer)</span>
          </button>

          {oneThing.isTwoMinuteMode && (
            <span className="text-[11px] font-medium text-amber-700 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>2-min micro win</span>
            </span>
          )}
        </div>

        {/* Primary Button Zone */}
        <div className="space-y-2 relative z-10">
          <button
            onClick={handleComplete}
            disabled={isCoachingPaused}
            className={`w-full h-12 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              oneThing.completedToday
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/10'
            }`}
          >
            {oneThing.completedToday ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Done for today! Tap to undo</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-teal-300" />
                <span>Mark Done</span>
              </>
            )}
          </button>

          {/* 2-minute version swap */}
          {!oneThing.completedToday && (
            <button
              onClick={handleSwap}
              className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors flex items-center justify-center gap-1.5 rounded-xl hover:bg-slate-50"
            >
              {oneThing.isTwoMinuteMode ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Switch back to standard suggestion</span>
                </>
              ) : (
                <>
                  <ArrowRight className="w-3.5 h-3.5 text-teal-600" />
                  <span>Too much today? Give me the 2-minute version</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <MicroLessonModal
        isOpen={showExplainer}
        onClose={() => setShowExplainer(false)}
        title={oneThing.title}
        explanation={oneThing.whyItWorks.plainExplanation}
        source={oneThing.whyItWorks.scientificSource}
        estimatedSeconds={30}
      />
    </>
  );
};
