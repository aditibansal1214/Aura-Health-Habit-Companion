export type ReadingLevel = 'simple' | 'standard';
export type AppLanguage = 'en' | 'hi';
export type DeviceFrameType = 'iphone' | 'pixel' | 'fullscreen';
export type SeasonalTheme = 'aurora' | 'spring' | 'summer' | 'autumn';

export interface MoodEnergyEntry {
  id: string;
  date: string; // YYYY-MM-DD
  timeOfDay: 'morning' | 'evening';
  energy: number; // 1-5
  mood: number; // 1-5
  stress: number; // 1-5
  note?: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  steps: number;
  sleepHours: number;
  sleepQuality?: number; // 1-5
  waterGlasses: number; // 1 glass = 250ml
  activeMinutes: number;
  meals: {
    type: 'light' | 'normal' | 'heavy';
    time: string;
    note?: string;
  }[];
  wearableSource?: 'Apple Health' | 'Health Connect' | 'Garmin' | 'Manual';
}

export interface BPReading {
  id: string;
  date: string; // YYYY-MM-DD HH:mm
  systolic: number;
  diastolic: number;
  pulse: number;
  arm: 'left' | 'right';
  readingsCount: number; // usually 3 averaged
  individualReadings?: { systolic: number; diastolic: number; pulse: number }[];
  category: 'Normal' | 'Elevated' | 'Stage 1' | 'Stage 2' | 'Hypertensive Crisis';
  notes?: string;
}

export interface HabitStack {
  id: string;
  anchorRoutine: string; // e.g. "After I brush my teeth"
  anchorTime: string; // e.g. "07:30"
  microHabit: string; // e.g. "Drink 1 glass of room-temp water"
  category: 'hydration' | 'movement' | 'mindfulness' | 'vitals' | 'sleep';
  completedToday: boolean;
  history: string[]; // YYYY-MM-DD completed dates
  whyItWorks: {
    plainExplanation: string;
    scientificSource: string;
    estimatedSeconds: number;
  };
}

export interface HealthFlag {
  id: string;
  title: string;
  severity: 'low' | 'moderate' | 'high';
  category: 'bp' | 'sleep' | 'steps' | 'stress';
  triggerReason: string;
  daysActive: number;
  threshold: string;
  userValue: string;
  plainWhy: string;
  realisticActions: string[];
  clinicianCriteria: string;
}

export interface AdaptiveProgram {
  id: 'reset' | 'steady' | 'boost';
  title: string;
  description: string;
  durationWeeks: number;
  currentWeek: number;
  currentStep: string;
  missedDaysCount: number;
  isSoftened: boolean;
  active: boolean;
}

export interface QuitSmokingState {
  enabled: boolean;
  quitDate: string; // ISO string
  cigsPerDayPrior: number;
  costPerPack: number;
  cigsPerPack: number;
  cravingsLogged: {
    id: string;
    timestamp: string;
    trigger: 'stress' | 'coffee' | 'social' | 'boredom' | 'after_meal' | 'other';
    intensity: number; // 1-5
    usedSOS: boolean;
  }[];
  slipsCount: number;
}

export interface AccountabilityPartner {
  id: string;
  name: string;
  relation: string;
  avatar: string;
  sharedFields: {
    streaks: boolean;
    weeklyGoalMet: boolean;
    vitals: boolean; // default false, strictly guarded
  };
  lastCheer?: {
    type: 'cheer' | 'heart' | 'relaxed';
    message: string;
    timestamp: string;
  };
}

export interface FeatureFlags {
  oneThingHome: boolean;
  moodEnergyCheckin: boolean;
  habitStacking: boolean;
  quietNudges: boolean;
  streaksWithGrace: boolean;
  personalBaseline: boolean;
  weeklyHealthStory: boolean;
  doctorVisitPrep: boolean;
  guidedBPCheck: boolean;
  quitSmokingCompanion: boolean;
  microLessons: boolean;
  smartQuickLog: boolean;
  flagExplainer: boolean;
  accountabilityCircle: boolean;
  adaptivePrograms: boolean;
  plainLanguageMode: boolean;
  progressJourney: boolean;
  privacyDashboard: boolean;
  gentleSafetyNet: boolean;
  delightLayer: boolean;
}

export interface NudgeConfig {
  quietHoursStart: string; // e.g. "22:00"
  quietHoursEnd: string; // e.g. "07:30"
  maxPerDay: number; // hard capped at 2
  pausedUntilDate: string | null; // pause for a week
  learnedActiveHours: number[]; // e.g. [8, 20]
  nudgesSentToday: number;
  consecutiveIgnores: number;
}

export interface UserPreferences {
  name: string;
  readingLevel: ReadingLevel;
  language: AppLanguage;
  largeText: boolean;
  colorBlindSafe: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  pauseCoaching: boolean;
  seasonalTheme: SeasonalTheme;
  deviceFrame: DeviceFrameType;
  researchContribution: boolean;
  peerContextOptIn: boolean;
  medications: string[];
  familyHistory: string[];
}
