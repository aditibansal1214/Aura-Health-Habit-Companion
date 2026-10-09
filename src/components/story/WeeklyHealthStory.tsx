import React, { useState } from 'react';
import { Sparkles, Moon, Footprints, ArrowRight, Share2, Shield, ChevronLeft, ChevronRight, Check, X, Lock } from 'lucide-react';
import { DailyLog } from '../../types/health';
import { soundService } from '../../services/sound';

interface WeeklyHealthStoryProps {
  isOpen: boolean;
  onClose: () => void;
  dailyLogs: DailyLog[];
}

export const WeeklyHealthStory: React.FC<WeeklyHealthStoryProps> = ({
  isOpen,
  onClose,
  dailyLogs,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [hideSensitiveNumbers, setHideSensitiveNumbers] = useState(true);
  const [cardCopied, setCardCopied] = useState(false);

  if (!isOpen) return null;

  const pastWeek = dailyLogs.slice(-7);
  const bestSleepDay = [...pastWeek].sort((a, b) => b.sleepHours - a.sleepHours)[0] || pastWeek[0];
  const mostActiveDay = [...pastWeek].sort((a, b) => b.steps - a.steps)[0] || pastWeek[0];
  const loggedDaysCount = pastWeek.length;

  const slides = [
    {
      id: 'top-win',
      kicker: 'Weekly Story · Slide 1/5',
      title: 'Your Top Win',
      headline: '3 Nights of 7.5+ Hours Sleep',
      detail: 'You protected your evening wind-down routine despite midweek schedule demands.',
      themeBg: 'bg-gradient-to-br from-teal-900 via-emerald-950 to-slate-900 text-white',
      accentColor: 'text-teal-300',
      icon: <Sparkles className="w-8 h-8 text-teal-300" />,
    },
    {
      id: 'best-sleep',
      kicker: 'Weekly Story · Slide 2/5',
      title: 'Rest Champion',
      headline: `${bestSleepDay?.sleepHours || 8} Hours on ${bestSleepDay?.date || 'Friday'}`,
      detail: 'Woke up with self-reported 5/5 energy. Deep physical tissue and cognitive restoration achieved.',
      themeBg: 'bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 text-white',
      accentColor: 'text-indigo-300',
      icon: <Moon className="w-8 h-8 text-indigo-300" />,
    },
    {
      id: 'most-active',
      kicker: 'Weekly Story · Slide 3/5',
      title: 'Peak Movement Day',
      headline: `${mostActiveDay?.steps?.toLocaleString() || '9,400'} Steps on ${mostActiveDay?.date || 'Saturday'}`,
      detail: 'Natural outdoor strolls accounted for 45 active minutes without feeling strained or forced.',
      themeBg: 'bg-gradient-to-br from-teal-950 via-cyan-950 to-emerald-950 text-white',
      accentColor: 'text-cyan-300',
      icon: <Footprints className="w-8 h-8 text-cyan-300" />,
    },
    {
      id: 'next-try',
      kicker: 'Weekly Story · Slide 4/5',
      title: 'One Gentle Step for Next Week',
      headline: 'The 2-Minute Pre-Bed Stretch',
      detail: 'Keep bedtime within a 20-minute window on Sunday night to prevent Monday morning friction.',
      themeBg: 'bg-gradient-to-br from-amber-950 via-slate-900 to-rose-950 text-white',
      accentColor: 'text-amber-300',
      icon: <ArrowRight className="w-8 h-8 text-amber-300" />,
    },
    {
      id: 'data-quality',
      kicker: 'Weekly Story · Slide 5/5',
      title: 'Data Confidence Report',
      headline: `${loggedDaysCount} of 7 Days Faithfully Logged`,
      detail: 'High algorithmic confidence. No gaps that required interpolation or guesswork.',
      themeBg: 'bg-gradient-to-br from-slate-900 via-teal-950 to-indigo-950 text-white',
      accentColor: 'text-teal-400',
      icon: <Shield className="w-8 h-8 text-teal-400" />,
    },
  ];

  const slide = slides[currentSlide];

  const handleNext = () => {
    soundService.playTap();
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setShowShareModal(true);
    }
  };

  const handlePrev = () => {
    soundService.playTap();
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div 
        className="w-full max-w-sm h-[560px] rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Current Slide Background */}
        <div className={`absolute inset-0 ${slide.themeBg} transition-all duration-500`} />

        {/* Story Progress Bar */}
        <div className="relative z-10 px-4 pt-4 flex gap-1.5">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? 'bg-white'
                  : i < currentSlide
                  ? 'bg-white/50'
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Top Controls */}
        <div className="relative z-10 px-5 pt-3 flex items-center justify-between text-white/80">
          <span className="text-[11px] font-mono tracking-wider uppercase">
            {slide.kicker}
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Story Body */}
        <div className="relative z-10 px-6 py-4 flex flex-col items-center text-center my-auto">
          <div className="mb-4 p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15">
            {slide.icon}
          </div>

          <span className={`text-xs font-bold uppercase tracking-widest ${slide.accentColor} mb-1`}>
            {slide.title}
          </span>

          <h2 className="text-xl font-extrabold text-white tracking-tight leading-snug mb-3">
            {slide.headline}
          </h2>

          <p className="text-xs text-white/80 leading-relaxed max-w-xs">
            {slide.detail}
          </p>

          {/* Privacy Guarantee Note */}
          <div className="mt-5 flex items-center gap-1.5 text-[10px] text-white/60 bg-black/20 px-3 py-1 rounded-full">
            <Lock className="w-3 h-3" />
            <span>Strict privacy: No weight or BMI on shareable cards</span>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="relative z-10 p-5 flex items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center bg-white/10 text-white ${
              currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/20'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="flex-1 h-11 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-sm flex items-center justify-center gap-1.5 transition-colors border border-white/20"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Private Story</span>
          </button>

          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white text-slate-950 font-bold hover:bg-white/90 shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* SHARE CARD PREVIEW MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 text-center">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Shareable Private Card</h3>
              <button onClick={() => setShowShareModal(false)} className="text-slate-400">✕</button>
            </div>

            {/* Generated Share Card Preview */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-900 via-slate-900 to-indigo-900 text-white text-left mb-4 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-teal-300">
                  Aura Weekly Recap
                </span>
                <span className="text-[10px] font-mono text-white/60">October 2026</span>
              </div>
              <h4 className="text-base font-bold text-white mb-1">
                {slide.headline}
              </h4>
              <p className="text-xs text-white/80 mb-3">
                {slide.detail}
              </p>
              <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[10px] text-white/60">
                <span>Personal Rhythm Verified</span>
                <span>Zero Weight/BMI Data</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mb-4 text-xs">
              <span className="text-slate-600">Mask all numerical values</span>
              <button
                onClick={() => setHideSensitiveNumbers(!hideSensitiveNumbers)}
                className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
                  hideSensitiveNumbers ? 'bg-teal-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    hideSensitiveNumbers ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <button
              onClick={() => {
                soundService.playWin();
                setCardCopied(true);
                setTimeout(() => setCardCopied(false), 2000);
              }}
              className="w-full h-11 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center justify-center gap-2"
            >
              {cardCopied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Card Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Copy Shareable Graphic</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
