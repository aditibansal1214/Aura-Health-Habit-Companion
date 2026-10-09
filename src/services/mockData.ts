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

export const initialFeatureFlags: FeatureFlags = {
  oneThingHome: true,
  moodEnergyCheckin: true,
  habitStacking: true,
  quietNudges: true,
  streaksWithGrace: true,
  personalBaseline: true,
  weeklyHealthStory: true,
  doctorVisitPrep: true,
  guidedBPCheck: true,
  quitSmokingCompanion: true,
  microLessons: true,
  smartQuickLog: true,
  flagExplainer: true,
  accountabilityCircle: true,
  adaptivePrograms: true,
  plainLanguageMode: true,
  progressJourney: true,
  privacyDashboard: true,
  gentleSafetyNet: true,
  delightLayer: true,
};

export const initialUserPreferences: UserPreferences = {
  name: 'Alex',
  age: 38,
  readingLevel: 'standard',
  language: 'en',
  largeText: false,
  colorBlindSafe: false,
  soundEnabled: true,
  hapticEnabled: true,
  pauseCoaching: false,
  seasonalTheme: 'aurora',
  deviceFrame: 'iphone',
  researchContribution: false,
  peerContextOptIn: false,
  medications: ['Lisinopril 10mg (morning)', 'Magnesium Glycinate 200mg (night)'],
  familyHistory: ['Maternal hypertension', 'Type 2 Diabetes (Paternal Grandparent)'],
  allergies: ['No known drug allergies'],
  targetSteps: 7000,
  targetSleep: 7.5,
  targetWater: 7,
  bioNotes: 'Focusing on morning vascular calm and consistent wind-down sleep.',
};

export const initialNudgeConfig: NudgeConfig = {
  quietHoursStart: '22:00',
  quietHoursEnd: '07:30',
  maxPerDay: 2,
  pausedUntilDate: null,
  learnedActiveHours: [8, 20],
  nudgesSentToday: 0,
  consecutiveIgnores: 0,
};

// 16 days of mood & energy check-ins (exceeds the 14-point threshold for personal correlations)
export const initialMoodEnergyLogs: MoodEnergyEntry[] = [
  { id: 'me-1', date: '2026-09-24', timeOfDay: 'morning', energy: 3, mood: 3, stress: 3 },
  { id: 'me-2', date: '2026-09-25', timeOfDay: 'morning', energy: 4, mood: 4, stress: 2 },
  { id: 'me-3', date: '2026-09-26', timeOfDay: 'morning', energy: 4, mood: 4, stress: 2 },
  { id: 'me-4', date: '2026-09-27', timeOfDay: 'morning', energy: 2, mood: 3, stress: 4 },
  { id: 'me-5', date: '2026-09-28', timeOfDay: 'morning', energy: 3, mood: 3, stress: 3 },
  { id: 'me-6', date: '2026-09-29', timeOfDay: 'morning', energy: 4, mood: 4, stress: 2 },
  { id: 'me-7', date: '2026-09-30', timeOfDay: 'morning', energy: 5, mood: 4, stress: 1 },
  { id: 'me-8', date: '2026-10-01', timeOfDay: 'morning', energy: 3, mood: 3, stress: 3 },
  { id: 'me-9', date: '2026-10-02', timeOfDay: 'morning', energy: 4, mood: 4, stress: 2 },
  { id: 'me-10', date: '2026-10-03', timeOfDay: 'morning', energy: 5, mood: 5, stress: 1 },
  { id: 'me-11', date: '2026-10-04', timeOfDay: 'morning', energy: 2, mood: 2, stress: 4 },
  { id: 'me-12', date: '2026-10-05', timeOfDay: 'morning', energy: 4, mood: 4, stress: 2 },
  { id: 'me-13', date: '2026-10-06', timeOfDay: 'morning', energy: 4, mood: 4, stress: 2 },
  { id: 'me-14', date: '2026-10-07', timeOfDay: 'morning', energy: 5, mood: 5, stress: 1 },
  { id: 'me-15', date: '2026-10-08', timeOfDay: 'morning', energy: 3, mood: 3, stress: 3 },
  { id: 'me-16', date: '2026-10-09', timeOfDay: 'morning', energy: 4, mood: 4, stress: 2 },
];

