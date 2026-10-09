import React, { useState, useEffect } from 'react';
import { Flame, Shield, Clock, DollarSign, HeartHandshake, Sparkles, Phone, AlertCircle, RefreshCw, X, Play, Pause } from 'lucide-react';
import { QuitSmokingState } from '../../types/health';
import { soundService } from '../../services/sound';

interface QuitSmokingCompanionProps {
  state: QuitSmokingState;
  onUpdateState: (updated: QuitSmokingState) => void;
}

export const QuitSmokingCompanion: React.FC<QuitSmokingCompanionProps> = ({
  state,
  onUpdateState,
}) => {
  const [showSOS, setShowSOS] = useState(false);
  const [sosTab, setSosTab] = useState<'breathe' | 'distract' | 'wave'>('breathe');

  // Breathing Box state (4-4-4-4 seconds)
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Hold Empty'>('Inhale');
  const [breathTimer, setBreathTimer] = useState(4);
  const [breathActive, setBreathActive] = useState(false);

  // Ride the wave timer (3 minutes = 180s)
  const [waveSeconds, setWaveSeconds] = useState(180);
  const [waveRunning, setWaveRunning] = useState(false);

  // Distraction game state: tap the right tiles
  const [distractScore, setDistractScore] = useState(0);

  // Trigger modal
  const [showTriggerLog, setShowTriggerLog] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState<QuitSmokingState['cravingsLogged'][0]['trigger']>('stress');
  const [triggerIntensity, setTriggerIntensity] = useState(3);

  // Slip modal
  const [showSlipModal, setShowSlipModal] = useState(false);

  // Breathing cycle effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (breathActive) {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            soundService.playCalmTone(396);
            setBreathPhase((p) => {
              if (p === 'Inhale') return 'Hold';
              if (p === 'Hold') return 'Exhale';
              if (p === 'Exhale') return 'Hold Empty';
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [breathActive]);

  // Wave timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (waveRunning && waveSeconds > 0) {
      interval = setInterval(() => {
        setWaveSeconds((prev) => {
          if (prev <= 1) {
            setWaveRunning(false);
            soundService.playWin();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [waveRunning, waveSeconds]);

  // Calculate smoke free duration and money saved
  const quitTime = new Date(state.quitDate).getTime();
  const now = new Date().getTime();
  const diffHours = Math.max(0, Math.floor((now - quitTime) / (1000 * 60 * 60)));
  const diffDays = Math.floor(diffHours / 24);
  const remainingHours = diffHours % 24;

  const packsSaved = (diffDays * (state.cigsPerDayPrior / state.cigsPerPack)).toFixed(1);
  const moneySaved = Math.round(parseFloat(packsSaved) * state.costPerPack);

  const handleLogCraving = () => {
    soundService.playWin();
    const newCraving = {
      id: `crav-${Date.now()}`,
      timestamp: new Date().toISOString(),
      trigger: selectedTrigger,
      intensity: triggerIntensity,
      usedSOS: true,
    };
    onUpdateState({
      ...state,
      cravingsLogged: [newCraving, ...state.cravingsLogged],
    });
    setShowTriggerLog(false);
  };

  const handleReportSlip = () => {
    soundService.playTap();
    onUpdateState({
      ...state,
      slipsCount: state.slipsCount + 1,
    });
    setShowSlipModal(false);
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs p-5 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Smoke-Free Companion
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Gentle Recovery Tracker
            </h3>
          </div>
        </div>

        {/* Craving SOS Button */}
        <button
          onClick={() => {
            soundService.playTap();
            setShowSOS(true);
            setBreathActive(true);
          }}
          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all animate-pulse"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Craving SOS</span>
        </button>
      </div>

      {/* Days & Money Counters */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mb-1">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>Smoke-Free Time</span>
          </div>
          <p className="text-base font-bold text-slate-900 font-mono">
            {diffDays}d {remainingHours}h
          </p>
          <span className="text-[10px] text-teal-700 font-medium">Over 168 hours clean</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mb-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>Money Saved</span>
          </div>
          <p className="text-base font-bold text-slate-900 font-mono">
            ${moneySaved}
          </p>
          <span className="text-[10px] text-emerald-700 font-medium">~{packsSaved} packs avoided</span>
        </div>
      </div>

      {/* Relapse-Friendly Messaging Banner */}
      <div className="p-3 bg-teal-50/60 rounded-2xl border border-teal-100 mb-3 flex items-start gap-2.5">
        <HeartHandshake className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <div className="text-xs text-teal-950">
          <p className="font-semibold mb-0.5">Relapse-Friendly Philosophy</p>
          <p className="text-teal-900 text-[11px] leading-relaxed">
            "A slip isn't failure; here's what we learned." Healing is non-linear. You never restart at zero experience.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            soundService.playTap();
            setShowTriggerLog(true);
          }}
          className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors text-center"
        >
          Log Craving Trigger
        </button>
        <button
          onClick={() => {
            soundService.playTap();
            setShowSlipModal(true);
          }}
          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-medium transition-colors"
        >
          Report a Slip
        </button>
      </div>

      {/* CRAVING SOS FULL-SCREEN MODAL */}
      {showSOS && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 text-center">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-widest bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                Craving SOS Mode
              </span>
              <button
                onClick={() => {
                  setShowSOS(false);
                  setBreathActive(false);
                }}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-tabs */}
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl mb-4 text-xs font-medium">
              <button
                onClick={() => setSosTab('breathe')}
                className={`py-1.5 rounded-lg transition-all ${sosTab === 'breathe' ? 'bg-white font-bold shadow-xs text-slate-900' : 'text-slate-600'}`}
              >
                Box Breath
              </button>
              <button
                onClick={() => setSosTab('distract')}
                className={`py-1.5 rounded-lg transition-all ${sosTab === 'distract' ? 'bg-white font-bold shadow-xs text-slate-900' : 'text-slate-600'}`}
              >
                Distract
              </button>
              <button
                onClick={() => setSosTab('wave')}
                className={`py-1.5 rounded-lg transition-all ${sosTab === 'wave' ? 'bg-white font-bold shadow-xs text-slate-900' : 'text-slate-600'}`}
              >
                Ride Wave
              </button>
            </div>

            {/* TAB 1: 60-SEC BOX BREATHING */}
            {sosTab === 'breathe' && (
              <div className="py-2">
                <div
                  className={`w-36 h-36 rounded-full border-4 mx-auto flex flex-col items-center justify-center mb-4 transition-all duration-1000 ${
                    breathPhase === 'Inhale'
                      ? 'border-teal-500 bg-teal-50 scale-105'
                      : breathPhase === 'Exhale'
                      ? 'border-sky-500 bg-sky-50 scale-95'
                      : 'border-indigo-400 bg-indigo-50'
                  }`}
                >
                  <span className="text-sm font-bold text-slate-900">{breathPhase}</span>
                  <span className="text-2xl font-mono font-bold text-slate-800 mt-1">{breathTimer}s</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Box breathing directly lowers sympathetic heart rate and neutralizes autonomic craving spikes within 60 seconds.
                </p>
                <button
                  onClick={() => setBreathActive(!breathActive)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
                >
                  {breathActive ? 'Pause Breathing' : 'Resume Breathing'}
                </button>
              </div>
            )}

            {/* TAB 2: DISTRACTION ACTIVITY */}
            {sosTab === 'distract' && (
              <div className="py-2 text-left">
                <p className="text-xs font-semibold text-slate-800 mb-2">
                  1. The 5-Blue-Objects Grounding:
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 mb-4 leading-relaxed">
                  Look around the room right now. Spot and whisper 5 blue items nearby. This shifts focus from the amygdala to the prefrontal cortex.
                </div>

                <p className="text-xs font-semibold text-slate-800 mb-1.5">
                  2. Rapid Focus Tap Tile:
                </p>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        soundService.playTap();
                        setDistractScore((s) => s + 1);
                      }}
                      className="h-10 rounded-xl bg-teal-50 border border-teal-200 hover:bg-teal-200 text-teal-800 font-mono text-sm font-bold transition-all active:scale-95"
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="text-center text-[11px] text-slate-500">
                  Focus taps: <span className="font-bold text-teal-700">{distractScore}</span>
                </div>
              </div>
            )}

            {/* TAB 3: RIDE THE WAVE COUNTDOWN */}
            {sosTab === 'wave' && (
              <div className="py-2">
                <div className="w-32 h-32 rounded-full border-4 border-amber-400 bg-amber-50/60 flex flex-col items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-mono font-bold text-amber-950">
                    {Math.floor(waveSeconds / 60)}:{(waveSeconds % 60).toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-amber-700 uppercase tracking-wider mt-0.5">Wave Peak</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Cravings are neurochemical waves: they peak at 3 minutes and naturally dissolve. You do not need to fight it—just ride it.
                </p>
                <button
                  onClick={() => setWaveRunning(!waveRunning)}
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold"
                >
                  {waveRunning ? 'Pause Wave' : 'Start 3-Min Wave Timer'}
                </button>
              </div>
            )}

            {/* Helpline links */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Need human support? Call </span>
              <a href="tel:18007848669" className="text-teal-700 font-bold underline">
                1-800-QUIT-NOW
              </a>
            </div>
          </div>
        </div>
      )}

      {/* LOG CRAVING TRIGGER MODAL */}
      {showTriggerLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Log Craving Trigger</h3>
              <button onClick={() => setShowTriggerLog(false)} className="text-slate-400">✕</button>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Understanding patterns removes their subconscious power.
            </p>
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">What triggered this?</label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {(['coffee', 'stress', 'social', 'boredom', 'after_meal', 'other'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTrigger(t)}
                      className={`p-2 rounded-xl border capitalize ${selectedTrigger === t ? 'bg-orange-50 border-orange-400 text-orange-950 font-bold' : 'border-slate-200'}`}
                    >
                      {t.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Intensity: {triggerIntensity}/5</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={triggerIntensity}
                  onChange={(e) => setTriggerIntensity(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            <button
              onClick={handleLogCraving}
              className="w-full h-10 rounded-xl bg-slate-900 text-white text-xs font-semibold"
            >
              Save Trigger
            </button>
          </div>
        </div>
      )}

      {/* REPORT A SLIP MODAL */}
      {showSlipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 text-center">
            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center mx-auto mb-3">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Be Kind to Yourself
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              A slip is data, not defeat. The 168+ smoke-free hours you previously built repaired cellular tissue that remains healed. Tomorrow is another step forward.
            </p>
            <button
              onClick={handleReportSlip}
              className="w-full h-10 rounded-xl bg-teal-600 text-white text-xs font-semibold mb-2"
            >
              Acknowledge & Continue Onward
            </button>
            <button
              onClick={() => setShowSlipModal(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
