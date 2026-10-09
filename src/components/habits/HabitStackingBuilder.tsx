import React, { useState } from 'react';
import { Plus, Check, Clock, Link2, Info, Sparkles, X } from 'lucide-react';
import { HabitStack } from '../../types/health';
import { soundService } from '../../services/sound';
import { MicroLessonModal } from '../common/MicroLessonModal';

interface HabitStackingBuilderProps {
  stacks: HabitStack[];
  onToggleComplete: (id: string) => void;
  onAddStack: (newStack: Omit<HabitStack, 'id' | 'completedToday' | 'history'>) => void;
}

export const HabitStackingBuilder: React.FC<HabitStackingBuilderProps> = ({
  stacks,
  onToggleComplete,
  onAddStack,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedExplainer, setSelectedExplainer] = useState<HabitStack | null>(null);

  // New Stack Form Fields
  const [anchorRoutine, setAnchorRoutine] = useState('After I start the kettle / coffee');
  const [anchorTime, setAnchorTime] = useState('08:00');
  const [microHabit, setMicroHabit] = useState('Drink 1 glass of room-temperature water');
  const [category, setCategory] = useState<'hydration' | 'movement' | 'mindfulness' | 'vitals' | 'sleep'>('hydration');

  const suggestedAnchors = [
    { anchor: 'After I brush my teeth in the morning', habit: 'Drink 1 glass of water', time: '07:15', cat: 'hydration' as const },
    { anchor: 'After I sit at my desk with coffee', habit: 'Take 3 diaphragmatic belly breaths', time: '08:45', cat: 'mindfulness' as const },
    { anchor: 'After I shut my laptop for work', habit: '5-minute balcony or yard walk', time: '17:30', cat: 'movement' as const },
    { anchor: 'After I plug in my phone at night', habit: 'Write 1 thing I am grateful for', time: '22:15', cat: 'sleep' as const },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!anchorRoutine || !microHabit) return;

    soundService.playWin();
    onAddStack({
      anchorRoutine,
      anchorTime,
      microHabit,
      category,
      whyItWorks: {
        plainExplanation: `Attaching "${microHabit}" to the existing synaptic groove of "${anchorRoutine}" reduces cognitive activation friction to under 30 seconds.`,
        scientificSource: 'Stanford Behavioral Design Lab (BJ Fogg Tiny Habits)',
        estimatedSeconds: 30,
      },
    });

    setIsAdding(false);
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center">
            <Link2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Habit Stacking
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Anchored Micro-Routines
            </h3>
          </div>
        </div>

        <button
          onClick={() => {
            soundService.playTap();
            setIsAdding(!isAdding);
          }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Stack</span>
        </button>
      </div>

      <p className="text-xs text-slate-600 mb-4 leading-relaxed">
        Attach new micro-habits to routines you never forget. Reminders fire exactly on your anchor cue, not at random hours.
      </p>

      {/* List of current stacks */}
      <div className="space-y-3 mb-3">
        {stacks.map((stack) => (
          <div
            key={stack.id}
            className={`p-4 rounded-2xl border transition-all ${
              stack.completedToday
                ? 'bg-emerald-50/50 border-emerald-200'
                : 'bg-slate-50 border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                {/* Anchor Routine */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
                  <span className="font-semibold text-teal-800">ANCHOR:</span>
                  <span className="text-slate-700">{stack.anchorRoutine}</span>
                  <span className="text-slate-300">·</span>
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="font-mono text-slate-600">{stack.anchorTime}</span>
                </div>

                {/* Micro Habit */}
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  → {stack.microHabit}
                </h4>

                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  <button
                    onClick={() => setSelectedExplainer(stack)}
                    className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-medium transition-colors"
                  >
                    <Info className="w-3 h-3" />
                    <span>Why this works</span>
                  </button>
                  <span>·</span>
                  <span>{stack.history.length} completions</span>
                </div>
              </div>

              {/* Checkbox Trigger */}
              <button
                onClick={() => {
                  soundService.playWin();
                  soundService.triggerHaptic(30);
                  onToggleComplete(stack.id);
                }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  stack.completedToday
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border-2 border-slate-300 text-transparent hover:border-slate-400'
                }`}
                aria-label={`Mark ${stack.microHabit} complete`}
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Stack Modal / Drawer */}
      {isAdding && (
        <div className="mt-4 p-4 rounded-2xl bg-slate-100/80 border border-slate-200 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Create New Anchor Stack
            </h4>
            <button
              onClick={() => setIsAdding(false)}
              className="text-slate-500 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Existing Routine (Anchor)
              </label>
              <input
                type="text"
                value={anchorRoutine}
                onChange={(e) => setAnchorRoutine(e.target.value)}
                placeholder="e.g. After I pour morning coffee"
                className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Anchor Usual Time
                </label>
                <input
                  type="time"
                  value={anchorTime}
                  onChange={(e) => setAnchorTime(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full h-9 px-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                >
                  <option value="hydration">Hydration</option>
                  <option value="movement">Movement</option>
                  <option value="mindfulness">Mindfulness</option>
                  <option value="vitals">Vitals Check</option>
                  <option value="sleep">Sleep Wind-Down</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                New Micro-Habit (Under 2 minutes)
              </label>
              <input
                type="text"
                value={microHabit}
                onChange={(e) => setMicroHabit(e.target.value)}
                placeholder="e.g. Drink 1 glass of water"
                className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            {/* Suggestions Chips */}
            <div>
              <span className="text-[10px] text-slate-500 font-medium block mb-1.5">
                Quick Inspirations:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {suggestedAnchors.map((sugg, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setAnchorRoutine(sugg.anchor);
                      setMicroHabit(sugg.habit);
                      setAnchorTime(sugg.time);
                      setCategory(sugg.cat);
                    }}
                    className="text-[11px] px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-left"
                  >
                    {sugg.habit}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-9 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Save & Connect Stack</span>
            </button>
          </form>
        </div>
      )}

      {selectedExplainer && (
        <MicroLessonModal
          isOpen={!!selectedExplainer}
          onClose={() => setSelectedExplainer(null)}
          title={`Stacking: ${selectedExplainer.microHabit}`}
          explanation={selectedExplainer.whyItWorks.plainExplanation}
          source={selectedExplainer.whyItWorks.scientificSource}
          estimatedSeconds={selectedExplainer.whyItWorks.estimatedSeconds}
        />
      )}
    </div>
  );
};