export const initialDailyLogs: DailyLog[] = [
  { date: '2026-09-24', steps: 5800, sleepHours: 6.2, waterGlasses: 5, activeMinutes: 18, meals: [{ type: 'normal', time: '12:30' }, { type: 'normal', time: '19:15' }] },
  { date: '2026-09-25', steps: 7200, sleepHours: 7.4, waterGlasses: 7, activeMinutes: 28, meals: [{ type: 'light', time: '08:00' }, { type: 'normal', time: '13:00' }] },
  { date: '2026-09-26', steps: 8100, sleepHours: 7.8, waterGlasses: 8, activeMinutes: 35, meals: [{ type: 'normal', time: '12:45' }, { type: 'light', time: '19:00' }] },
  { date: '2026-09-27', steps: 4200, sleepHours: 5.8, waterGlasses: 4, activeMinutes: 12, meals: [{ type: 'heavy', time: '20:30' }] },
  { date: '2026-09-28', steps: 6100, sleepHours: 6.6, waterGlasses: 6, activeMinutes: 20, meals: [{ type: 'normal', time: '12:30' }] },
  { date: '2026-09-29', steps: 7600, sleepHours: 7.5, waterGlasses: 7, activeMinutes: 30, meals: [{ type: 'light', time: '08:30' }, { type: 'normal', time: '13:00' }] },
  { date: '2026-09-30', steps: 8900, sleepHours: 8.1, waterGlasses: 8, activeMinutes: 42, meals: [{ type: 'normal', time: '12:00' }, { type: 'normal', time: '18:45' }] },
  { date: '2026-10-01', steps: 6300, sleepHours: 6.8, waterGlasses: 6, activeMinutes: 22, meals: [{ type: 'normal', time: '13:00' }] },
  { date: '2026-10-02', steps: 7900, sleepHours: 7.3, waterGlasses: 7, activeMinutes: 31, meals: [{ type: 'light', time: '08:15' }, { type: 'normal', time: '12:45' }] },
  { date: '2026-10-03', steps: 9400, sleepHours: 8.0, waterGlasses: 8, activeMinutes: 45, meals: [{ type: 'light', time: '09:00' }, { type: 'normal', time: '14:00' }] },
  { date: '2026-10-04', steps: 3900, sleepHours: 5.5, waterGlasses: 4, activeMinutes: 10, meals: [{ type: 'heavy', time: '21:00' }] },
  { date: '2026-10-05', steps: 6800, sleepHours: 7.1, waterGlasses: 7, activeMinutes: 25, meals: [{ type: 'normal', time: '12:30' }] },
  { date: '2026-10-06', steps: 7400, sleepHours: 7.6, waterGlasses: 7, activeMinutes: 29, meals: [{ type: 'light', time: '08:30' }, { type: 'normal', time: '13:00' }] },
  { date: '2026-10-07', steps: 8300, sleepHours: 7.9, waterGlasses: 8, activeMinutes: 38, meals: [{ type: 'normal', time: '12:15' }] },
  { date: '2026-10-08', steps: 6400, sleepHours: 6.5, waterGlasses: 6, activeMinutes: 24, meals: [{ type: 'normal', time: '13:00' }] },
  { date: '2026-10-09', steps: 5100, sleepHours: 7.2, waterGlasses: 5, activeMinutes: 19, meals: [{ type: 'light', time: '08:30' }], wearableSource: 'Apple Health' },
];

