import React from 'react';
import { Award, CheckCircle2, TrendingUp, Sparkles, Heart, Shield, Clock } from 'lucide-react';
import { BPReading, DailyLog } from '../../types/health';

interface ProgressJourneyViewProps {
  dailyLogs: DailyLog[];
  bpLogs: BPReading[];
}

export const ProgressJourneyView: React.FC<ProgressJourneyViewProps> = ({
  dailyLogs,
  bpLogs,
}) => {
  const milestones = [
    {
      id: 'm-1',
      date: 'Week 1',
      title: 'First Full Week Faithfully Tracked',
      badge: 'Unlocked',
      desc: 'Established personal baseline with 7 continuous days of rest & step data.',
      icon: <Award className="w-4 h-4 text-amber-600" />,
    },
    {
      id: 'm-2',
      date: 'Week 2',
      title: 'Three 7.5+ Hour Sleep Nights In A Row',
      badge: 'Unlocked',
      desc: 'Observed +0.8 higher personal energy correlation following these nights.',
      icon: <Sparkles className="w-4 h-4 text-teal-600" />,
    },
    {
      id: 'm-3',
      date: 'Week 3',
      title: 'Guided 5-Min BP Protocol Mastered',
      badge: 'Unlocked',
      desc: 'Stabilized morning variance by consistently sitting feet-flat before measurements.',
      icon: <Heart className="w-4 h-4 text-rose-500" />,
    },
    {
      id: 'm-4',
      date: 'Ongoing',
      title: 'Smoke-Free Cellular Repair Milestone',
      badge: 'In Progress',
      desc: '7+ days smoke free! Over $80 saved and 140 cigarettes bypassed.',
      icon: <Shield className="w-4 h-4 text-indigo-600" />,
    },
  ];

  // Compare first week vs current week
  const firstWeek = dailyLogs.slice(0, 7);
  const recentWeek = dailyLogs.slice(-7);

  const firstWeekAvgSteps = Math.round(firstWeek.reduce((a, b) => a + b.steps, 0) / (firstWeek.length || 1));
  const recentWeekAvgSteps = Math.round(recentWeek.reduce((a, b) => a + b.steps, 0) / (recentWeek.length || 1));

  const firstWeekAvgSleep = (firstWeek.reduce((a, b) => a + b.sleepHours, 0) / (firstWeek.length || 1)).toFixed(1);
  const recentWeekAvgSleep = (recentWeek.reduce((a, b) => a + b.sleepHours, 0) / (recentWeek.length || 1)).toFixed(1);

  return (
    <div className="space-y-4 mb-4">
      {/* Before / After Metrics Comparison (No weight or body photos) */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Before & After
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Your Metric Progression
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          Celebrating stamina, restorative sleep, and cardiovascular calm. Strictly body-neutral with zero weight shame.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-2">
          {/* Sleep Progression */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
              Sleep Duration
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-slate-400 font-mono line-through">{firstWeekAvgSleep}h</span>
              <span className="text-lg font-bold text-teal-700 font-mono">{recentWeekAvgSleep} hrs</span>
            </div>
            <span className="text-[10px] text-teal-700 font-medium">+30 mins deeper rest</span>
          </div>

          {/* Daily Movement */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
              Daily Movement
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-slate-400 font-mono line-through">{firstWeekAvgSteps.toLocaleString()}</span>
              <span className="text-lg font-bold text-teal-700 font-mono">{recentWeekAvgSteps.toLocaleString()}</span>
            </div>
            <span className="text-[10px] text-teal-700 font-medium">+820 natural daily steps</span>
          </div>
        </div>
      </div>

      {/* Milestone Timeline */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          Journey Milestones
        </h3>

        <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {milestones.map((m) => (
            <div key={m.id} className="relative pl-8">
              {/* Timeline marker */}
              <div className="absolute left-1 top-0.5 w-4 h-4 rounded-full bg-white border-2 border-teal-600 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-semibold text-teal-800">
                    {m.date}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold">
                    {m.badge}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-0.5">
                  {m.title}
                </h4>
                <p className="text-[11px] text-slate-600 leading-normal">
                  {m.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
