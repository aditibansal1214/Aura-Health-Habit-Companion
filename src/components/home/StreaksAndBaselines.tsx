import React, { useState } from 'react';
import { Flame, Shield, Wrench, Heart, Sparkles, TrendingUp, Users, Check } from 'lucide-react';
import { StreakState, compute14DayBaselines } from '../../services/storage';
import { DailyLog } from '../../types/health';
import { soundService } from '../../services/sound';

interface StreaksAndBaselinesProps {
  streakState: StreakState;
  dailyLogs: DailyLog[];
  onRepairStreak: () => void;
  onUseLifePass: () => void;
  peerContextOptIn: boolean;
  onTogglePeerContext: () => void;
}

export const StreaksAndBaselines: React.FC<StreaksAndBaselinesProps> = ({
  streakState,
  dailyLogs,
  onRepairStreak,
  onUseLifePass,
  peerContextOptIn,
  onTogglePeerContext,
}) => {
  const [repairedNotice, setRepairedNotice] = useState<string | null>(null);
  const baselines = compute14DayBaselines(dailyLogs);

  const handleRepair = () => {
    soundService.playWin();
    soundService.triggerHaptic(40);
    onRepairStreak();
    setRepairedNotice('Streak repaired with grace! Yesterday counted.');
    setTimeout(() => setRepairedNotice(null), 4000);
  };

  const handleUsePass = () => {
    soundService.playTap();
    onUseLifePass();
  };

  return (
    <div className="space-y-4 mb-4">
      {/* Feature 5: Streaks with Grace */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Streaks with Grace
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                {streakState.currentStreak} Day Continuity
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-500">Best</span>
            <p className="text-xs font-bold text-slate-700 font-mono">
              {streakState.longestStreak} days
            </p>
          </div>
        </div>

        {/* Life happens passes indicator */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-600 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-900">
                Weekly "Life Happens" Passes
              </p>
              <p className="text-[11px] text-slate-500">
                Rest days protected without breaking your rhythm.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2].map((passNum) => {
              const isAvailable = passNum <= streakState.lifePassesLeftThisWeek;
              return (
                <div
                  key={passNum}
                  title={isAvailable ? 'Pass available' : 'Pass used this week'}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isAvailable
                      ? 'bg-teal-100 text-teal-800 border border-teal-300'
                      : 'bg-slate-200 text-slate-400 line-through'
                  }`}
                >
                  {isAvailable ? '✓' : '—'}
                </div>
              );
            })}
          </div>
        </div>

        {/* Comeback Celebration or 48-Hour Repair Button */}
        {repairedNotice ? (
          <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{repairedNotice}</span>
          </div>
        ) : streakState.canRepair48h ? (
          <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-700 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-950">
                  Forgot to log yesterday?
                </p>
                <p className="text-[11px] text-amber-800">
                  48-hour grace window open to keep your momentum.
                </p>
              </div>
            </div>
            <button
              onClick={handleRepair}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold whitespace-nowrap transition-colors shadow-xs"
            >
              Repair Streak
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-500 px-1">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>
              Comeback rule: Day 1 again is celebrated just as warmly as Day 30.
            </span>
          </div>
        )}
      </div>

      {/* Feature 6: Personal Baseline & "Beat Your Own Average" */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Beat Your Own Average
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Personal 14-Day Baseline
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              soundService.playTap();
              onTogglePeerContext();
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              peerContextOptIn
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <Users className="w-3 h-3" />
            <span>Peer Context: {peerContextOptIn ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          Targets are calibrated from your real past 14 days + a tiny step, never arbitrary population norms.
        </p>

        {/* 3 Metric Baseline Cards */}
        <div className="grid grid-cols-3 gap-2.5 mb-3">
          {/* Steps */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">
              Steps / Day
            </span>
            <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">
              {baselines.avgSteps.toLocaleString()}
            </p>
            <div className="mt-1 pt-1 border-t border-slate-200/60 text-[10px] text-teal-700 font-medium flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Goal: {baselines.targetSteps.toLocaleString()}</span>
            </div>
          </div>

          {/* Sleep */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">
              Sleep / Night
            </span>
            <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">
              {baselines.avgSleep} hrs
            </p>
            <div className="mt-1 pt-1 border-t border-slate-200/60 text-[10px] text-teal-700 font-medium flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Goal: {baselines.targetSleep} hrs</span>
            </div>
          </div>

          {/* Hydration */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">
              Water Glasses
            </span>
            <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">
              {baselines.avgWater} gls
            </p>
            <div className="mt-1 pt-1 border-t border-slate-200/60 text-[10px] text-teal-700 font-medium flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Goal: {baselines.targetWater} gls</span>
            </div>
          </div>
        </div>

        {/* Secondary Peer Context View (Opt-in only) */}
        {peerContextOptIn && (
          <div className="p-3.5 bg-indigo-50/70 rounded-2xl border border-indigo-100 text-xs text-indigo-950 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-[11px] text-indigo-900 uppercase tracking-wider">
                Peer Context (Adults 30–49 Reference)
              </span>
              <span className="text-[10px] text-indigo-600 font-medium">Secondary View</span>
            </div>
            <p className="text-[11px] text-indigo-800 leading-relaxed mb-2">
              For reference only: median adults log ~6,100 steps and 6.9 hrs sleep. Your personalized target remains rooted in your own 14-day reality.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-indigo-700 font-medium">
              <span>Your step baseline is in the 68th percentile</span>
              <span>·</span>
              <span>Sleep is in 64th percentile</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
