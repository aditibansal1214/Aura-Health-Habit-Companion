import React, { useState } from 'react';
import { User, Sparkles, Plus, X, Heart, Shield, Check, RotateCcw, AlertCircle, Pill, Activity, Compass, Database } from 'lucide-react';
import { UserPreferences, QuitSmokingState, DailyLog } from '../../types/health';
import { testPersonas, TestPersona, initialDailyLogs, initialMoodEnergyLogs, initialBPLogs } from '../../services/mockData';
import { soundService } from '../../services/sound';

interface CustomProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSavePreferences: (updated: UserPreferences) => void;
  quitSmoking: QuitSmokingState;
  onUpdateQuitSmoking: (updated: QuitSmokingState) => void;
  onSeedData: (type: 'rich16days' | 'cleanToday') => void;
}

export const CustomProfileModal: React.FC<CustomProfileModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences,
  quitSmoking,
  onUpdateQuitSmoking,
  onSeedData,
}) => {
  // Local form state
  const [name, setName] = useState(preferences.name);
  const [age, setAge] = useState(preferences.age || 38);
  const [bioNotes, setBioNotes] = useState(preferences.bioNotes || '');
  const [targetSteps, setTargetSteps] = useState(preferences.targetSteps || 7000);
  const [targetSleep, setTargetSleep] = useState(preferences.targetSleep || 7.5);
  const [targetWater, setTargetWater] = useState(preferences.targetWater || 8);
  const [medications, setMedications] = useState<string[]>([...preferences.medications]);
  const [newMed, setNewMed] = useState('');
  const [familyHistory, setFamilyHistory] = useState<string[]>([...preferences.familyHistory]);
  const [newHist, setNewHist] = useState('');
  const [allergies, setAllergies] = useState<string[]>(preferences.allergies || ['No known drug allergies']);
  const [newAllergy, setNewAllergy] = useState('');

  // Quit smoking settings
  const [smokeFreeEnabled, setSmokeFreeEnabled] = useState(quitSmoking.enabled);
  const [cigsPerDay, setCigsPerDay] = useState(quitSmoking.cigsPerDayPrior);
  const [costPerPack, setCostPerPack] = useState(quitSmoking.costPerPack);

  const [activeTab, setActiveTab] = useState<'details' | 'personas' | 'simulator'>('details');
  const [saveNotice, setSaveNotice] = useState(false);

  if (!isOpen) return null;

  // Add tag handlers
  const handleAddMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.trim()) return;
    setMedications([...medications, newMed.trim()]);
    setNewMed('');
    soundService.playTap();
  };

  const handleRemoveMed = (index: number) => {
    soundService.playTap();
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleAddHist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHist.trim()) return;
    setFamilyHistory([...familyHistory, newHist.trim()]);
    setNewHist('');
    soundService.playTap();
  };

  const handleRemoveHist = (index: number) => {
    soundService.playTap();
    setFamilyHistory(familyHistory.filter((_, i) => i !== index));
  };

  const handleAddAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllergy.trim()) return;
    setAllergies([...allergies, newAllergy.trim()]);
    setNewAllergy('');
    soundService.playTap();
  };

  const handleRemoveAllergy = (index: number) => {
    soundService.playTap();
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  // Persona load handler
  const handleApplyPersona = (persona: TestPersona) => {
    soundService.playWin();
    setName(persona.preferences.name);
    setAge(persona.preferences.age);
    setBioNotes(persona.preferences.bioNotes || '');
    setTargetSteps(persona.preferences.targetSteps || 7000);
    setTargetSleep(persona.preferences.targetSleep || 7.5);
    setTargetWater(persona.preferences.targetWater || 8);
    setMedications([...persona.preferences.medications]);
    setFamilyHistory([...persona.preferences.familyHistory]);
    setAllergies([...(persona.preferences.allergies || ['No known allergies'])]);
    setSmokeFreeEnabled(persona.quitSmokingEnabled);

    onSavePreferences({
      ...preferences,
      ...persona.preferences,
    });
    onUpdateQuitSmoking({
      ...quitSmoking,
      enabled: persona.quitSmokingEnabled,
    });

    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 2000);
  };

  // Submit profile changes
  const handleSaveAll = () => {
    soundService.playWin();
    const updated: UserPreferences = {
      ...preferences,
      name: name.trim() || 'Alex',
      age: Number(age) || 35,
      bioNotes,
      targetSteps: Number(targetSteps),
      targetSleep: Number(targetSleep),
      targetWater: Number(targetWater),
      medications,
      familyHistory,
      allergies,
    };
    onSavePreferences(updated);

    onUpdateQuitSmoking({
      ...quitSmoking,
      enabled: smokeFreeEnabled,
      cigsPerDayPrior: Number(cigsPerDay),
      costPerPack: Number(costPerPack),
    });

    setSaveNotice(true);
    setTimeout(() => {
      setSaveNotice(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                Profile & Health Context
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Customise Your Health Profile
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          Enter your real personal vitals, goals, medications, and medical history. All changes immediately sync with your Doctor-Visit prep sheet, baseline targets, and rules engine.
        </p>

        {/* Sub-tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl mb-4 text-xs font-semibold">
          <button
            onClick={() => {
              soundService.playTap();
              setActiveTab('details');
            }}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'details' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            My Details
          </button>
          <button
            onClick={() => {
              soundService.playTap();
              setActiveTab('personas');
            }}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'personas' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Test Personas
          </button>
          <button
            onClick={() => {
              soundService.playTap();
              setActiveTab('simulator');
            }}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'simulator' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Data Tools
          </button>
        </div>

        {/* TAB 1: CUSTOM PROFILE DETAILS */}
        {activeTab === 'details' && (
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                1. Personal Information
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Your Name / Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aditi, Jordan, Dr. Alex"
                    className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min="16"
                    max="110"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 font-mono text-center focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Personal Health Intent / Bio Note
                </label>
                <input
                  type="text"
                  value={bioNotes}
                  onChange={(e) => setBioNotes(e.target.value)}
                  placeholder="e.g. Monitoring morning BP and getting restorative 8 hours sleep"
                  className="w-full h-9 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Custom Daily Baseline Goals */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                2. Custom Daily Targets (Beat Your Average)
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-600 block mb-1">Step Goal</label>
                  <input
                    type="number"
                    step="500"
                    value={targetSteps}
                    onChange={(e) => setTargetSteps(Number(e.target.value))}
                    className="w-full h-8 px-2 rounded-lg bg-white border border-slate-200 text-xs font-mono text-center text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-600 block mb-1">Sleep Goal (hrs)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={targetSleep}
                    onChange={(e) => setTargetSleep(Number(e.target.value))}
                    className="w-full h-8 px-2 rounded-lg bg-white border border-slate-200 text-xs font-mono text-center text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-600 block mb-1">Water (Glasses)</label>
                  <input
                    type="number"
                    min="2"
                    max="15"
                    value={targetWater}
                    onChange={(e) => setTargetWater(Number(e.target.value))}
                    className="w-full h-8 px-2 rounded-lg bg-white border border-slate-200 text-xs font-mono text-center text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Clinical Details: Medications */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  3. Current Medications (Feeds Doctor Prep)
                </span>
                <span className="text-[10px] text-slate-400">{medications.length} listed</span>
              </div>

              {/* Tag pill list */}
              <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                {medications.map((med, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 text-xs font-medium"
                  >
                    <span>{med}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMed(idx)}
                      className="text-teal-600 hover:text-teal-900 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <form onSubmit={handleAddMed} className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="e.g. Lisinopril 10mg morning, Vitamin D 2000IU"
                  value={newMed}
                  onChange={(e) => setNewMed(e.target.value)}
                  className="flex-1 h-8 px-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900"
                />
                <button
                  type="submit"
                  className="px-3 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Clinical Details: Family History & Allergies */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  4. Relevant Family History
                </span>
                <span className="text-[10px] text-slate-400">{familyHistory.length} listed</span>
              </div>

              <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                {familyHistory.map((hist, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 text-xs font-medium"
                  >
                    <span>{hist}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHist(idx)}
                      className="text-amber-700 hover:text-amber-950 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <form onSubmit={handleAddHist} className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="e.g. Maternal hypertension, Early cardiovascular disease"
                  value={newHist}
                  onChange={(e) => setNewHist(e.target.value)}
                  className="flex-1 h-8 px-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900"
                />
                <button
                  type="submit"
                  className="px-3 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Allergies */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  5. Known Allergies
                </span>
                <span className="text-[10px] text-slate-400">{allergies.length} listed</span>
              </div>

              <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                {allergies.map((all, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium"
                  >
                    <span>{all}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAllergy(idx)}
                      className="text-rose-600 hover:text-rose-900 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <form onSubmit={handleAddAllergy} className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Sulfa, Tree nuts, None"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  className="flex-1 h-8 px-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900"
                />
                <button
                  type="submit"
                  className="px-3 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Quit-Smoking Settings */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    6. Smoke-Free Companion
                  </span>
                  <p className="text-xs font-semibold text-slate-900">
                    Track smoke-free time and Craving SOS
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundService.playTap();
                    setSmokeFreeEnabled(!smokeFreeEnabled);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                    smokeFreeEnabled ? 'bg-teal-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      smokeFreeEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {smokeFreeEnabled && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                  <div>
                    <label className="text-[10px] text-slate-600 block mb-1">Cigs/Day Prior</label>
                    <input
                      type="number"
                      value={cigsPerDay}
                      onChange={(e) => setCigsPerDay(Number(e.target.value))}
                      className="w-full h-8 px-2 rounded-lg bg-white border border-slate-200 text-xs font-mono text-center text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-600 block mb-1">Price per Pack ($)</label>
                    <input
                      type="number"
                      value={costPerPack}
                      onChange={(e) => setCostPerPack(Number(e.target.value))}
                      className="w-full h-8 px-2 rounded-lg bg-white border border-slate-200 text-xs font-mono text-center text-slate-900"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: TEST PERSONAS QUICK-SWITCHER */}
        {activeTab === 'personas' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed mb-1">
              Select any pre-configured clinical or lifestyle profile with 1 tap to test how the app adapts:
            </p>

            {testPersonas.map((persona) => {
              const isSelected = name === persona.preferences.name;
              return (
                <div
                  key={persona.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-teal-50/70 border-teal-300 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{persona.label}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{persona.description}</p>
                    </div>
                    <button
                      onClick={() => handleApplyPersona(persona)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-teal-700 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {isSelected ? 'Active' : 'Apply Persona'}
                    </button>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200/70 text-[10px] text-slate-600 space-y-0.5">
                    <div>
                      <span className="font-semibold text-slate-700">Meds: </span>
                      <span>{persona.preferences.medications.join(', ')}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Family History: </span>
                      <span>{persona.preferences.familyHistory.join(', ')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: DATA TESTING SIMULATOR TOOLS */}
        {activeTab === 'simulator' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              Instantly seed or reset tracking history to test all algorithmic features:
            </p>

            {/* Seed 16-day history */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-teal-600" />
                  <span>Seed 16-Day Historical Logs</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Immediately unlocks the 14-point Personal Correlation Engine, Beat-Your-Average baselines, and Sunday Wrapped Recap!
                </p>
              </div>
              <button
                onClick={() => {
                  soundService.playWin();
                  onSeedData('rich16days');
                  setSaveNotice(true);
                  setTimeout(() => setSaveNotice(false), 2000);
                }}
                className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold whitespace-nowrap"
              >
                Seed 16 Days
              </button>
            </div>

            {/* Clean start / Day 1 mode */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Start From Day 1 (Empty Logs)</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Clears historical data so you can test entering your own real check-ins, water, and BP from a clean slate.
                </p>
              </div>
              <button
                onClick={() => {
                  soundService.playTap();
                  onSeedData('cleanToday');
                  setSaveNotice(true);
                  setTimeout(() => setSaveNotice(false), 2000);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold whitespace-nowrap"
              >
                Clear to Day 1
              </button>
            </div>
          </div>
        )}

        {/* Footer Action */}
        <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
          {saveNotice ? (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Profile updated successfully!</span>
            </span>
          ) : (
            <span className="text-[11px] text-slate-500">
              Synced with Doctor-Visit Prep & Local Storage
            </span>
          )}

          <button
            onClick={handleSaveAll}
            className="px-5 h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Check className="w-4 h-4 text-emerald-300" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
