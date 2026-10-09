import React, { useState, useEffect } from 'react';
import { Heart, CheckCircle2, Play, Pause, RotateCcw, AlertTriangle, Info, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { BPReading } from '../../types/health';
import { soundService } from '../../services/sound';

interface GuidedHomeBPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveReading: (reading: Omit<BPReading, 'id' | 'date'>) => void;
}

export const GuidedHomeBPModal: React.FC<GuidedHomeBPModalProps> = ({
  isOpen,
  onClose,
  onSaveReading,
}) => {
  const [step, setStep] = useState<'prep' | 'rest' | 'measure' | 'result'>('prep');

  // Checklist for Step 1
  const [checklist, setChecklist] = useState({
    feetFlat: false,
    backSupported: false,
    armHeartLevel: false,
    quietRest: false,
  });

  // 5-minute timer state (in seconds, default 300)
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);

  // 3 readings
  const [readings, setReadings] = useState([
    { sys: '122', dia: '79', pulse: '67' },
    { sys: '120', dia: '78', pulse: '65' },
    { sys: '119', dia: '77', pulse: '65' },
  ]);
  const [arm, setArm] = useState<'left' | 'right'>('left');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Result state
  const [computedResult, setComputedResult] = useState<{
    avgSys: number;
    avgDia: number;
    avgPulse: number;
    category: BPReading['category'];
  } | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            soundService.playWin();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, secondsLeft]);

  if (!isOpen) return null;

  const toggleCheck = (key: keyof typeof checklist) => {
    soundService.playTap();
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allPrepChecked = Object.values(checklist).every(Boolean);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const getAHACategory = (sys: number, dia: number): BPReading['category'] => {
    if (sys > 180 || dia > 120) return 'Hypertensive Crisis';
    if (sys >= 140 || dia >= 90) return 'Stage 2';
    if (sys >= 130 || dia >= 80) return 'Stage 1';
    if (sys >= 120 && dia < 80) return 'Elevated';
    return 'Normal';
  };

  const handleComputeAverage = () => {
    setValidationError(null);
    const parsed = readings.map((r) => ({
      sys: parseInt(r.sys, 10),
      dia: parseInt(r.dia, 10),
      pulse: parseInt(r.pulse || '70', 10),
    }));

    for (let i = 0; i < parsed.length; i++) {
      const r = parsed[i];
      if (isNaN(r.sys) || isNaN(r.dia)) {
        setValidationError(`Please complete reading #${i + 1}`);
        return;
      }
      if (r.dia >= r.sys) {
        setValidationError(`Reading #${i + 1}: Diastolic (${r.dia}) must be lower than Systolic (${r.sys}).`);
        return;
      }
      if (r.sys < 70 || r.sys > 250 || r.dia < 40 || r.dia > 150) {
        setValidationError(`Reading #${i + 1}: Out of realistic physiological range. Please check numbers.`);
        return;
      }
    }

    const avgSys = Math.round(parsed.reduce((a, b) => a + b.sys, 0) / parsed.length);
    const avgDia = Math.round(parsed.reduce((a, b) => a + b.dia, 0) / parsed.length);
    const avgPulse = Math.round(parsed.reduce((a, b) => a + b.pulse, 0) / parsed.length);
    const category = getAHACategory(avgSys, avgDia);

    soundService.playWin();
    setComputedResult({ avgSys, avgDia, avgPulse, category });
    setStep('result');
  };

  const handleFinalSave = () => {
    if (!computedResult) return;
    onSaveReading({
      systolic: computedResult.avgSys,
      diastolic: computedResult.avgDia,
      pulse: computedResult.avgPulse,
      arm,
      readingsCount: 3,
      category: computedResult.category,
      individualReadings: readings.map((r) => ({
        systolic: parseInt(r.sys, 10),
        diastolic: parseInt(r.dia, 10),
        pulse: parseInt(r.pulse, 10),
      })),
      notes: 'Logged via 5-min guided seated protocol.',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wide">
                AHA Protocol
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Guided Home BP Check
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

        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-5 px-1">
          <span className={step === 'prep' ? 'font-bold text-teal-800' : ''}>1. Posture</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className={step === 'rest' ? 'font-bold text-teal-800' : ''}>2. 5-Min Rest</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className={step === 'measure' ? 'font-bold text-teal-800' : ''}>3. Readings</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className={step === 'result' ? 'font-bold text-teal-800' : ''}>4. Average</span>
        </div>

        {/* STEP 1: PREPARATION & POSTURE */}
        {step === 'prep' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Proper posture eliminates up to 10 mmHg of artificial elevation. Please confirm:
            </p>

            <div className="space-y-2.5">
              {[
                { key: 'feetFlat' as const, label: 'Both feet flat on the floor (legs uncrossed)' },
                { key: 'backSupported' as const, label: 'Back supported by chair' },
                { key: 'armHeartLevel' as const, label: 'Cuff arm resting on table at heart level' },
                { key: 'quietRest' as const, label: 'No caffeine, exercise, or smoking in last 30 mins' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => toggleCheck(item.key)}
                  className={`w-full p-3 rounded-2xl border text-left text-xs flex items-center justify-between transition-all ${
                    checklist[item.key]
                      ? 'bg-teal-50/70 border-teal-300 text-teal-950 font-medium'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span>{item.label}</span>
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ml-2 ${
                      checklist[item.key]
                        ? 'bg-teal-600 text-white'
                        : 'border-2 border-slate-300'
                    }`}
                  >
                    {checklist[item.key] && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                soundService.playTap();
                setStep('rest');
                setTimerRunning(true);
              }}
              className="w-full h-11 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Continue to 5-Minute Rest</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: 5-MINUTE REST COUNTDOWN */}
        {step === 'rest' && (
          <div className="text-center py-4">
            <div className="w-32 h-32 rounded-full border-4 border-teal-500/30 flex flex-col items-center justify-center mx-auto mb-4 bg-teal-50/40 relative">
              <span className="text-2xl font-mono font-bold text-slate-900 tracking-wider">
                {formatTimer(secondsLeft)}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                Quiet Rest
              </span>
            </div>

            <p className="text-xs text-slate-600 max-w-xs mx-auto mb-6 leading-relaxed">
              Remain still and breathe naturally without speaking. This stabilizes vascular tone.
            </p>

            <div className="flex items-center justify-center gap-2 mb-4">
              <button
                onClick={() => {
                  soundService.playTap();
                  setTimerRunning(!timerRunning);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
              >
                {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{timerRunning ? 'Pause' : 'Resume'}</span>
              </button>

              <button
                onClick={() => {
                  soundService.playTap();
                  setSecondsLeft(0);
                  setTimerRunning(false);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-600"
              >
                Skip timer (Demo)
              </button>
            </div>

            <button
              onClick={() => {
                soundService.playTap();
                setStep('measure');
              }}
              className="w-full h-11 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Proceed to Take 3 Readings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 3: ENTER 3 READINGS */}
        {step === 'measure' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Enter 3 measurements spaced ~1 min apart:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px]">
                <button
                  type="button"
                  onClick={() => setArm('left')}
                  className={`px-2 py-0.5 rounded ${arm === 'left' ? 'bg-white font-bold shadow-xs' : ''}`}
                >
                  Left Arm
                </button>
                <button
                  type="button"
                  onClick={() => setArm('right')}
                  className={`px-2 py-0.5 rounded ${arm === 'right' ? 'bg-white font-bold shadow-xs' : ''}`}
                >
                  Right Arm
                </button>
              </div>
            </div>

            {validationError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{validationError}</span>
              </div>
            )}

            <div className="space-y-2">
              {readings.map((r, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-700 w-20">
                    Reading #{idx + 1}
                  </span>
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <div className="w-20">
                      <input
                        type="number"
                        placeholder="Sys (120)"
                        value={r.sys}
                        onChange={(e) => {
                          const updated = [...readings];
                          updated[idx].sys = e.target.value;
                          setReadings(updated);
                        }}
                        className="w-full h-8 px-2 text-xs font-mono rounded-lg bg-white border border-slate-200 text-center"
                      />
                    </div>
                    <span className="text-slate-400 font-bold">/</span>
                    <div className="w-20">
                      <input
                        type="number"
                        placeholder="Dia (80)"
                        value={r.dia}
                        onChange={(e) => {
                          const updated = [...readings];
                          updated[idx].dia = e.target.value;
                          setReadings(updated);
                        }}
                        className="w-full h-8 px-2 text-xs font-mono rounded-lg bg-white border border-slate-200 text-center"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleComputeAverage}
              className="w-full h-11 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Calculate Verified Average</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 4: VERIFIED AVERAGE & AHA CATEGORY */}
        {step === 'result' && computedResult && (
          <div className="text-center py-2 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block mb-1">
                Verified 3-Reading Average
              </span>
              <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight mb-1">
                {computedResult.avgSys} / {computedResult.avgDia}{' '}
                <span className="text-sm font-normal text-slate-500 font-sans">mmHg</span>
              </div>
              <p className="text-xs text-slate-500">
                Pulse: {computedResult.avgPulse} bpm · {arm === 'left' ? 'Left arm' : 'Right arm'}
              </p>

              {/* AHA Category Badge */}
              <div className="mt-3 pt-3 border-t border-slate-200">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    computedResult.category === 'Normal'
                      ? 'bg-emerald-100 text-emerald-800'
                      : computedResult.category === 'Elevated'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  AHA Category: {computedResult.category}
                </span>
              </div>
            </div>

            {/* Crucial Standard Medical Screening Disclaimer */}
            <div className="flex items-start gap-2 p-3 bg-amber-50/70 rounded-2xl border border-amber-200/80 text-left">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-900 leading-normal">
                <span className="font-semibold">Important screening note: </span>
                This home average is a wellness and habit screening record, not a clinical diagnosis. Always discuss trends with your licensed physician.
              </p>
            </div>

            <button
              onClick={handleFinalSave}
              className="w-full h-11 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save to Blood Pressure History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
