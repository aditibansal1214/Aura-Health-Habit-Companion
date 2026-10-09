import React, { useState, useEffect } from 'react';
import { DeviceFrame } from './components/layout/DeviceFrame';
import { BottomNav, NavTab } from './components/layout/BottomNav';
import { OneThingCard } from './components/home/OneThingCard';
import { MoodEnergyCheckin } from './components/home/MoodEnergyCheckin';
import { StreaksAndBaselines } from './components/home/StreaksAndBaselines';
import { HabitStackingBuilder } from './components/habits/HabitStackingBuilder';
import { SmartQuietNudgesModal } from './components/habits/SmartQuietNudgesModal';
import { QuitSmokingCompanion } from './components/habits/QuitSmokingCompanion';
import { AdaptiveProgramsModal } from './components/habits/AdaptiveProgramsModal';
import { GuidedHomeBPModal } from './components/vitals/GuidedHomeBPModal';
import { FlagExplainerSheet } from './components/vitals/FlagExplainerSheet';
import { DoctorVisitSummary } from './components/doctor/DoctorVisitSummary';
import { WeeklyHealthStory } from './components/story/WeeklyHealthStory';
import { ProgressJourneyView } from './components/story/ProgressJourneyView';
import { SmartQuickLogSheet } from './components/quicklog/SmartQuickLogSheet';
import { AccountabilityCircleSheet } from './components/circle/AccountabilityCircleSheet';
import { PrivacyDashboardSheet } from './components/privacy/PrivacyDashboardSheet';
import { FeatureFlagsSheet } from './components/settings/FeatureFlagsSheet';
import { CustomProfileModal } from './components/profile/CustomProfileModal';
import { SafetyNetBanner } from './components/common/SafetyNetBanner';
import { DelightMascot } from './components/common/DelightMascot';
import { translations } from './services/translations';
import { soundService } from './services/sound';
import {
  initialDailyLogs,
  initialMoodEnergyLogs,
  initialBPLogs,
  testPersonas,
} from './services/mockData';
import {
  StorageService,
  OneThingState,
  StreakState,
} from './services/storage';
import {
  DailyLog,
  MoodEnergyEntry,
  BPReading,
  HabitStack,
  HealthFlag,
  AdaptiveProgram,
  QuitSmokingState,
  AccountabilityPartner,
  FeatureFlags,
  UserPreferences,
  NudgeConfig,
} from './types/health';
import {
  Heart,
  Calendar,
  AlertCircle,
  FileText,
  Sliders,
  Sparkles,
  Users,
  Shield,
  Bell,
  ArrowRight,
  Info,
  CheckCircle,
  Clock,
  User as UserIcon,
  Settings,
  Pencil,
} from 'lucide-react';

