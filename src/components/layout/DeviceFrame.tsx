import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Smartphone, Sliders, Globe, Eye, Volume2, VolumeX, Moon } from 'lucide-react';
import { DeviceFrameType, UserPreferences } from '../../types/health';
import { soundService } from '../../services/sound';

interface DeviceFrameProps {
  children: React.ReactNode;
  frameType: DeviceFrameType;
  onChangeFrame: (type: DeviceFrameType) => void;
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  onOpenFeatureFlags: () => void;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  frameType,
  onChangeFrame,
  preferences,
  onUpdatePreferences,
  onOpenFeatureFlags,
}) => {
  const [timeStr, setTimeStr] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hours = d.getHours().toString().padStart(2, '0');
      const minutes = d.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const newSound = !preferences.soundEnabled;
    soundService.setEnabled(newSound);
    if (newSound) soundService.playTap();
    onUpdatePreferences({ soundEnabled: newSound });
  };

  const handleToggleLanguage = () => {
    soundService.playTap();
    onUpdatePreferences({ language: preferences.language === 'en' ? 'hi' : 'en' });
  };

  const handleToggleReadingLevel = () => {
    soundService.playTap();
    onUpdatePreferences({
      readingLevel: preferences.readingLevel === 'standard' ? 'simple' : 'standard',
    });
  };

  const handleToggleLargeText = () => {
    soundService.playTap();
    onUpdatePreferences({ largeText: !preferences.largeText });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-start p-2 sm:p-6 select-none font-sans">
      {/* Top Controls Toolbar */}
      <header className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 mb-4 px-2 no-print">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-teal-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow-sm">
            A
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">
              Aura Health & Habit
            </h1>
            <span className="text-[11px] text-slate-400">
              Mobile Companion (iOS & Android Native Shell)
            </span>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {/* Device Frame Switcher */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => {
                soundService.playTap();
                onChangeFrame('iphone');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                frameType === 'iphone' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              iOS
            </button>
            <button
              onClick={() => {
                soundService.playTap();
                onChangeFrame('pixel');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                frameType === 'pixel' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Android
            </button>
            <button
              onClick={() => {
                soundService.playTap();
                onChangeFrame('fullscreen');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                frameType === 'fullscreen' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Full
            </button>
          </div>

          {/* Language Toggle (EN / HI) */}
          <button
            onClick={handleToggleLanguage}
            title="Toggle English / Hindi language"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
          >
            <Globe className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-semibold">{preferences.language === 'en' ? 'EN' : 'हिन्दी'}</span>
          </button>

          {/* Reading Level (Simple / Standard) */}
          <button
            onClick={handleToggleReadingLevel}
            title="Toggle Simple / Standard reading level"
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium"
          >
            <span>{preferences.readingLevel === 'simple' ? 'Simple Words' : 'Standard'}</span>
          </button>

          {/* Large Text Mode */}
          <button
            onClick={handleToggleLargeText}
            title="Toggle Large Text mode"
            className={`px-2.5 py-1.5 rounded-xl border transition-all ${
              preferences.largeText
                ? 'bg-teal-500 text-slate-950 font-bold border-teal-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            A+
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            title="Toggle Web Audio tactile sound"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
          >
            {preferences.soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-teal-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {/* 20 Feature Flags Manager */}
          <button
            onClick={() => {
              soundService.playTap();
              onOpenFeatureFlags();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shadow-xs transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>20 Features</span>
          </button>
        </div>
      </header>

      {/* Device Shell Canvas */}
      <main
        className={`w-full transition-all duration-300 flex justify-center ${
          frameType === 'fullscreen' ? 'max-w-md sm:max-w-lg' : 'max-w-sm sm:max-w-[420px]'
        }`}
      >
        <div
          className={`w-full bg-slate-50 text-slate-900 overflow-hidden relative shadow-2xl transition-all duration-300 ${
            preferences.largeText ? 'text-base' : 'text-sm'
          } ${
            frameType === 'iphone'
              ? 'rounded-[48px] border-[8px] border-slate-800 ring-1 ring-slate-700/60 min-h-[820px] max-h-[880px] flex flex-col'
              : frameType === 'pixel'
              ? 'rounded-[40px] border-[6px] border-slate-800 min-h-[820px] max-h-[880px] flex flex-col'
              : 'rounded-3xl border border-slate-700 min-h-[820px] flex flex-col'
          }`}
        >
          {/* Mobile Status Bar */}
          <div className="w-full pt-3 px-6 pb-1 flex items-center justify-between text-xs text-slate-800 font-semibold shrink-0 z-30 select-none">
            <span className="font-mono tracking-tight text-xs">{timeStr}</span>

            {/* Dynamic Island for iPhone */}
            {frameType === 'iphone' && (
              <div className="w-24 h-5 bg-black rounded-full mx-auto -mt-1 shadow-xs flex items-center justify-end px-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
              </div>
            )}

            {/* Camera Punch Hole for Pixel */}
            {frameType === 'pixel' && (
              <div className="w-3.5 h-3.5 bg-black rounded-full mx-auto -mt-1 shadow-xs" />
            )}

            <div className="flex items-center gap-2 text-slate-700">
              <span className="text-[10px] font-mono tracking-tight">5G</span>
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Screen Content Container */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-24 px-4 pt-2">
            {children}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="absolute bottom-1 left-0 right-0 h-4 flex items-center justify-center pointer-events-none z-30">
            <div
              className={`h-1 rounded-full bg-slate-400/80 ${
                frameType === 'pixel' ? 'w-24' : 'w-32'
              }`}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
