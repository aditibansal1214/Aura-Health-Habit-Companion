import React from 'react';

interface MascotProps {
  mood?: 'calm' | 'energized' | 'resting' | 'celebrating';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const DelightMascot: React.FC<MascotProps> = ({
  mood = 'calm',
  size = 'md',
  label,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const getGradient = () => {
    switch (mood) {
      case 'energized':
        return 'from-amber-300 via-orange-300 to-emerald-300';
      case 'resting':
        return 'from-indigo-300 via-sky-300 to-purple-300';
      case 'celebrating':
        return 'from-teal-300 via-emerald-300 to-yellow-300';
      case 'calm':
      default:
        return 'from-teal-200 via-cyan-200 to-sky-200';
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className={`relative ${sizeMap[size]} rounded-full bg-gradient-to-tr ${getGradient()} p-1 shadow-md shadow-teal-500/10 flex items-center justify-center transition-all duration-500 animate-pulse`}
        style={{ animationDuration: mood === 'resting' ? '4s' : '2.5s' }}
      >
        {/* Mascot Face */}
        <div className="w-full h-full rounded-full bg-white/70 dark:bg-slate-900/40 backdrop-blur-sm flex flex-col items-center justify-center relative overflow-hidden">
          {/* Subtle blush */}
          <div className="absolute w-2 h-1 bg-rose-300/40 rounded-full left-2 bottom-3" />
          <div className="absolute w-2 h-1 bg-rose-300/40 rounded-full right-2 bottom-3" />

          {/* Eyes */}
          <div className="flex items-center gap-2 mb-0.5">
            {mood === 'resting' ? (
              <>
                <div className="w-2.5 h-1 border-b-2 border-slate-700 dark:border-slate-300 rounded-full" />
                <div className="w-2.5 h-1 border-b-2 border-slate-700 dark:border-slate-300 rounded-full" />
              </>
            ) : mood === 'celebrating' ? (
              <>
                <div className="w-2 h-2 text-slate-800 dark:text-slate-200 text-[10px] font-bold">^</div>
                <div className="w-2 h-2 text-slate-800 dark:text-slate-200 text-[10px] font-bold">^</div>
              </>
            ) : (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-800 dark:bg-slate-200" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-800 dark:bg-slate-200" />
              </>
            )}
          </div>

          {/* Gentle Smile */}
          <div className="w-2.5 h-1 border-b-2 border-slate-700 dark:border-slate-300 rounded-full" />
        </div>
      </div>
      {label && (
        <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mt-1.5 tracking-tight">
          {label}
        </span>
      )}
    </div>
  );
};
