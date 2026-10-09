import React, { useState } from 'react';
import { Users, UserPlus, Heart, Shield, Lock, Send, Sparkles, X, Check } from 'lucide-react';
import { AccountabilityPartner } from '../../types/health';
import { soundService } from '../../services/sound';

interface AccountabilityCircleSheetProps {
  isOpen: boolean;
  onClose: () => void;
  partners: AccountabilityPartner[];
  onAddPartner: (partner: Omit<AccountabilityPartner, 'id'>) => void;
  onSendCheer: (partnerId: string, cheer: AccountabilityPartner['lastCheer']) => void;
}

export const AccountabilityCircleSheet: React.FC<AccountabilityCircleSheetProps> = ({
  isOpen,
  onClose,
  partners,
  onAddPartner,
  onSendCheer,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('Partner');
  const [shareStreaks, setShareStreaks] = useState(true);
  const [shareGoals, setShareGoals] = useState(true);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || partners.length >= 3) return;

    soundService.playWin();
    onAddPartner({
      name: newName.trim(),
      relation: newRelation,
      avatar: newName.trim().charAt(0).toUpperCase(),
      sharedFields: {
        streaks: shareStreaks,
        weeklyGoalMet: shareGoals,
        vitals: false, // Strict default shield
      },
    });
    setNewName('');
    setIsAdding(false);
  };

  const handleSendReaction = (partnerId: string, type: 'cheer' | 'heart' | 'relaxed') => {
    soundService.playWin();
    const messages = {
      cheer: 'Cheering for your calm consistency today! 🎉',
      heart: 'Thinking of you! Take it gently today 💛',
      relaxed: 'No pressure at all — proud of you ☕',
    };
    onSendCheer(partnerId, {
      type,
      message: messages[type],
      timestamp: 'Just now',
    });
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
            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-indigo-800 uppercase tracking-wide">
                Private & Opt-In
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Accountability Circle ({partners.length}/3)
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

        {/* Strict Privacy Shield Guarantee */}
        <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 mb-4 flex items-start gap-2.5 text-xs text-indigo-950">
          <Lock className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Strict Vital Privacy Shield: </span>
            <span className="text-[11px] text-indigo-900 leading-relaxed">
              Your raw vitals (BP, heart rate) and weight are NEVER shared. Partners can only see streak continuation and celebrate your consistency. No leaderboards.
            </span>
          </div>
        </div>

        {/* Partner list */}
        <div className="space-y-3 mb-4">
          {partners.map((p) => (
            <div key={p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-teal-600 text-white font-bold text-sm flex items-center justify-center">
                    {p.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{p.name}</h4>
                    <span className="text-[10px] text-slate-500">{p.relation}</span>
                  </div>
                </div>

                <div className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Shared: Streaks only
                </div>
              </div>

              {/* Last Cheer Message */}
              {p.lastCheer && (
                <div className="p-2.5 bg-white rounded-xl border border-slate-100 mb-3 text-xs text-slate-700 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-medium leading-tight">{p.lastCheer.message}</p>
                    <span className="text-[9px] text-slate-400">{p.lastCheer.timestamp}</span>
                  </div>
                </div>
              )}

              {/* Send Cheer Reactions */}
              <div className="flex items-center gap-1.5 pt-1 border-t border-slate-200/60">
                <span className="text-[10px] text-slate-500 font-medium mr-1">Cheer:</span>
                <button
                  onClick={() => handleSendReaction(p.id, 'cheer')}
                  className="px-2 py-1 rounded-lg bg-white hover:bg-teal-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-1"
                >
                  <span>🎉 Cheer</span>
                </button>
                <button
                  onClick={() => handleSendReaction(p.id, 'heart')}
                  className="px-2 py-1 rounded-lg bg-white hover:bg-rose-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-1"
                >
                  <span>💛 Care</span>
                </button>
                <button
                  onClick={() => handleSendReaction(p.id, 'relaxed')}
                  className="px-2 py-1 rounded-lg bg-white hover:bg-amber-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-1"
                >
                  <span>☕ Rest</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Invite up to 3 partners button */}
        {partners.length < 3 && !isAdding && (
          <button
            onClick={() => {
              soundService.playTap();
              setIsAdding(true);
            }}
            className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors mb-2"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite Trusted Person ({3 - partners.length} slots left)</span>
          </button>
        )}

        {/* Add Partner Form */}
        {isAdding && (
          <form onSubmit={handleCreate} className="p-4 bg-slate-100/90 rounded-2xl border border-slate-200 space-y-3 mb-2 animate-in fade-in">
            <h4 className="text-xs font-bold text-slate-900">Invite Trusted Contact</h4>
            <div>
              <label className="text-[10px] text-slate-600 block mb-1">Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Sam"
                className="w-full h-8 px-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
                required
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-600 block mb-1">Relationship</label>
              <select
                value={newRelation}
                onChange={(e) => setNewRelation(e.target.value)}
                className="w-full h-8 px-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900"
              >
                <option value="Partner">Partner</option>
                <option value="Close Friend">Close Friend</option>
                <option value="Care Coach">Care Coach</option>
                <option value="Family Member">Family Member</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 h-9 rounded-xl bg-slate-900 text-white text-xs font-semibold"
              >
                Send Invite
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 h-9 rounded-xl bg-slate-200 text-slate-700 text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
