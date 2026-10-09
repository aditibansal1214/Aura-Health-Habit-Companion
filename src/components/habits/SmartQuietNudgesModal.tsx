import React, { useState } from 'react';
import { Bell, BellOff, Moon, Shield, Clock, AlertCircle, Check } from 'lucide-react';
import { NudgeConfig } from '../../types/health';
import { soundService } from '../../services/sound';

interface SmartQuietNudgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: NudgeConfig;
  onUpdateConfig: (updated: NudgeConfig) => void;
}

export const SmartQuietNudgesModal: React.FC<SmartQuietNudgesModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
}) => {
  const [quietStart, setQuietStart] = useState(config.quietHoursStart);
  const [quietEnd, setQuietEnd] = useState(config.quietHoursEnd);
  const [isPausedWeek, setIsPausedWeek] = useState(!!config.pausedUntilDate);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePauseForWeek = () => {
    soundService.playTap();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const newPaused = !isPausedWeek ? nextWeek.toISOString() : null;
    setIsPausedWeek(!isPausedWeek);
    onUpdateConfig({
      ...config,
      pausedUntilDate: newPaused,
    });
  };

  const handleSave = () => {
    soundService.playWin();
    onUpdateConfig({
      ...config,
      quietHoursStart: quietStart,
      quietHoursEnd: quietEnd,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wide">
                Smart, Quiet Nudges
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Guilt-Free Notifications
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          Zero streak-loss shaming, zero urgency countdowns. Nudges adapt to your actual rhythm and automatically quiet down if ignored.
        </p>

        {/* 3 Non-Negotiable Protection Rules */}
        <div className="space-y-3 mb-5">
          {/* Rule 1: Hard Cap 2/day */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-teal-600 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-900">
                  Daily Cap: Max 2 Nudges / Day
                </p>
                <p className="text-[11px] text-slate-500">
                  {config.nudgesSentToday} sent today. Hard limit never exceeded.
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 text-[11px] font-mono font-bold">
              Hard Capped
            </span>
          </div>

          {/* Rule 2: Adaptive Timing */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-slate-900">
                Learned Habit Windows
              </p>
              <p className="text-[11px] text-slate-500 mb-1">
                Learned from your actual logs: around 08:00 AM and 08:00 PM.
              </p>
              <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                Adaptive Timing: Active
              </span>
            </div>
          </div>

          {/* Rule 3: 2-Ignore Silence Auto Rule */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-slate-900">
                2-Ignore Respect Rule
              </p>
              <p className="text-[11px] text-slate-500">
                If a nudge is ignored twice, it automatically stops and asks: "Want fewer of these?"
              </p>
            </div>
          </div>
        </div>

        {/* Quiet Hours Settings */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Moon className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-xs font-semibold text-slate-800">
              Quiet Hours (Zero sound or alerts)
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-500 block mb-0.5">Start Time</label>
              <input
                type="time"
                value={quietStart}
                onChange={(e) => setQuietStart(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block mb-0.5">End Time</label>
              <input
                type="time"
                value={quietEnd}
                onChange={(e) => setQuietEnd(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-900 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Pause for a Week button */}
        <div className="mb-5">
          <button
            type="button"
            onClick={handlePauseForWeek}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              isPausedWeek
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <BellOff className="w-3.5 h-3.5" />
            <span>
              {isPausedWeek
                ? 'Nudges Paused for 7 Days (Tap to unpause)'
                : 'Pause All Nudges for a Week'}
            </span>
          </button>
        </div>

        <button
          onClick={handleSave}
          className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Saved quiet preferences</span>
            </>
          ) : (
            <span>Save Preferences</span>
          )}
        </button>
      </div>
    </div>
  );
};
