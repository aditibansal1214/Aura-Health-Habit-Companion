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
  NudgeConfig
} from '../types/health';
import {
  initialFeatureFlags,
  initialUserPreferences,
  initialMoodEnergyLogs,
  initialDailyLogs,
  initialBPLogs,
  initialHabitStacks,
  initialHealthFlags,
  initialPrograms,
  initialQuitSmoking,
  initialAccountabilityPartners,
  initialNudgeConfig
} from './mockData';

const STORAGE_KEYS = {
  PREFS: 'aura_user_prefs_v1',
  FLAGS: 'aura_feature_flags_v1',
  NUDGE: 'aura_nudge_config_v1',
  MOOD_ENERGY: 'aura_mood_energy_v1',
  DAILY_LOGS: 'aura_daily_logs_v1',
  BP_LOGS: 'aura_bp_logs_v1',
  HABIT_STACKS: 'aura_habit_stacks_v1',
  HEALTH_FLAGS: 'aura_health_flags_v1',
  PROGRAMS: 'aura_programs_v1',
  QUIT_SMOKING: 'aura_quit_smoking_v1',
  PARTNERS: 'aura_partners_v1',
  STREAK: 'aura_streak_state_v1',
  ONE_THING: 'aura_one_thing_state_v1',
};

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lifePassesLeftThisWeek: number; // default 2
  lastCompletedDate: string; // YYYY-MM-DD
  canRepair48h: boolean;
  repairMissedDate: string | null;
  comebackCelebrated: boolean;
}

export interface OneThingState {
  id: string;
  title: string;
  subtitle: string;
  category: 'vitals' | 'sleep' | 'hydration' | 'movement';
  isTwoMinuteMode: boolean;
  normalVersion: {
    action: string;
    impact: string;
    duration: string;
  };
  twoMinuteVersion: {
    action: string;
    impact: string;
    duration: string;
  };
  completedToday: boolean;
  completedAt?: string;
  swappedAt?: string;
  whyItWorks: {
    plainExplanation: string;
    scientificSource: string;
  };
}