export const initialBPLogs: BPReading[] = [
  {
    id: 'bp-1',
    date: '2026-09-25 08:15',
    systolic: 124,
    diastolic: 81,
    pulse: 68,
    arm: 'left',
    readingsCount: 3,
    category: 'Stage 1',
    individualReadings: [
      { systolic: 127, diastolic: 83, pulse: 71 },
      { systolic: 123, diastolic: 80, pulse: 67 },
      { systolic: 122, diastolic: 80, pulse: 66 },
    ],
    notes: 'Morning reading after 5 min quiet rest.'
  },
  {
    id: 'bp-2',
    date: '2026-09-29 08:30',
    systolic: 121,
    diastolic: 79,
    pulse: 65,
    arm: 'left',
    readingsCount: 3,
    category: 'Elevated',
    individualReadings: [
      { systolic: 124, diastolic: 81, pulse: 68 },
      { systolic: 120, diastolic: 78, pulse: 64 },
      { systolic: 119, diastolic: 78, pulse: 63 },
    ]
  },
  {
    id: 'bp-3',
    date: '2026-10-03 08:10',
    systolic: 118,
    diastolic: 77,
    pulse: 64,
    arm: 'left',
    readingsCount: 3,
    category: 'Normal',
    individualReadings: [
      { systolic: 120, diastolic: 78, pulse: 66 },
      { systolic: 118, diastolic: 77, pulse: 63 },
      { systolic: 116, diastolic: 76, pulse: 63 },
    ]
  },
  {
    id: 'bp-4',
    date: '2026-10-07 08:20',
    systolic: 126,
    diastolic: 82,
    pulse: 72,
    arm: 'left',
    readingsCount: 3,
    category: 'Stage 1',
    individualReadings: [
      { systolic: 130, diastolic: 84, pulse: 75 },
      { systolic: 125, diastolic: 81, pulse: 71 },
      { systolic: 123, diastolic: 81, pulse: 70 },
    ],
    notes: 'Slept shorter night before.'
  },
  {
    id: 'bp-5',
    date: '2026-10-09 08:05',
    systolic: 122,
    diastolic: 79,
    pulse: 66,
    arm: 'left',
    readingsCount: 3,
    category: 'Elevated',
    individualReadings: [
      { systolic: 125, diastolic: 81, pulse: 69 },
      { systolic: 121, diastolic: 78, pulse: 65 },
      { systolic: 120, diastolic: 78, pulse: 64 },
    ]
  }
];

export const initialHabitStacks: HabitStack[] = [
  {
    id: 'hs-1',
    anchorRoutine: 'After I turn on morning coffee machine',
    anchorTime: '07:30',
    microHabit: 'Drink 1 full glass of water',
    category: 'hydration',
    completedToday: true,
    history: ['2026-10-07', '2026-10-08', '2026-10-09'],
    whyItWorks: {
      plainExplanation: 'Overnight respiration dehydrates you by ~500ml. Immediate hydration restores cellular perfusion before caffeine.',
      scientificSource: 'CDC Water & Health Guidelines',
      estimatedSeconds: 30,
    }
  },
  {
    id: 'hs-2',
    anchorRoutine: 'After I sit at my desk in the morning',
    anchorTime: '08:45',
    microHabit: 'Take 3 slow diaphragmatic breaths',
    category: 'mindfulness',
    completedToday: false,
    history: ['2026-10-06', '2026-10-07', '2026-10-08'],
    whyItWorks: {
      plainExplanation: '3 slow exhales stimulate vagal tone, stabilizing pre-work sympathetic blood pressure surges.',
      scientificSource: 'Stanford Behavioral Neurobiology Lab',
      estimatedSeconds: 45,
    }
  },
  {
    id: 'hs-3',
    anchorRoutine: 'After I close my laptop in the evening',
    anchorTime: '17:45',
    microHabit: '5-minute outdoor balcony or yard stroll',
    category: 'movement',
    completedToday: false,
    history: ['2026-10-05', '2026-10-06', '2026-10-07'],
    whyItWorks: {
      plainExplanation: 'A brief boundary walk signals psychological work shutdown, lowering evening cortisol.',
      scientificSource: 'AHA Physical Activity Consensus',
      estimatedSeconds: 300,
    }
  }
];

