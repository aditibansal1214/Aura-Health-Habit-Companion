import React, { useState } from 'react';
import { Mic, Droplets, Footprints, Utensils, Watch, Check, X, Sparkles, ArrowRight } from 'lucide-react';
import { soundService } from '../../services/sound';

interface SmartQuickLogSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWater: (glasses: number) => void;
  onAddSteps: (steps: number) => void;
  onAddMeal: (meal: { type: 'light' | 'normal' | 'heavy'; note?: string }) => void;
  onBatchLogParsed: (data: { sleep?: number; water?: number; steps?: number }) => void;
}

export const SmartQuickLogSheet: React.FC<SmartQuickLogSheetProps> = ({
  isOpen,
  onClose,
  onAddWater,
  onAddSteps,
  onAddMeal,
  onBatchLogParsed,
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'voice' | 'meal'>('quick');

  // Voice log state
  const [voiceQuery, setVoiceQuery] = useState('I slept 7.5 hours and drank 3 glasses of water');
  const [isListening, setIsListening] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<{ sleep?: number; water?: number; steps?: number } | null>(null);

  // Meal state
  const [mealType, setMealType] = useState<'light' | 'normal' | 'heavy'>('normal');
  const [mealNote, setMealNote] = useState('');

  if (!isOpen) return null;

  // Voice speech parse simulation
  const handleSimulateVoice = () => {
    soundService.playTap();
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      // Parse query
      const sleepMatch = voiceQuery.match(/(\d+(\.\d+)?)\s*(hours|hrs)/i);
      const waterMatch = voiceQuery.match(/(\d+)\s*(glasses|gls|litres|liters)/i);
      const stepsMatch = voiceQuery.match(/(\d+)\s*(steps)/i);

      setParsedPreview({
        sleep: sleepMatch ? parseFloat(sleepMatch[1]) : 7.5,
        water: waterMatch ? parseInt(waterMatch[1], 10) : 3,
        steps: stepsMatch ? parseInt(stepsMatch[1], 10) : undefined,
      });
      soundService.playWin();
    }, 1200);
  };

  const handleConfirmVoice = () => {
    if (parsedPreview) {
      soundService.playWin();
      onBatchLogParsed(parsedPreview);
      onClose();
    }
  };

  const handleSaveMeal = () => {
    soundService.playWin();
    onAddMeal({ type: mealType, note: mealNote || undefined });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wide">
              Smart Quick-Log
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Max 3-Tap Health Entry
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Connected Wearable Badge */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between mb-4 text-xs">
          <div className="flex items-center gap-2">
            <Watch className="w-4 h-4 text-teal-600" />
            <div>
              <span className="font-semibold text-slate-800">Apple Health Synced</span>
              <p className="text-[10px] text-slate-500">Auto-filled 5,100 steps & 7.2 hrs sleep</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
            Live Link
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl mb-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('quick')}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'quick' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            One-Tap
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'voice' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Voice Log
          </button>
          <button
            onClick={() => setActiveTab('meal')}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'meal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Photo-Free Meal
          </button>
        </div>

        {/* TAB 1: ONE-TAP QUICK LOG */}
        {activeTab === 'quick' && (
          <div className="space-y-4">
            {/* Water */}
            <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  <span className="text-xs font-bold text-sky-950">Water Glass (250ml)</span>
                </div>
                <span className="text-xs text-sky-700 font-mono">+1 Tap</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 4].map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      soundService.playWin();
                      onAddWater(g);
                      onClose();
                    }}
                    className="py-2.5 rounded-xl bg-white hover:bg-sky-100 text-sky-900 text-xs font-bold border border-sky-200 transition-all active:scale-95"
                  >
                    +{g} Glass{g > 1 ? 'es' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Steps check */}
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Footprints className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-950">Add Walk / Movement</span>
                </div>
                <span className="text-xs text-emerald-700 font-mono">Manual Bump</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[500, 1000, 2500].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      soundService.playWin();
                      onAddSteps(s);
                      onClose();
                    }}
                    className="py-2.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200 transition-all active:scale-95"
                  >
                    +{s.toLocaleString()} Steps
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VOICE LOGGING WITH CONFIRM STEP */}
        {activeTab === 'voice' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Speak naturally (e.g. "I slept seven and a half hours, drank two glasses"). We parse it into verified fields with zero manual typing.
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Sample or Custom Voice Transcript:
              </label>
              <input
                type="text"
                value={voiceQuery}
                onChange={(e) => setVoiceQuery(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 mb-3"
              />

              <button
                type="button"
                onClick={handleSimulateVoice}
                disabled={isListening}
                className="w-full h-11 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Mic className={`w-4 h-4 ${isListening ? 'animate-bounce text-amber-200' : ''}`} />
                <span>{isListening ? 'Parsing speech into metrics...' : 'Simulate Voice Input & Parse'}</span>
              </button>
            </div>

            {/* Parsed Confirmation Card */}
            {parsedPreview && (
              <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-teal-900 text-xs font-bold mb-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>Parsed Fields (Confirm Step):</span>
                </div>
                <div className="space-y-1.5 text-xs text-teal-950 mb-3 font-mono">
                  {parsedPreview.sleep && (
                    <div className="flex justify-between bg-white p-2 rounded-lg">
                      <span>Sleep Duration:</span>
                      <span className="font-bold">{parsedPreview.sleep} hours</span>
                    </div>
                  )}
                  {parsedPreview.water && (
                    <div className="flex justify-between bg-white p-2 rounded-lg">
                      <span>Hydration:</span>
                      <span className="font-bold">{parsedPreview.water} glasses</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleConfirmVoice}
                  className="w-full h-10 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm & Save to Today</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PHOTO-FREE MEAL LOGGING (ZERO CALORIE COUNTING PRESSURE) */}
        {activeTab === 'meal' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              No photo pressure and no tedious calorie weighing. Simply note your satiety level.
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'light' as const, label: 'Light Meal', desc: 'Salad, fruit, broth' },
                { type: 'normal' as const, label: 'Normal Meal', desc: 'Balanced plate' },
                { type: 'heavy' as const, label: 'Heavy Meal', desc: 'Dense or rich feast' },
              ].map((m) => (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => {
                    soundService.playTap();
                    setMealType(m.type);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    mealType === m.type
                      ? 'bg-amber-50 border-amber-400 text-amber-950 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="text-xs block capitalize mb-0.5">{m.label}</span>
                  <span className="text-[10px] text-slate-500">{m.desc}</span>
                </button>
              ))}
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Optional note (zero calories needed):
              </label>
              <input
                type="text"
                placeholder="e.g. Lentil soup with avocado"
                value={mealNote}
                onChange={(e) => setMealNote(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-900"
              />
            </div>

            <button
              onClick={handleSaveMeal}
              className="w-full h-11 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Utensils className="w-4 h-4" />
              <span>Log Meal (1 Tap)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