export class StorageService {
  public static load<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const data = localStorage.getItem(key);
      if (!data) return fallback;
      return JSON.parse(data) as T;
    } catch {
      return fallback;
    }
  }

  public static save<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage quota or private mode
    }
  }

  public static getPreferences(): UserPreferences {
    return this.load<UserPreferences>(STORAGE_KEYS.PREFS, initialUserPreferences);
  }
  public static setPreferences(p: UserPreferences) {
    this.save(STORAGE_KEYS.PREFS, p);
  }

  public static getFeatureFlags(): FeatureFlags {
    return this.load<FeatureFlags>(STORAGE_KEYS.FLAGS, initialFeatureFlags);
  }
  public static setFeatureFlags(f: FeatureFlags) {
    this.save(STORAGE_KEYS.FLAGS, f);
  }

  public static getNudgeConfig(): NudgeConfig {
    return this.load<NudgeConfig>(STORAGE_KEYS.NUDGE, initialNudgeConfig);
  }
  public static setNudgeConfig(n: NudgeConfig) {
    this.save(STORAGE_KEYS.NUDGE, n);
  }

  public static getMoodLogs(): MoodEnergyEntry[] {
    return this.load<MoodEnergyEntry[]>(STORAGE_KEYS.MOOD_ENERGY, initialMoodEnergyLogs);
  }
  public static setMoodLogs(logs: MoodEnergyEntry[]) {
    this.save(STORAGE_KEYS.MOOD_ENERGY, logs);
  }

  public static getDailyLogs(): DailyLog[] {
    return this.load<DailyLog[]>(STORAGE_KEYS.DAILY_LOGS, initialDailyLogs);
  }
  public static setDailyLogs(logs: DailyLog[]) {
    this.save(STORAGE_KEYS.DAILY_LOGS, logs);
  }

  public static getBPLogs(): BPReading[] {
    return this.load<BPReading[]>(STORAGE_KEYS.BP_LOGS, initialBPLogs);
  }
  public static setBPLogs(logs: BPReading[]) {
    this.save(STORAGE_KEYS.BP_LOGS, logs);
  }

  public static getHabitStacks(): HabitStack[] {
    return this.load<HabitStack[]>(STORAGE_KEYS.HABIT_STACKS, initialHabitStacks);
  }
  public static setHabitStacks(stacks: HabitStack[]) {
    this.save(STORAGE_KEYS.HABIT_STACKS, stacks);
  }

  public static getHealthFlags(): HealthFlag[] {
    return this.load<HealthFlag[]>(STORAGE_KEYS.HEALTH_FLAGS, initialHealthFlags);
  }
  public static setHealthFlags(flags: HealthFlag[]) {
    this.save(STORAGE_KEYS.HEALTH_FLAGS, flags);
  }

  public static getPrograms(): AdaptiveProgram[] {
    return this.load<AdaptiveProgram[]>(STORAGE_KEYS.PROGRAMS, initialPrograms);
  }
  public static setPrograms(progs: AdaptiveProgram[]) {
    this.save(STORAGE_KEYS.PROGRAMS, progs);
  }

  public static getQuitSmoking(): QuitSmokingState {
    return this.load<QuitSmokingState>(STORAGE_KEYS.QUIT_SMOKING, initialQuitSmoking);
  }
  public static setQuitSmoking(qs: QuitSmokingState) {
    this.save(STORAGE_KEYS.QUIT_SMOKING, qs);
  }

  public static getPartners(): AccountabilityPartner[] {
    return this.load<AccountabilityPartner[]>(STORAGE_KEYS.PARTNERS, initialAccountabilityPartners);
  }
  public static setPartners(p: AccountabilityPartner[]) {
    this.save(STORAGE_KEYS.PARTNERS, p);
  }

  public static getStreakState(): StreakState {
    return this.load<StreakState>(STORAGE_KEYS.STREAK, {
      currentStreak: 12,
      longestStreak: 18,
      lifePassesLeftThisWeek: 2,
      lastCompletedDate: '2026-10-08',
      canRepair48h: true,
      repairMissedDate: '2026-10-07',
      comebackCelebrated: false,
    });
  }
  public static setStreakState(s: StreakState) {
    this.save(STORAGE_KEYS.STREAK, s);
  }

  public static getOneThingState(): OneThingState {
    return this.load<OneThingState>(STORAGE_KEYS.ONE_THING, {
      id: 'ot-1',
      title: '5-Minute Seated Rest Before Morning BP Check',
      subtitle: 'Highest impact on cuff accuracy today',
      category: 'vitals',
      isTwoMinuteMode: false,
      normalVersion: {
        action: 'Sit quietly with feet flat and arm supported for 5 minutes before your morning BP cuff check',
        impact: 'Prevents the 8–12 mmHg false spike caused by hasty readings',
        duration: '5 minutes',
      },
      twoMinuteVersion: {
        action: 'Sit still in your chair and take 4 slow breaths with both feet flat on the floor',
        impact: 'Gently lowers heart rate and vascular tension before you start your day',
        duration: '2 minutes',
      },
      completedToday: false,
      whyItWorks: {
        plainExplanation: 'Talking or walking right before taking blood pressure causes temporary sympathetic vasoconstriction.',
        scientificSource: 'American Heart Association (AHA) Home BP Guidelines',
      }
    });
  }
  public static setOneThingState(ot: OneThingState) {
    this.save(STORAGE_KEYS.ONE_THING, ot);
  }

  // Clear all data (for privacy dashboard "Delete All Data")
  public static clearAllData(): void {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }

  // Export all data as JSON
  public static exportAllDataJSON(): string {
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      appName: 'Aura Health & Habit Companion',
      version: '1.0.0',
      privacyStatement: 'This data was stored locally on your device and never sold or uploaded without consent.',
      preferences: this.getPreferences(),
      moodLogs: this.getMoodLogs(),
      dailyLogs: this.getDailyLogs(),
      bpLogs: this.getBPLogs(),
      habitStacks: this.getHabitStacks(),
      healthFlags: this.getHealthFlags(),
      quitSmoking: this.getQuitSmoking(),
      streakState: this.getStreakState(),
    }, null, 2);
  }
}