export const initialHealthFlags: HealthFlag[] = [
  {
    id: 'flag-bp-elevated',
    title: 'Elevated Morning Blood Pressure Pattern',
    severity: 'moderate',
    category: 'bp',
    triggerReason: '3 of last 4 morning readings had systolic between 121–126 mmHg',
    daysActive: 14,
    threshold: 'Normal is < 120 / < 80 mmHg',
    userValue: 'Recent average: 123 / 80 mmHg',
    plainWhy: 'Slightly elevated pressures mean arteries work slightly harder. Small habitual adjustments in sodium, sleep, and morning rest can bring this into standard range.',
    realisticActions: [
      'Take 5 minutes of seated quiet before the morning cuff reading',
      'Swap dinner salt shaker for fresh herbs or lemon',
      'Aim for a consistent bedtime within a 30-minute window'
    ],
    clinicianCriteria: 'If systolic stays >130 or diastolic >85 on repeated rest measurements, or if you feel headaches/dizziness.'
  },
  {
    id: 'flag-sleep-short',
    title: 'Sleep Window Under Baseline on Sunday Nights',
    severity: 'low',
    category: 'sleep',
    triggerReason: 'Logged under 6 hours on recent weekend wrap evenings',
    daysActive: 7,
    threshold: 'Your personal 14-day average: 7.1 hours',
    userValue: 'Sunday log: 5.5 hours',
    plainWhy: 'Short sleep spikes next-day morning cortisol and makes physical movement feel 20% harder.',
    realisticActions: [
      'Dim overhead lights 45 minutes before sleep',
      'Try the 2-minute wind-down stretch instead of screen scrolling',
      'Keep weekend wake-up within 1 hour of weekday routine'
    ],
    clinicianCriteria: 'If fragmented sleep persists for >3 weeks despite good sleep hygiene.'
  }
];

export const initialPrograms: AdaptiveProgram[] = [
  {
    id: 'reset',
    title: 'Gentle Reset',
    description: 'Designed for short sleep or low step days. Exactly 1 tiny change per week. Automatically softens if you need a break.',
    durationWeeks: 3,
    currentWeek: 1,
    currentStep: 'Step 1: Drink 1 glass of water after brushing teeth in the morning',
    missedDaysCount: 0,
    isSoftened: false,
    active: true,
  },
  {
    id: 'steady',
    title: 'Steady Rhythm',
    description: 'Maintenance program for holding your baseline without burn-out.',
    durationWeeks: 4,
    currentWeek: 1,
    currentStep: 'Protect your 7-hour sleep window 4 nights this week',
    missedDaysCount: 0,
    isSoftened: false,
    active: false,
  },
  {
    id: 'boost',
    title: 'Gradual Boost',
    description: 'Progressive challenge for active weeks: +500 steps above personal baseline.',
    durationWeeks: 4,
    currentWeek: 1,
    currentStep: 'Reach your personal 14-day step average + 500 steps',
    missedDaysCount: 0,
    isSoftened: false,
    active: false,
  }
];

export const initialQuitSmoking: QuitSmokingState = {
  enabled: true,
  quitDate: '2026-10-02T08:00:00.000Z', // 7 days smoke free!
  cigsPerDayPrior: 10,
  costPerPack: 12,
  cigsPerPack: 20,
  cravingsLogged: [
    { id: 'crav-1', timestamp: '2026-10-04T15:20:00.000Z', trigger: 'coffee', intensity: 4, usedSOS: true },
    { id: 'crav-2', timestamp: '2026-10-06T18:10:00.000Z', trigger: 'stress', intensity: 3, usedSOS: true },
    { id: 'crav-3', timestamp: '2026-10-08T20:30:00.000Z', trigger: 'social', intensity: 2, usedSOS: true },
  ],
  slipsCount: 0,
};

export const initialAccountabilityPartners: AccountabilityPartner[] = [
  {
    id: 'ap-1',
    name: 'Maya',
    relation: 'Partner',
    avatar: 'M',
    sharedFields: {
      streaks: true,
      weeklyGoalMet: true,
      vitals: false, // Strict default shield
    },
    lastCheer: {
      type: 'cheer',
      message: 'So proud of your calm morning routine!',
      timestamp: 'Today at 08:35'
    }
  },
  {
    id: 'ap-2',
    name: 'Dr. Rivera (Care Coach)',
    relation: 'Wellness Coach',
    avatar: 'R',
    sharedFields: {
      streaks: true,
      weeklyGoalMet: true,
      vitals: false,
    },
    lastCheer: {
      type: 'heart',
      message: 'Great job maintaining the 5-minute pre-BP rest.',
      timestamp: 'Yesterday'
    }
  }
];

