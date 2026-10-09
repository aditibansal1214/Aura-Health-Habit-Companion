import React from 'react';
import { Home, Heart, Sparkles, BookOpen, User, Plus } from 'lucide-react';
import { soundService } from '../../services/sound';

export type NavTab = 'home' | 'vitals' | 'habits' | 'story' | 'profile';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenQuickLog: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenQuickLog,
}) => {
  const tabs = [
    { id: 'home' as const, label: 'Today', icon: Home },
    { id: 'vitals' as const, label: 'Vitals & BP', icon: Heart },
    { id: 'habits' as const, label: 'Habits', icon: Sparkles },
    { id: 'story' as const, label: 'Story & Prep', icon: BookOpen },
    { id: 'profile' as const, label: 'Privacy', icon: User },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-between no-print">
      {tabs.slice(0, 2).map((t) => {
        const Icon = t.icon;
        const isActive = currentTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => {
              soundService.playTap();
              onSelectTab(t.id);
            }}
            className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              isActive ? 'text-teal-700 dark:text-teal-400 font-bold' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span className="text-[10px] tracking-tight mt-0.5">{t.label}</span>
          </button>
        );
      })}

      {/* Floating Center Quick-Log Button */}
      <div className="flex flex-col items-center justify-center px-1 -mt-5">
        <button
          onClick={() => {
            soundService.playTap();
            onOpenQuickLog();
          }}
          className="w-12 h-12 rounded-full bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center shadow-lg shadow-teal-600/30 active:scale-95 transition-all"
          title="Quick-Log Water, Steps, Meal, or Voice"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
        <span className="text-[10px] text-slate-500 font-semibold mt-0.5">Log</span>
      </div>

      {tabs.slice(2).map((t) => {
        const Icon = t.icon;
        const isActive = currentTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => {
              soundService.playTap();
              onSelectTab(t.id);
            }}
            className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              isActive ? 'text-teal-700 dark:text-teal-400 font-bold' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span className="text-[10px] tracking-tight mt-0.5">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};