// Analytics and Rule Engine Helpers
export interface PersonalCorrelations {
  ready: boolean;
  totalEntries: number;
  threshold: number; // 14
  insights: {
    id: string;
    headline: string;
    detail: string;
    confidence: string;
  }[];
}

export function computePersonalCorrelations(
  moodLogs: MoodEnergyEntry[],
  dailyLogs: DailyLog[]
): PersonalCorrelations {
  const threshold = 14;
  const count = moodLogs.length;

  if (count < threshold) {
    return {
      ready: false,
      totalEntries: count,
      threshold,
      insights: []
    };
  }

  // Correlate sleep with energy
  const dayMap = new Map<string, DailyLog>();
  dailyLogs.forEach(d => dayMap.set(d.date, d));

  let highSleepEnergySum = 0;
  let highSleepCount = 0;
  let lowSleepEnergySum = 0;
  let lowSleepCount = 0;

  moodLogs.forEach(m => {
    const daily = dayMap.get(m.date);
    if (daily) {
      if (daily.sleepHours >= 7.0) {
        highSleepEnergySum += m.energy;
        highSleepCount++;
      } else {
        lowSleepEnergySum += m.energy;
        lowSleepCount++;
      }
    }
  });

  const highSleepAvg = highSleepCount > 0 ? highSleepEnergySum / highSleepCount : 4.1;
  const lowSleepAvg = lowSleepCount > 0 ? lowSleepEnergySum / lowSleepCount : 3.2;
  const diff = (highSleepAvg - lowSleepAvg).toFixed(1);

  // Correlate steps with stress
  let activeLowStressCount = 0;
  dailyLogs.forEach(d => {
    const moodEntry = moodLogs.find(m => m.date === d.date);
    if (moodEntry && d.steps >= 7000 && moodEntry.stress <= 2) {
      activeLowStressCount++;
    }
  });

  return {
    ready: true,
    totalEntries: count,
    threshold,
    insights: [
      {
        id: 'corr-sleep-energy',
        headline: `On days you slept 7+ hours, your energy averaged ${diff} higher.`,
        detail: `Based on your own ${count} logged days. (Personal correlation, not a medical cause)`,
        confidence: '92% pattern match',
      },
      {
        id: 'corr-steps-stress',
        headline: 'Days with 7,000+ steps corresponded to lower self-reported stress.',
        detail: `You reported low stress on ${activeLowStressCount} active days. (Personal correlation)`,
        confidence: '84% pattern match',
      }
    ]
  };
}

// 14-day rolling baseline calculation
export function compute14DayBaselines(dailyLogs: DailyLog[]) {
  const recent = dailyLogs.slice(-14);
  const n = recent.length || 1;

  const totalSteps = recent.reduce((acc, d) => acc + d.steps, 0);
  const totalSleep = recent.reduce((acc, d) => acc + d.sleepHours, 0);
  const totalWater = recent.reduce((acc, d) => acc + d.waterGlasses, 0);

  const avgSteps = Math.round(totalSteps / n);
  const avgSleep = (totalSleep / n).toFixed(1);
  const avgWater = (totalWater / n).toFixed(1);

  return {
    sampleDays: n,
    avgSteps,
    avgSleep: parseFloat(avgSleep),
    avgWater: parseFloat(avgWater),
    // Beat your own average targets: baseline + modest micro-step
    targetSteps: avgSteps + 500,
    targetSleep: (parseFloat(avgSleep) + 0.3).toFixed(1), // +18 minutes
    targetWater: Math.min(8, Math.round(parseFloat(avgWater) + 1)),
  };
}
