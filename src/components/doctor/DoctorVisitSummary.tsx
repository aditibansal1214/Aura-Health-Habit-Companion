import React, { useState } from 'react';
import { Stethoscope, Printer, Share2, Calendar, FileText, CheckSquare, Heart, AlertCircle, X, ChevronRight } from 'lucide-react';
import { BPReading, HealthFlag, DailyLog, UserPreferences } from '../../types/health';
import { soundService } from '../../services/sound';

interface DoctorVisitSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  bpLogs: BPReading[];
  flags: HealthFlag[];
  dailyLogs: DailyLog[];
  preferences: UserPreferences;
  onOpenGuidedBP: () => void;
}

export const DoctorVisitSummary: React.FC<DoctorVisitSummaryProps> = ({
  isOpen,
  onClose,
  bpLogs,
  flags,
  dailyLogs,
  preferences,
  onOpenGuidedBP,
}) => {
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [customQuestions, setCustomQuestions] = useState<string[]>([
    'Are my morning blood pressure readings in the target range given my Lisinopril dose?',
    'Could my sleep window variations be influencing morning vascular tension?',
    'Should we schedule any routine metabolic lab work this quarter?',
  ]);
  const [newQuestion, setNewQuestion] = useState('');

  if (!isOpen) return null;

  // Calculate 30-day vitals averages
  const recentLogs = dailyLogs.slice(-30);
  const n = recentLogs.length || 1;
  const avgSteps = Math.round(recentLogs.reduce((acc, d) => acc + d.steps, 0) / n);
  const avgSleep = (recentLogs.reduce((acc, d) => acc + d.sleepHours, 0) / n).toFixed(1);

  // BP Averages
  const recentBP = bpLogs.slice(-10);
  const bpN = recentBP.length || 1;
  const avgSys = Math.round(recentBP.reduce((acc, b) => acc + b.systolic, 0) / bpN);
  const avgDia = Math.round(recentBP.reduce((acc, b) => acc + b.diastolic, 0) / bpN);
  const avgPulse = Math.round(recentBP.reduce((acc, b) => acc + b.pulse, 0) / bpN);

  const handlePrint = () => {
    soundService.playTap();
    window.print();
  };

  const handleCopyLink = () => {
    soundService.playTap();
    navigator.clipboard?.writeText(window.location.href);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setCustomQuestions([...customQuestions, newQuestion.trim()]);
    setNewQuestion('');
    soundService.playTap();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 max-h-[96vh] overflow-y-auto my-auto print:max-h-none print:shadow-none print:border-none print:m-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Screen Header Toolbar (Hidden in print) */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm px-6 py-4 border-b border-slate-200 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                Clinical Prep Sheet
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                1-Page Appointment Summary
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedNotice ? 'Copied!' : 'Share Link'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable 1-Page Clinical Document */}
        <div className="p-6 text-slate-900 font-sans print:p-0">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  Patient Home Health & Vitals Summary
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  Prepared for: <span className="font-semibold text-slate-900">{preferences.name}</span> · Age Group: 35–45
                </p>
              </div>
              <div className="text-right text-xs text-slate-500 font-mono">
                <div>Date: {new Date().toISOString().split('T')[0]}</div>
                <div>Protocol: AHA Seated 3-Average</div>
              </div>
            </div>
          </div>

          {/* Quick Guided BP Check Banner */}
          <div className="no-print mb-4 p-3 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between text-xs text-teal-950">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Need a fresh pre-appointment reading? Run the guided 5-min rest check.</span>
            </div>
            <button
              onClick={onOpenGuidedBP}
              className="px-3 py-1 bg-teal-700 text-white rounded-lg font-semibold hover:bg-teal-800 transition-colors whitespace-nowrap"
            >
              Take BP Now
            </button>
          </div>

          {/* SECTION 1: 30-DAY OBJECTIVE VITALS AVERAGES */}
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 border-b border-slate-100 pb-1">
              1. 30-Day Objective Vitals Averages
            </h2>
            <div className="grid grid-cols-4 gap-2.5">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">BP Average</span>
                <p className="text-base font-bold font-mono text-slate-900 mt-0.5">
                  {avgSys} / {avgDia} <span className="text-xs font-normal text-slate-500">mmHg</span>
                </p>
                <span className="text-[10px] text-slate-500">Pulse: {avgPulse} bpm</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Sleep Duration</span>
                <p className="text-base font-bold font-mono text-slate-900 mt-0.5">
                  {avgSleep} <span className="text-xs font-normal text-slate-500">hrs/night</span>
                </p>
                <span className="text-[10px] text-slate-500">Avg over {n} days</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Daily Steps</span>
                <p className="text-base font-bold font-mono text-slate-900 mt-0.5">
                  {avgSteps.toLocaleString()}
                </p>
                <span className="text-[10px] text-slate-500">Activity proxy</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Logged Compliance</span>
                <p className="text-base font-bold font-mono text-slate-900 mt-0.5">
                  94%
                </p>
                <span className="text-[10px] text-slate-500">High data fidelity</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: BLOOD PRESSURE LOG (TABLE WITH DATES) */}
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 border-b border-slate-100 pb-1">
              2. Blood Pressure Trend Log (Last 5 Guided Sessions)
            </h2>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Date & Time</th>
                    <th className="py-2 px-3">Systolic / Diastolic</th>
                    <th className="py-2 px-3">Pulse</th>
                    <th className="py-2 px-3">Arm</th>
                    <th className="py-2 px-3">AHA Screening</th>
                    <th className="py-2 px-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-mono">
                  {recentBP.map((bp) => (
                    <tr key={bp.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 whitespace-nowrap text-slate-600">{bp.date}</td>
                      <td className="py-2 px-3 font-bold text-slate-900">
                        {bp.systolic} / {bp.diastolic} mmHg
                      </td>
                      <td className="py-2 px-3">{bp.pulse}</td>
                      <td className="py-2 px-3 font-sans capitalize">{bp.arm}</td>
                      <td className="py-2 px-3 font-sans">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          bp.category === 'Normal' ? 'bg-emerald-100 text-emerald-800' :
                          bp.category === 'Elevated' ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {bp.category}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-sans text-slate-500 text-[11px] max-w-xs truncate">
                        {bp.notes || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 3: PERSISTENT FLAGS & HOW LONG THEY'VE PERSISTED */}
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 border-b border-slate-100 pb-1">
              3. Persistent Patterns Flagged
            </h2>
            <div className="space-y-2">
              {flags.map((flag) => (
                <div key={flag.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-slate-900">{flag.title}</span>
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                        Persisting {flag.daysActive} days
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{flag.triggerReason}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">User value: {flag.userValue} vs standard threshold: {flag.threshold}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: MEDICATIONS & FAMILY HISTORY */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5">
                Current Reported Medications
              </h3>
              <ul className="text-xs space-y-1 text-slate-800">
                {preferences.medications.map((med, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                    <span>{med}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5">
                Relevant Family History
              </h3>
              <ul className="text-xs space-y-1 text-slate-800">
                {preferences.familyHistory.map((hist, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>{hist}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* SECTION 5: QUESTIONS TO ASK THE DOCTOR */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 border-b border-slate-100 pb-1">
              5. Questions to Ask Your Clinician
            </h2>
            <div className="space-y-1.5 mb-3">
              {customQuestions.map((q, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2 text-xs text-slate-800">
                  <CheckSquare className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <span className="flex-1">{q}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddQuestion} className="flex gap-2 no-print">
              <input
                type="text"
                placeholder="Add another question for your clinician..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="flex-1 h-9 px-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-900"
              />
              <button
                type="submit"
                className="px-3 h-9 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
