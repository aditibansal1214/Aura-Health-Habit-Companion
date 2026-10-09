import React from 'react';
import { Sliders, CheckCircle2, Sparkles, X, Activity } from 'lucide-react';
import { FeatureFlags } from '../../types/health';
import { soundService } from '../../services/sound';

interface FeatureFlagsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  flags: FeatureFlags;
  onToggleFlag: (key: keyof FeatureFlags) => void;
}

export const FeatureFlagsSheet: React.FC<FeatureFlagsSheetProps> = ({
  isOpen,
  onClose,
  flags,
  onToggleFlag,
}) => {
  if (!isOpen) return null;

  const featureList: { key: keyof FeatureFlags; name: string; desc: string; num: number }[] = [
    { num: 1, key: 'oneThingHome', name: '"One Thing Today" Home Mode', desc: 'Single card, highest-impact action with 2-min swap' },
    { num: 2, key: 'moodEnergyCheckin', name: 'Energy & Mood Check-In', desc: '30s emoji check-in with 14-point correlation engine' },
    { num: 3, key: 'habitStacking', name: '"Habit Stacking" Builder', desc: 'Anchor micro-habits to routines with cue reminders' },
    { num: 4, key: 'quietNudges', name: 'Smart, Quiet Nudges', desc: 'Hard cap 2/day, quiet hours, auto-silence on 2 ignores' },
    { num: 5, key: 'streaksWithGrace', name: 'Streaks with Grace', desc: 'Weekly "life happens" pass & 48h repair window' },
    { num: 6, key: 'personalBaseline', name: 'Personal Baseline & Beat Average', desc: '14-day rolling average target + opt-in peer context' },
    { num: 7, key: 'weeklyHealthStory', name: 'Weekly "Health Story" Recap', desc: 'Spotify-Wrapped recap, zero weight on cards' },
    { num: 8, key: 'doctorVisitPrep', name: 'Doctor-Visit Prep Mode', desc: '1-page clinical summary, BP table, persistent flags' },
    { num: 9, key: 'guidedBPCheck', name: 'Guided Home BP Check', desc: 'Seated posture check, 5-min timer, 3-reading average' },
    { num: 10, key: 'quitSmokingCompanion', name: 'Quit-Smoking Companion', desc: 'Craving SOS (box breath, distraction, wave timer)' },
    { num: 11, key: 'microLessons', name: 'Micro-Lessons & "Why This Works"', desc: '30-second science explainer cards with citations' },
    { num: 12, key: 'smartQuickLog', name: 'Smart Quick-Log Everywhere', desc: 'Voice parsing simulation & photo-free meal satiety' },
    { num: 13, key: 'flagExplainer', name: 'Flag Explainer & What Can I Do', desc: 'Bottom sheet, threshold details, 1-tap data fix' },
    { num: 14, key: 'accountabilityCircle', name: 'Accountability Circle', desc: 'Invite 3 people, strictly shields raw vitals & weight' },
    { num: 15, key: 'adaptivePrograms', name: 'Adaptive Programs (Reset/Steady)', desc: 'Auto-softens on 3 missed days instead of failing' },
    { num: 16, key: 'plainLanguageMode', name: 'Plain-Language & Accessibility', desc: 'Simple/standard reading, large text, English + Hindi' },
    { num: 17, key: 'progressJourney', name: 'Show Me My Progress Journey', desc: 'Milestone timeline, non-punitive before/after charts' },
    { num: 18, key: 'privacyDashboard', name: 'Privacy Dashboard as a Feature', desc: 'Interactive data map, 1-tap JSON export, local storage' },
    { num: 19, key: 'gentleSafetyNet', name: 'Gentle Safety Net', desc: 'Distress detection, pause coaching, crisis helplines' },
    { num: 20, key: 'delightLayer', name: 'Delight Layer', desc: 'Lumi companion mascot, Web Audio chimes, confetti' },
  ];

  // Calculate "Weekly Meaningful Habit Engagement" Index
  const activeCount = Object.values(flags).filter(Boolean).length;
  const engagementScore = Math.round((activeCount / featureList.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wide">
                Feature Flag Engine
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Gradual Rollout & Engagement
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Meaningful Engagement Metric Banner */}
        <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-teal-700 shrink-0" />
            <div>
              <span className="text-[11px] font-semibold text-teal-900 uppercase tracking-wider block">
                Weekly Meaningful Habit Engagement
              </span>
              <p className="text-xs text-teal-800">
                {activeCount} of 20 signature features active
              </p>
            </div>
          </div>
          <span className="text-lg font-bold font-mono text-teal-900">
            {engagementScore}%
          </span>
        </div>

        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          Toggle individual features to test gradual onboarding or customize user workflows.
        </p>

        {/* 20 Features Toggles */}
        <div className="space-y-2 mb-5">
          {featureList.map((f) => {
            const isEnabled = flags[f.key];
            return (
              <div
                key={f.key}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
              >
                <div className="flex-1 pr-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                      #{f.num}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {f.name}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    {f.desc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundService.playTap();
                    onToggleFlag(f.key);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center shrink-0 ${
                    isEnabled ? 'bg-teal-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      isEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full h-11 rounded-xl bg-slate-900 text-white text-xs font-semibold"
        >
          Done
        </button>
      </div>
    </div>
  );
};