export default function App() {
  // Navigation & Modal State
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [isBPModalOpen, setIsBPModalOpen] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isProgramsModalOpen, setIsProgramsModalOpen] = useState(false);
  const [isNudgesModalOpen, setIsNudgesModalOpen] = useState(false);
  const [isCircleModalOpen, setIsCircleModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isFeatureFlagsOpen, setIsFeatureFlagsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState<HealthFlag | null>(null);

  // Persistent Domain State
  const [preferences, setPreferences] = useState<UserPreferences>(() => StorageService.getPreferences());
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>(() => StorageService.getFeatureFlags());
  const [nudgeConfig, setNudgeConfig] = useState<NudgeConfig>(() => StorageService.getNudgeConfig());
  const [moodLogs, setMoodLogs] = useState<MoodEnergyEntry[]>(() => StorageService.getMoodLogs());
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(() => StorageService.getDailyLogs());
  const [bpLogs, setBPLogs] = useState<BPReading[]>(() => StorageService.getBPLogs());
  const [habitStacks, setHabitStacks] = useState<HabitStack[]>(() => StorageService.getHabitStacks());
  const [healthFlags, setHealthFlags] = useState<HealthFlag[]>(() => StorageService.getHealthFlags());
  const [programs, setPrograms] = useState<AdaptiveProgram[]>(() => StorageService.getPrograms());
  const [quitSmoking, setQuitSmoking] = useState<QuitSmokingState>(() => StorageService.getQuitSmoking());
  const [partners, setPartners] = useState<AccountabilityPartner[]>(() => StorageService.getPartners());
  const [streakState, setStreakState] = useState<StreakState>(() => StorageService.getStreakState());
  const [oneThing, setOneThing] = useState<OneThingState>(() => StorageService.getOneThingState());

  const t = translations[preferences.language] || translations.en;

  // Sync sounds state with preference
  useEffect(() => {
    soundService.setEnabled(preferences.soundEnabled);
  }, [preferences.soundEnabled]);

  // Handlers for One Thing Today
  const handleToggleOneThing = () => {
    const updated = {
      ...oneThing,
      completedToday: !oneThing.completedToday,
      completedAt: !oneThing.completedToday ? new Date().toISOString() : undefined,
    };
    setOneThing(updated);
    StorageService.setOneThingState(updated);

    // If marked done, update streak
    if (updated.completedToday) {
      const newStreak = {
        ...streakState,
        currentStreak: streakState.currentStreak + 1,
        lastCompletedDate: new Date().toISOString().split('T')[0],
      };
      setStreakState(newStreak);
      StorageService.setStreakState(newStreak);
    }
  };

  const handleSwapTwoMinute = () => {
    const updated = {
      ...oneThing,
      isTwoMinuteMode: !oneThing.isTwoMinuteMode,
      swappedAt: new Date().toISOString(),
    };
    setOneThing(updated);
    StorageService.setOneThingState(updated);
  };

  // Handlers for Check-Ins
  const handleSaveCheckin = (entry: Omit<MoodEnergyEntry, 'id' | 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry: MoodEnergyEntry = {
      id: `me-${Date.now()}`,
      date: today,
      ...entry,
    };
    const updated = [newEntry, ...moodLogs];
    setMoodLogs(updated);
    StorageService.setMoodLogs(updated);
  };

  // Handlers for Streaks
  const handleRepairStreak = () => {
    const updated: StreakState = {
      ...streakState,
      currentStreak: streakState.currentStreak + 1,
      canRepair48h: false,
      repairMissedDate: null,
    };
    setStreakState(updated);
    StorageService.setStreakState(updated);
  };

  const handleUseLifePass = () => {
    if (streakState.lifePassesLeftThisWeek > 0) {
      const updated: StreakState = {
        ...streakState,
        lifePassesLeftThisWeek: streakState.lifePassesLeftThisWeek - 1,
      };
      setStreakState(updated);
      StorageService.setStreakState(updated);
    }
  };

  // Handlers for Habits
  const handleToggleHabitComplete = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = habitStacks.map((h) => {
      if (h.id === id) {
        const completed = !h.completedToday;
        return {
          ...h,
          completedToday: completed,
          history: completed ? [...h.history, today] : h.history.filter((d) => d !== today),
        };
      }
      return h;
    });
    setHabitStacks(updated);
    StorageService.setHabitStacks(updated);
  };

  const handleAddHabitStack = (newStack: Omit<HabitStack, 'id' | 'completedToday' | 'history'>) => {
    const created: HabitStack = {
      ...newStack,
      id: `hs-${Date.now()}`,
      completedToday: false,
      history: [],
    };
    const updated = [created, ...habitStacks];
    setHabitStacks(updated);
    StorageService.setHabitStacks(updated);
  };

  // Handlers for Vitals & BP
  const handleSaveBPReading = (reading: Omit<BPReading, 'id' | 'date'>) => {
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const created: BPReading = {
      ...reading,
      id: `bp-${Date.now()}`,
      date: dateStr,
    };
    const updated = [created, ...bpLogs];
    setBPLogs(updated);
    StorageService.setBPLogs(updated);
  };

  const handleDismissFlag = (flagId: string) => {
    const updated = healthFlags.filter((f) => f.id !== flagId);
    setHealthFlags(updated);
    StorageService.setHealthFlags(updated);
  };

  // Handlers for Quick Log
  const handleAddWater = (glasses: number) => {
    const updated = dailyLogs.map((log, idx) => {
      if (idx === dailyLogs.length - 1) {
        return { ...log, waterGlasses: log.waterGlasses + glasses };
      }
      return log;
    });
    setDailyLogs(updated);
    StorageService.setDailyLogs(updated);
  };

  const handleAddSteps = (steps: number) => {
    const updated = dailyLogs.map((log, idx) => {
      if (idx === dailyLogs.length - 1) {
        return { ...log, steps: log.steps + steps };
      }
      return log;
    });
    setDailyLogs(updated);
    StorageService.setDailyLogs(updated);
  };

  const handleAddMeal = (meal: { type: 'light' | 'normal' | 'heavy'; note?: string }) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const updated = dailyLogs.map((log, idx) => {
      if (idx === dailyLogs.length - 1) {
        return {
          ...log,
          meals: [...log.meals, { type: meal.type, time: timeStr, note: meal.note }],
        };
      }
      return log;
    });
    setDailyLogs(updated);
    StorageService.setDailyLogs(updated);
  };

  const handleBatchLogParsed = (data: { sleep?: number; water?: number; steps?: number }) => {
    const updated = dailyLogs.map((log, idx) => {
      if (idx === dailyLogs.length - 1) {
        return {
          ...log,
          sleepHours: data.sleep !== undefined ? data.sleep : log.sleepHours,
          waterGlasses: data.water !== undefined ? log.waterGlasses + data.water : log.waterGlasses,
          steps: data.steps !== undefined ? log.steps + data.steps : log.steps,
        };
      }
      return log;
    });
    setDailyLogs(updated);
    StorageService.setDailyLogs(updated);
  };

  // Handlers for Partners & Cheers
  const handleAddPartner = (p: Omit<AccountabilityPartner, 'id'>) => {
    const created: AccountabilityPartner = {
      ...p,
      id: `ap-${Date.now()}`,
    };
    const updated = [...partners, created];
    setPartners(updated);
    StorageService.setPartners(updated);
  };

  const handleSendCheer = (partnerId: string, cheer: AccountabilityPartner['lastCheer']) => {
    const updated = partners.map((p) => {
      if (p.id === partnerId) {
        return { ...p, lastCheer: cheer };
      }
      return p;
    });
    setPartners(updated);
    StorageService.setPartners(updated);
  };

  // Handlers for Programs
  const handleSelectProgram = (id: AdaptiveProgram['id']) => {
    const updated = programs.map((p) => ({
      ...p,
      active: p.id === id,
    }));
    setPrograms(updated);
    StorageService.setPrograms(updated);
  };

  const handleTriggerSoftening = (id: AdaptiveProgram['id']) => {
    const updated = programs.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          isSoftened: true,
          missedDaysCount: 3,
          currentStep: 'Softened: Relaxed target of 1 glass of water only',
        };
      }
      return p;
    });
    setPrograms(updated);
    StorageService.setPrograms(updated);
  };

  // User Preference Handlers
  const handleUpdatePreferences = (updated: Partial<UserPreferences>) => {
    const newPrefs = { ...preferences, ...updated };
    setPreferences(newPrefs);
    StorageService.setPreferences(newPrefs);
  };

  const handleToggleFeatureFlag = (key: keyof FeatureFlags) => {
    const updated = {
      ...featureFlags,
      [key]: !featureFlags[key],
    };
    setFeatureFlags(updated);
    StorageService.setFeatureFlags(updated);
  };

  const handleResetData = () => {
    setMoodLogs([]);
    setDailyLogs([]);
    setBPLogs([]);
    StorageService.setMoodLogs([]);
    StorageService.setDailyLogs([]);
    StorageService.setBPLogs([]);
  };

  const handleSeedData = (type: 'rich16days' | 'cleanToday') => {
    if (type === 'rich16days') {
      setDailyLogs(initialDailyLogs);
      setMoodLogs(initialMoodEnergyLogs);
      setBPLogs(initialBPLogs);
      StorageService.setDailyLogs(initialDailyLogs);
      StorageService.setMoodLogs(initialMoodEnergyLogs);
      StorageService.setBPLogs(initialBPLogs);
    } else {
      const today = new Date().toISOString().split('T')[0];
      const singleToday: DailyLog[] = [
        {
          date: today,
          steps: 0,
          sleepHours: 0,
          waterGlasses: 0,
          activeMinutes: 0,
          meals: [],
          wearableSource: 'Manual',
        },
      ];
      setDailyLogs(singleToday);
      setMoodLogs([]);
      setBPLogs([]);
      StorageService.setDailyLogs(singleToday);
      StorageService.setMoodLogs([]);
      StorageService.setBPLogs([]);
    }
  };

  // Calculate recent average mood for Gentle Safety Net
  const recentMoodSlice = moodLogs.slice(0, 3);
  const recentAvgMood =
    recentMoodSlice.length > 0
      ? recentMoodSlice.reduce((acc, m) => acc + m.mood, 0) / recentMoodSlice.length
      : 3.5;

  return (
    <DeviceFrame
      frameType={preferences.deviceFrame}
      onChangeFrame={(frame) => handleUpdatePreferences({ deviceFrame: frame })}
      preferences={preferences}
      onUpdatePreferences={handleUpdatePreferences}
      onOpenFeatureFlags={() => setIsFeatureFlagsOpen(true)}
      onOpenProfile={() => setIsProfileModalOpen(true)}
    >
      {/* Top App Header Zone */}
      <div className="flex items-center justify-between pt-2 pb-3 mb-2 border-b border-slate-200/80">
        <div>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
          <button
            onClick={() => {
              soundService.playTap();
              setIsProfileModalOpen(true);
            }}
            className="group flex items-center gap-1.5 text-left"
            title="Customise your profile"
          >
            <h1 className="text-base font-bold text-slate-900 tracking-tight group-hover:text-teal-700 transition-colors">
              {preferences.readingLevel === 'simple' ? 'Hello ' : 'Welcome, '}{preferences.name}
            </h1>
            <span className="text-[10px] text-teal-800 bg-teal-50 group-hover:bg-teal-100 border border-teal-200 px-1.5 py-0.5 rounded-md font-semibold flex items-center gap-0.5">
              <Pencil className="w-2.5 h-2.5" />
              <span>Edit</span>
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {featureFlags.quietNudges && (
            <button
              onClick={() => {
                soundService.playTap();
                setIsNudgesModalOpen(true);
              }}
              title="Smart, Quiet Nudges"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {nudgeConfig.pausedUntilDate && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>
          )}

          {featureFlags.doctorVisitPrep && (
            <button
              onClick={() => {
                soundService.playTap();
                setIsDoctorModalOpen(true);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold border border-teal-200 flex items-center gap-1 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Doctor Prep</span>
            </button>
          )}
        </div>
      </div>

      {/* Feature 19: Gentle Safety Net Banner (if distressed or coaching paused) */}
      {featureFlags.gentleSafetyNet && (
        <SafetyNetBanner
          isCoachingPaused={preferences.pauseCoaching}
          onTogglePauseCoaching={() =>
            handleUpdatePreferences({ pauseCoaching: !preferences.pauseCoaching })
          }
          recentAvgMood={recentAvgMood}
        />
      )}

      {/* TAB 1: HOME MODE ("ONE THING TODAY") */}
      {currentTab === 'home' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Feature 1: One Thing Today Home Card */}
          {featureFlags.oneThingHome && (
            <OneThingCard
              oneThing={oneThing}
              onToggleComplete={handleToggleOneThing}
              onSwapTwoMinute={handleSwapTwoMinute}
              isCoachingPaused={preferences.pauseCoaching}
            />
          )}

          {/* Feature 2: 30-Second Energy & Mood Check-In */}
          {featureFlags.moodEnergyCheckin && (
            <MoodEnergyCheckin
              moodLogs={moodLogs}
              dailyLogs={dailyLogs}
              onSaveCheckin={handleSaveCheckin}
            />
          )}

          {/* Feature 5 & 6: Streaks with Grace and Personal Baseline */}
          {(featureFlags.streaksWithGrace || featureFlags.personalBaseline) && (
            <StreaksAndBaselines
              streakState={streakState}
              dailyLogs={dailyLogs}
              onRepairStreak={handleRepairStreak}
              onUseLifePass={handleUseLifePass}
              peerContextOptIn={preferences.peerContextOptIn}
              onTogglePeerContext={() =>
                handleUpdatePreferences({ peerContextOptIn: !preferences.peerContextOptIn })
              }
            />
          )}

          {/* Feature 7 Trigger: Weekly Health Story */}
          {featureFlags.weeklyHealthStory && (
            <div className="p-4 rounded-3xl bg-gradient-to-r from-teal-900 to-slate-900 text-white shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-300 uppercase tracking-widest block mb-0.5">
                  Sunday Wrapped
                </span>
                <h3 className="text-sm font-bold">Your Weekly Health Story</h3>
                <p className="text-[11px] text-teal-100/80">
                  Swipe through your top wins & best rest night.
                </p>
              </div>
              <button
                onClick={() => {
                  soundService.playTap();
                  setIsStoryModalOpen(true);
                }}
                className="px-3 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
              >
                <span>Open</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VITALS & BP PROTOCOL */}
      {currentTab === 'vitals' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Guided BP Check CTA Card */}
          {featureFlags.guidedBPCheck && (
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Guided Protocol
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      Guided Home BP Check
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] bg-rose-50 text-rose-800 font-bold px-2 py-0.5 rounded-full border border-rose-200">
                  AHA Standard
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Reduces the 8.7% inconsistent-entry problem at the source: 5-minute seated rest, 3 readings, automatic averaging, and validation.
              </p>

              <button
                onClick={() => {
                  soundService.playTap();
                  setIsBPModalOpen(true);
                }}
                className="w-full h-11 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Start Guided BP Check (5-Min Rest)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Feature 13: Active Health Flags & Explainer Drawers */}
          {featureFlags.flagExplainer && healthFlags.length > 0 && (
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Active Health Observations ({healthFlags.length})
                </h3>
                <span className="text-[11px] text-slate-500">Tap for "What Can I Do?"</span>
              </div>

              <div className="space-y-2">
                {healthFlags.map((flag) => (
                  <button
                    key={flag.id}
                    onClick={() => {
                      soundService.playTap();
                      setSelectedFlag(flag);
                    }}
                    className="w-full p-3.5 rounded-2xl bg-amber-50/60 hover:bg-amber-100/60 border border-amber-200/80 text-left transition-all flex items-start justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                        <h4 className="text-xs font-bold text-amber-950">{flag.title}</h4>
                      </div>
                      <p className="text-[11px] text-amber-900">{flag.triggerReason}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-700 shrink-0 mt-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Blood Pressure History Log */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Recent Blood Pressure Readings
              </h3>
              <span className="text-[11px] text-slate-500">{bpLogs.length} verified sessions</span>
            </div>

            <div className="space-y-2">
              {bpLogs.map((bp) => (
                <div
                  key={bp.id}
                  className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {bp.systolic}/{bp.diastolic} mmHg
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          bp.category === 'Normal'
                            ? 'bg-emerald-100 text-emerald-800'
                            : bp.category === 'Elevated'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {bp.category}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                      {bp.date} · Pulse {bp.pulse} bpm · {bp.arm} arm
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">3 averaged</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HABITS & PROGRAMS */}
      {currentTab === 'habits' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Feature 3: Habit Stacking Builder */}
          {featureFlags.habitStacking && (
            <HabitStackingBuilder
              stacks={habitStacks}
              onToggleComplete={handleToggleHabitComplete}
              onAddStack={handleAddHabitStack}
            />
          )}

          {/* Feature 15 Trigger: Adaptive Programs */}
          {featureFlags.adaptivePrograms && (
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Paced Progression
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Adaptive Programs (Reset / Steady / Boost)
                  </h3>
                </div>
                <button
                  onClick={() => {
                    soundService.playTap();
                    setIsProgramsModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                >
                  Manage
                </button>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Active program: <span className="font-bold text-teal-800">Gentle Reset</span>. Automatically softens targets after 3 missed days.
              </p>
              <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-100 text-xs text-teal-950">
                <span className="font-semibold">Current Week Goal: </span>
                <span>Drink 1 glass of water after morning coffee machine.</span>
              </div>
            </div>
          )}

          {/* Feature 10: Quit-Smoking Companion */}
          {featureFlags.quitSmokingCompanion && quitSmoking.enabled && (
            <QuitSmokingCompanion
              state={quitSmoking}
              onUpdateState={(updated) => {
                setQuitSmoking(updated);
                StorageService.setQuitSmoking(updated);
              }}
            />
          )}
        </div>
      )}

      {/* TAB 4: STORY & DOCTOR PREP */}
      {currentTab === 'story' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Doctor-Visit Prep Card */}
          {featureFlags.doctorVisitPrep && (
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Clinician Mode
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      "I Have an Appointment" Prep
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Generates a clean 1-page clinical summary: 30-day averages, BP table, persistent flags, reported medications, and questions to ask.
              </p>

              <button
                onClick={() => {
                  soundService.playTap();
                  setIsDoctorModalOpen(true);
                }}
                className="w-full h-11 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Generate 1-Page Doctor Summary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Feature 17: "Show Me My Progress" Journey View */}
          {featureFlags.progressJourney && (
            <ProgressJourneyView
              dailyLogs={dailyLogs}
              bpLogs={bpLogs}
            />
          )}
        </div>
      )}

      {/* TAB 5: PROFILE & PRIVACY */}
      {currentTab === 'profile' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Rich Profile Card */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <DelightMascot mood="calm" size="sm" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{preferences.name}</h3>
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-semibold">
                      {preferences.age || 38} yrs
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {preferences.readingLevel === 'simple' ? 'Simple Words' : 'Standard'} Mode · {preferences.language.toUpperCase()} · {preferences.seasonalTheme}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  soundService.playTap();
                  setIsProfileModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Customise</span>
              </button>
            </div>

            {/* Health Intent / Bio */}
            {preferences.bioNotes && (
              <p className="text-xs text-slate-700 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                "{preferences.bioNotes}"
              </p>
            )}

            {/* Custom Daily Targets Summary */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Step Goal</span>
                <span className="text-xs font-mono font-bold text-slate-900">{(preferences.targetSteps || 7000).toLocaleString()}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Sleep Goal</span>
                <span className="text-xs font-mono font-bold text-slate-900">{preferences.targetSleep || 7.5}h</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Water Goal</span>
                <span className="text-xs font-mono font-bold text-slate-900">{preferences.targetWater || 8} gls</span>
              </div>
            </div>

            {/* Clinical Context Counts */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-900">{preferences.medications.length}</span>
                <span>Active Meds</span>
                <span className="text-slate-300">·</span>
                <span className="font-semibold text-slate-900">{preferences.familyHistory.length}</span>
                <span>Family History Items</span>
              </div>

              <button
                onClick={() => setIsFeatureFlagsOpen(true)}
                className="text-[11px] text-teal-700 font-semibold hover:underline flex items-center gap-1"
              >
                <Sliders className="w-3 h-3" />
                <span>Feature Flags</span>
              </button>
            </div>

            {/* Quick 1-Tap Persona Switcher */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Quick Test Personas (1-Tap Switch)
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {testPersonas.map((persona) => {
                  const isCur = preferences.name === persona.preferences.name;
                  return (
                    <button
                      key={persona.id}
                      onClick={() => {
                        soundService.playWin();
                        setPreferences({ ...preferences, ...persona.preferences });
                        StorageService.setPreferences({ ...preferences, ...persona.preferences });
                        setQuitSmoking({ ...quitSmoking, enabled: persona.quitSmokingEnabled });
                        StorageService.setQuitSmoking({ ...quitSmoking, enabled: persona.quitSmokingEnabled });
                      }}
                      className={`p-2 rounded-xl text-left border transition-all ${
                        isCur
                          ? 'bg-teal-50 border-teal-300 text-teal-950 font-semibold'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="text-xs block font-bold truncate">{persona.preferences.name}</span>
                      <span className="text-[10px] text-slate-500 block truncate">{persona.preferences.age}y · {persona.preferences.medications[0]?.split(' ')[0] || 'No meds'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Feature 18: Privacy Dashboard Entry */}
          {featureFlags.privacyDashboard && (
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Privacy-First
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      Privacy Dashboard
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => {
                    soundService.playTap();
                    setIsPrivacyModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                >
                  Inspect
                </button>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                "Who can see my data? Only you." 100% on-device storage, zero advertising brokers, 1-tap JSON export and deletion.
              </p>
            </div>
          )}

          {/* Feature 14: Accountability Circle Entry */}
          {featureFlags.accountabilityCircle && (
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Private Social
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      Accountability Circle ({partners.length}/3)
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => {
                    soundService.playTap();
                    setIsCircleModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                >
                  Manage
                </button>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Invite up to 3 trusted contacts. Raw vitals & weight are strictly shielded by default.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Fixed Ergonomic Bottom Tab Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenQuickLog={() => setIsQuickLogOpen(true)}
      />

      {/* MODALS & SHEETS */}

      {/* Feature 12: Smart Quick-Log Everywhere Sheet */}
      {featureFlags.smartQuickLog && (
        <SmartQuickLogSheet
          isOpen={isQuickLogOpen}
          onClose={() => setIsQuickLogOpen(false)}
          onAddWater={handleAddWater}
          onAddSteps={handleAddSteps}
          onAddMeal={handleAddMeal}
          onBatchLogParsed={handleBatchLogParsed}
        />
      )}

      {/* Feature 9: Guided Home BP Check */}
      {featureFlags.guidedBPCheck && (
        <GuidedHomeBPModal
          isOpen={isBPModalOpen}
          onClose={() => setIsBPModalOpen(false)}
          onSaveReading={handleSaveBPReading}
        />
      )}

      {/* Feature 8: Doctor-Visit Prep 1-Page Summary */}
      {featureFlags.doctorVisitPrep && (
        <DoctorVisitSummary
          isOpen={isDoctorModalOpen}
          onClose={() => setIsDoctorModalOpen(false)}
          bpLogs={bpLogs}
          flags={healthFlags}
          dailyLogs={dailyLogs}
          preferences={preferences}
          onOpenGuidedBP={() => {
            setIsDoctorModalOpen(false);
            setIsBPModalOpen(true);
          }}
        />
      )}

      {/* Feature 7: Weekly Health Story */}
      {featureFlags.weeklyHealthStory && (
        <WeeklyHealthStory
          isOpen={isStoryModalOpen}
          onClose={() => setIsStoryModalOpen(false)}
          dailyLogs={dailyLogs}
        />
      )}

      {/* Feature 13: Flag Explainer & "What Can I Do?" Drawer */}
      {featureFlags.flagExplainer && selectedFlag && (
        <FlagExplainerSheet
          flag={selectedFlag}
          onClose={() => setSelectedFlag(null)}
          onDismissOrCorrect={handleDismissFlag}
        />
      )}

      {/* Feature 4: Smart, Quiet Nudges Settings */}
      {featureFlags.quietNudges && (
        <SmartQuietNudgesModal
          isOpen={isNudgesModalOpen}
          onClose={() => setIsNudgesModalOpen(false)}
          config={nudgeConfig}
          onUpdateConfig={(updated) => {
            setNudgeConfig(updated);
            StorageService.setNudgeConfig(updated);
          }}
        />
      )}

      {/* Feature 15: Adaptive Programs Modal */}
      {featureFlags.adaptivePrograms && (
        <AdaptiveProgramsModal
          isOpen={isProgramsModalOpen}
          onClose={() => setIsProgramsModalOpen(false)}
          programs={programs}
          onSelectProgram={handleSelectProgram}
          onTriggerSoftening={handleTriggerSoftening}
        />
      )}

      {/* Feature 14: Accountability Circle Sheet */}
      {featureFlags.accountabilityCircle && (
        <AccountabilityCircleSheet
          isOpen={isCircleModalOpen}
          onClose={() => setIsCircleModalOpen(false)}
          partners={partners}
          onAddPartner={handleAddPartner}
          onSendCheer={handleSendCheer}
        />
      )}

      {/* Feature 18: Privacy Dashboard Sheet */}
      {featureFlags.privacyDashboard && (
        <PrivacyDashboardSheet
          isOpen={isPrivacyModalOpen}
          onClose={() => setIsPrivacyModalOpen(false)}
          researchContribution={preferences.researchContribution}
          onToggleResearch={() =>
            handleUpdatePreferences({ researchContribution: !preferences.researchContribution })
          }
          onResetData={handleResetData}
        />
      )}

      {/* Feature 21: Feature Flags Engine */}
      <FeatureFlagsSheet
        isOpen={isFeatureFlagsOpen}
        onClose={() => setIsFeatureFlagsOpen(false)}
        flags={featureFlags}
        onToggleFlag={handleToggleFeatureFlag}
      />

      {/* Customizable User Profile Modal & Data Simulator */}
      <CustomProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        preferences={preferences}
        onSavePreferences={(updated) => {
          setPreferences(updated);
          StorageService.setPreferences(updated);
        }}
        quitSmoking={quitSmoking}
        onUpdateQuitSmoking={(updated) => {
          setQuitSmoking(updated);
          StorageService.setQuitSmoking(updated);
        }}
        onSeedData={handleSeedData}
      />
    </DeviceFrame>
  );
}
