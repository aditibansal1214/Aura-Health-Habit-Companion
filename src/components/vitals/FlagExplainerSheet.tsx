import React from 'react';
import { AlertCircle, HelpCircle, ArrowRight, Stethoscope, Wrench, X, Check } from 'lucide-react';
import { HealthFlag } from '../../types/health';
import { soundService } from '../../services/sound';

interface FlagExplainerSheetProps {
  flag: HealthFlag | null;
  onClose: () => void;
  onDismissOrCorrect: (flagId: string) => void;
}

export const FlagExplainerSheet: React.FC<FlagExplainerSheetProps> = ({
  flag,
  onClose,
  onDismissOrCorrect,
}) => {
  if (!flag) return null;

  const handleFixError = () => {
    soundService.playWin();
    onDismissOrCorrect(flag.id);
    onClose();
  };

  const getSeverityBadge = () => {
    switch (flag.severity) {
      case 'high':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'moderate':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-sky-100 text-sky-800 border-sky-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getSeverityBadge()}`}>
                {flag.severity} Attention
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500">Active for {flag.daysActive} days</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {flag.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. What triggered it & Threshold */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 mb-4 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Exact Trigger
            </span>
            <p className="font-semibold text-slate-900 mt-0.5">{flag.triggerReason}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
            <div>
              <span className="text-[10px] text-slate-500 block">Your Logged Value</span>
              <span className="font-mono font-bold text-slate-800">{flag.userValue}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Guideline Threshold</span>
              <span className="font-mono text-slate-600">{flag.threshold}</span>
            </div>
          </div>
        </div>

        {/* 2. Why it matters in plain words */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-teal-700" />
            <h4 className="text-xs font-bold text-slate-900">
              Why this matters in plain words
            </h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed bg-teal-50/50 p-3 rounded-xl border border-teal-100">
            {flag.plainWhy}
          </p>
        </div>

        {/* 3. 3 Realistic Actions */}
        <div className="mb-4">
          <h4 className="text-xs font-bold text-slate-900 mb-2">
            3 Realistic Micro-Steps You Can Take
          </h4>
          <div className="space-y-1.5">
            {flag.realisticActions.map((act, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800 flex items-start gap-2"
              >
                <div className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <span>{act}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Talk to a clinician if... */}
        <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/80 mb-5">
          <div className="flex items-center gap-2 mb-1">
            <Stethoscope className="w-3.5 h-3.5 text-amber-800" />
            <h4 className="text-xs font-bold text-amber-950">
              Talk to a clinician if:
            </h4>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed">
            {flag.clinicianCriteria}
          </p>
        </div>

        {/* 5. "This looks wrong" to fix data-entry errors in 1 tap */}
        <div className="space-y-2">
          <button
            onClick={handleFixError}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Wrench className="w-3.5 h-3.5 text-slate-500" />
            <span>"This looks wrong" — Clear / Recalibrate entry error</span>
          </button>

          <button
            onClick={onClose}
            className="w-full h-10 rounded-xl bg-slate-900 text-white text-xs font-semibold"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
