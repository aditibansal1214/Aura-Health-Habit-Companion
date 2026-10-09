import React from 'react';
import { X, BookOpen, Clock, ShieldCheck } from 'lucide-react';

interface MicroLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  explanation: string;
  source: string;
  estimatedSeconds?: number;
}

export const MicroLessonModal: React.FC<MicroLessonModalProps> = ({
  isOpen,
  onClose,
  title,
  explanation,
  source,
  estimatedSeconds = 30,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-100 transition-transform animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle for mobile */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold tracking-wider text-teal-700 uppercase">
                Why This Works
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                <span>{estimatedSeconds}-second micro-lesson</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
          {title}
        </h3>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
          <p className="text-sm text-slate-700 leading-relaxed">
            {explanation}
          </p>
        </div>

        <div className="flex items-start gap-2 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100/80 mb-5">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-900">
            <span className="font-semibold">Evidence Basis: </span>
            <span>{source}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold flex items-center justify-center transition-all active:scale-[0.98]"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
