import React from 'react';
import { Compass, CheckCircle2, ShieldAlert, Sparkles, X, ArrowRight, Heart } from 'lucide-react';
import { AdaptiveProgram } from '../../types/health';
import { soundService } from '../../services/sound';

interface AdaptiveProgramsModalProps {
  isOpen: boolean;
  onClose: () => void;
  programs: AdaptiveProgram[];
  onSelectProgram: (id: AdaptiveProgram['id']) => void;
  onTriggerSoftening: (id: AdaptiveProgram['id']) => void;
}

export const AdaptiveProgramsModal: React.FC<AdaptiveProgramsModalProps> = ({
  isOpen,
  onClose,
  programs,
  onSelectProgram,
  onTriggerSoftening,
}) => {
  if (!isOpen) return null;

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
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wide">
                Adaptive Guidance
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Programs That Soften, Not Fail
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

        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          Programs adjust difficulty automatically from your adherence. If life gets busy and you miss 3 days, the system softens targets rather than showing red marks.
        </p>

        {/* 3 Programs */}
        <div className="space-y-3 mb-5">
          {programs.map((prog) => (
            <div
              key={prog.id}
              className={`p-4 rounded-2xl border transition-all ${
                prog.active
                  ? 'bg-teal-50/70 border-teal-300 shadow-xs'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{prog.title}</h4>
                    {prog.active && (
                      <span className="px-2 py-0.5 rounded-full bg-teal-600 text-white text-[10px] font-bold">
                        Active
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {prog.durationWeeks} Weeks · Week {prog.currentWeek}
                  </span>
                </div>

                {!prog.active ? (
                  <button
                    onClick={() => {
                      soundService.playWin();
                      onSelectProgram(prog.id);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold whitespace-nowrap"
                  >
                    Select
                  </button>
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-teal-600" />
                )}
              </div>

              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                {prog.description}
              </p>

              <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 text-xs mb-2">
                <span className="font-semibold text-teal-900 block text-[10px] uppercase">
                  Current Step:
                </span>
                <span className="text-slate-800">{prog.currentStep}</span>
              </div>

              {/* Soften State Indicator */}
              {prog.active && (
                <div className="pt-2 border-t border-teal-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-teal-800">
                    <Heart className="w-3.5 h-3.5 text-teal-600" />
                    <span>
                      {prog.isSoftened
                        ? 'Softened Mode: Targets reduced to protect recovery'
                        : 'Miss 3 days → Automatically softens (zero shame)'}
                    </span>
                  </div>

                  {!prog.isSoftened && (
                    <button
                      onClick={() => {
                        soundService.playTap();
                        onTriggerSoftening(prog.id);
                      }}
                      className="text-[11px] text-teal-700 underline font-medium"
                    >
                      Simulate 3 Misses
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full h-11 rounded-xl bg-slate-900 text-white text-xs font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
};