export interface TestPersona {
  id: string;
  label: string;
  description: string;
  preferences: UserPreferences;
  quitSmokingEnabled: boolean;
}

export const testPersonas: TestPersona[] = [
  {
    id: 'persona-alex',
    label: 'Alex (Default: Balanced Routine)',
    description: '38 yrs · Pre-hypertension monitoring · 7,000 steps · Lisinopril',
    quitSmokingEnabled: true,
    preferences: initialUserPreferences,
  },
  {
    id: 'persona-elena',
    label: 'Elena (Hypertension & Rest Recovery)',
    description: '54 yrs · Strict BP protocol · 6,000 steps · Lisinopril 20mg & Amlodipine',
    quitSmokingEnabled: false,
    preferences: {
      name: 'Elena',
      age: 54,
      readingLevel: 'standard',
      language: 'en',
      largeText: true,
      colorBlindSafe: false,
      soundEnabled: true,
      hapticEnabled: true,
      pauseCoaching: false,
      seasonalTheme: 'autumn',
      deviceFrame: 'iphone',
      researchContribution: false,
      peerContextOptIn: true,
      medications: ['Lisinopril 20mg (morning)', 'Amlodipine 5mg (night)', 'Baby Aspirin 81mg'],
      familyHistory: ['Maternal stroke at age 62', 'Early coronary artery disease'],
      allergies: ['Penicillin (rash)', 'Codeine'],
      targetSteps: 6000,
      targetSleep: 8.0,
      targetWater: 8,
      bioNotes: 'Preparing for quarterly cardiologist consultation; tracking morning cuff accuracy.',
    },
  },
  {
    id: 'persona-marcus',
    label: 'Marcus (High Movement & Endurance)',
    description: '29 yrs · Active endurance runner · 11,000 steps · Electrolytes & Magnesium',
    quitSmokingEnabled: false,
    preferences: {
      name: 'Marcus',
      age: 29,
      readingLevel: 'simple',
      language: 'en',
      largeText: false,
      colorBlindSafe: false,
      soundEnabled: true,
      hapticEnabled: true,
      pauseCoaching: false,
      seasonalTheme: 'summer',
      deviceFrame: 'pixel',
      researchContribution: true,
      peerContextOptIn: true,
      medications: ['Magnesium Glycinate 400mg', 'Electrolyte hydration tablet (post-run)'],
      familyHistory: ['Asthma', 'Mild osteoarthritis'],
      allergies: ['No known drug allergies'],
      targetSteps: 11000,
      targetSleep: 8.2,
      targetWater: 10,
      bioNotes: 'Training for half marathon; prioritizing sleep recovery and beat-your-own-average steps.',
    },
  },
  {
    id: 'persona-priya',
    label: 'Priya (Stress Calm & Smoke-Free Journey)',
    description: '33 yrs · Quit-smoking SOS & Box breathing · 6,500 steps · Hindi support ready',
    quitSmokingEnabled: true,
    preferences: {
      name: 'Priya',
      age: 33,
      readingLevel: 'standard',
      language: 'en',
      largeText: false,
      colorBlindSafe: true,
      soundEnabled: true,
      hapticEnabled: true,
      pauseCoaching: false,
      seasonalTheme: 'spring',
      deviceFrame: 'iphone',
      researchContribution: false,
      peerContextOptIn: false,
      medications: ['Nicotine gum 2mg (as needed for cravings)', 'Ashwagandha 300mg', 'Vitamin D3 2000IU'],
      familyHistory: ['Hypertension', 'Type 2 Diabetes'],
      allergies: ['Sulfa drugs'],
      targetSteps: 6500,
      targetSleep: 7.2,
      targetWater: 7,
      bioNotes: 'Day 8 smoke-free; utilizing Craving SOS breathing techniques and gentle habit stacks.',
    },
  },
];

