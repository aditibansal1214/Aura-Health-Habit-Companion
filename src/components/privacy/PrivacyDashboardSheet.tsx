import React, { useState } from 'react';
import { Shield, Lock, Download, Trash2, EyeOff, Server, Database, Check, AlertTriangle, X } from 'lucide-react';
import { StorageService } from '../../services/storage';
import { soundService } from '../../services/sound';

interface PrivacyDashboardSheetProps {
  isOpen: boolean;
  onClose: () => void;
  researchContribution: boolean;
  onToggleResearch: () => void;
  onResetData: () => void;
}

export const PrivacyDashboardSheet: React.FC<PrivacyDashboardSheetProps> = ({
  isOpen,
  onClose,
  researchContribution,
  onToggleResearch,
  onResetData,
}) => {
  const [exported, setExported] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    soundService.playWin();
    const data = StorageService.exportAllDataJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura-health-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  const handleDeleteAll = () => {
    soundService.playTap();
    StorageService.clearAllData();
    onResetData();
    setShowConfirmDelete(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wide">
                Privacy Dashboard
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Who Can See My Data?
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          Your personal health logs belong exclusively to you. No behavioral ad networks, no third-party data broker sales.
        </p>

        {/* Visual Data Map */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">
            Interactive Data Map
          </h4>

          <div className="space-y-2.5 text-xs">
            {/* Storage Node 1: On-Device Local */}
            <div className="p-3 bg-white rounded-xl border border-emerald-200 flex items-start gap-2.5">
              <Database className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-slate-900">On-Device Storage</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    100% Stored Locally
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  BP logs, habits, mood, sleep, and quit-smoking milestones reside directly in your phone’s sandboxed local storage.
                </p>
              </div>
            </div>

            {/* Storage Node 2: Accountability Circle */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-slate-900">Shared Accountability</span>
                  <span className="text-[10px] text-slate-500 font-medium">Restricted</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Only contacts you explicitly invite. Raw vitals & weight are permanently blocked from sharing.
                </p>
              </div>
            </div>

            {/* Storage Node 3: Cloud / Advertising */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
              <EyeOff className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-slate-900">Ad Trackers & Brokers</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                    Zero / Prohibited
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  No Facebook SDKs, no ad pixels, no commercial analytics tracking.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Research Contribution Toggle */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-900">Research Contribution</p>
            <p className="text-[11px] text-slate-500">
              Share anonymized habit timing patterns with universities.
            </p>
          </div>
          <button
            onClick={() => {
              soundService.playTap();
              onToggleResearch();
            }}
            className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center ${
              researchContribution ? 'bg-teal-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                researchContribution ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 1-Tap Export and 1-Tap Delete */}
        <div className="space-y-2 mb-2">
          <button
            onClick={handleExportJSON}
            className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{exported ? 'Data Export Downloaded!' : 'Export All Data (JSON / CSV)'}</span>
          </button>

          {!showConfirmDelete ? (
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="w-full py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete All Data From Device</span>
            </button>
          ) : (
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs space-y-2 text-rose-900">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Confirm Total Deletion</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                This will erase all local logs, streaks, and BP readings permanently.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAll}
                  className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs"
                >
                  Yes, Erase Everything
                </button>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-800 rounded-lg text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
