import React, { useState } from 'react';
import { Sparkles, Brain, Check, BarChart2, HelpCircle } from 'lucide-react';
import { MoodEnergyEntry, DailyLog } from '../../types/health';
import { computePersonalCorrelations } from '../../services/storage';
import { soundService } from '../../services/sound';

interface MoodEnergyCheckinProps {
  moodLogs: MoodEnergyEntry[];
  dailyLogs: DailyLog[];
  onSaveCheckin: (entry: Omit<MoodEnergyEntry, 'id' | 'date'>) => void;
}

export const MoodEnergyCheckin: React.FC<MoodEnergyCheckinProps> = ({
  moodLogs,
  dailyLogs,
  onSaveCheckin,
}) => {
  const [energy, setEnergy] = useState<number>(4);
  const [mood, setMood] = useState<number>(4);
  const [stress, setStress] = useState<number>(2);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'evening'>('morning');
  const [hasLoggedToday, setHasLoggedToday] = useState<boolean>(false);
  const [showPatternDetails, setShowPatternDetails] = useState<boolean>(false);

  const correlations = computePersonalCorrelations(moodLogs, dailyLogs);

  const moodEmojis = [
    { val: 1, emoji: '😔', label: 'Low' },
    { val: 2, emoji: '😐', label: 'Meh' },
    { val: 3, emoji: '🙂', label: 'Fine' },
    { val: 4, emoji: '😊', label: 'Good' },
    { val: 5, emoji: '✨', label: 'Vibrant' },
  ];

  const energyEmojis = [
    { val: 1, label: 'Drained' },
    { val: 2, label: 'Low' },
    { val: 3, label: 'Steady' },
    { val: 4, label: 'High' },
    { val: 5, label: 'Peaked' },
  ];

  const stressEmojis = [
    { val: 1, label: 'Calm' },
    { val: 2, label: 'Mild' },
    { val: 3, label: 'Noticeable' },
    { val: 4, label: 'High' },
    { val: 5, label: 'Overloaded' },
  ];

  const handleSave = () => {
    soundService.playWin();
    soundService.triggerHaptic(30);
    onSaveCheckin({
      timeOfDay,
      energy,
      mood,
      stress,
    });
    setHasLoggedToday(true);
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs p-5 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            30-Second Check-In
          </span>
          <h3 className="text-sm font-bold text-slate-900">
            How are you feeling right now?
          </h3>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-medium text-slate-600">
          <button
            onClick={() => {
              soundService.playTap();
              setTimeOfDay('morning');
            }}
            className={`px-2 py-1 rounded-md transition-all ${
              timeOfDay === 'morning' ? 'bg-white text-slate-900 shadow-xs font-semibold' : ''
            }`}
          >
            Morning
          </button>
          <button
            onClick={() => {
              soundService.playTap();
              setTimeOfDay('evening');
            }}
            className={`px-2 py-1 rounded-md transition-all ${
              timeOfDay === 'evening' ? 'bg-white text-slate-900 shadow-xs font-semibold' : ''
            }`}
          >
            Evening
          </button>
        </div>
      </div>

      {hasLoggedToday ? (
        <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-100 flex items-center justify-between text-teal-950 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-teal-200/60 text-teal-800 flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold">Check-in logged for {timeOfDay}</p>
              <p className="text-[11px] text-teal-800">
                Energy: {energy}/5 · Mood: {mood}/5 · Stress: {stress}/5
              </p>
            </div>
          </div>
          <button
            onClick={() => setHasLoggedToday(false)}
            className="text-[11px] text-teal-700 underline font-medium"
          >
            Edit
          </button>
        </div>
      ) : (
        <div className="space-y-4 mb-4">
          {/* Energy Slider / Taps */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-700">Energy Level</span>
              <span className="text-xs font-semibold text-slate-900">
                {energyEmojis[energy - 1].label} ({energy}/5)
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    soundService.playTap();
                    setEnergy(lvl);
                  }}
                  className={`h-9 rounded-xl text-xs font-semibold transition-all ${
                    energy === lvl
                      ? 'bg-teal-600 text-white shadow-xs scale-102'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Mood Emojis */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-700">Mood</span>
              <span className="text-xs font-semibold text-slate-900">
                {moodEmojis[mood - 1].label}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {moodEmojis.map((item) => (
                <button
                  key={item.val}
                  onClick={() => {
                    soundService.playTap();
                    setMood(item.val);
                  }}
                  className={`h-9 rounded-xl text-base flex items-center justify-center transition-all ${
                    mood === item.val
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 scale-102'
                      : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Stress Level */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-700">Stress</span>
              <span className="text-xs font-semibold text-slate-900">
                {stressEmojis[stress - 1].label} ({stress}/5)
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    soundService.playTap();
                    setStress(lvl);
                  }}
                  className={`h-9 rounded-xl text-xs font-semibold transition-all ${
                    stress === lvl
                      ? 'bg-indigo-600 text-white shadow-xs scale-102'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Quick Check-In</span>
          </button>
        </div>
      )}

      {/* Feature 2: Personal Patterns & Correlations Section */}
      <div className="mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-xs font-bold text-slate-900">
              Personal Patterns
            </span>
          </div>
          <button
            onClick={() => setShowPatternDetails(!showPatternDetails)}
            className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-0.5"
          >
            <span>Details</span>
            <HelpCircle className="w-3 h-3" />
          </button>
        </div>

        {correlations.ready ? (
          <div className="space-y-2">
            {correlations.insights.map((ins) => (
              <div
                key={ins.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800"
              >
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold leading-tight text-slate-900 mb-0.5">
                      {ins.headline}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      {ins.detail}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <p className="text-[10px] text-slate-600 italic px-1">
              * Labeled as personal correlations, not clinical causes. Minimum 14 data points required.
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-500">
            <div className="flex items-center justify-between mb-1.5 text-[11px]">
              <span className="font-medium text-slate-700">Pattern activation progress</span>
              <span className="font-mono text-slate-900">
                {correlations.totalEntries}/{correlations.threshold} entries
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-teal-500 rounded-full"
                style={{
                  width: `${(correlations.totalEntries / correlations.threshold) * 100}%`,
                }}
              />
            </div>
            <p className="text-[10px] text-slate-600">
              Personal correlation engine requires 14+ entries to prevent random coincidences.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
