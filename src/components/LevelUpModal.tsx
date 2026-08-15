import React from 'react';
import { Trophy, Sparkles, Award, ArrowRight } from 'lucide-react';
import { playSound } from '../utils/audio';

interface LevelUpModalProps {
  newLevel: number;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ newLevel, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border-2 border-amber-300 rounded-3xl max-w-sm w-full p-8 text-center shadow-2xl relative animate-in fade-in zoom-in duration-300 border-b-4 border-amber-400">
        
        <div className="w-24 h-24 rounded-3xl bg-amber-400 text-amber-950 flex items-center justify-center mx-auto mb-4 shadow-lg border-2 border-amber-500 animate-bounce">
          <Trophy className="w-12 h-12 stroke-[2.5]" />
        </div>

        <div className="text-xs uppercase font-black tracking-widest text-amber-700 mb-1">
          Level Up!
        </div>

        <h2 className="text-3xl font-black text-slate-900 mb-2">
          Rank {newLevel} Reached
        </h2>

        <p className="text-xs text-slate-600 font-medium leading-relaxed mb-6">
          Your coding stamina and algorithmic precision have increased. Keep advancing through daily challenges!
        </p>

        <div className="p-3.5 bg-amber-50 border-2 border-amber-200 rounded-2xl mb-6 text-xs text-amber-950 font-bold">
          <div className="font-black flex items-center justify-center gap-1 text-amber-800 mb-0.5">
            <Sparkles className="w-4 h-4 text-amber-600" /> Level Perk Unlocked
          </div>
          <span>+50 Bonus Gems & Health Maximize</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:border-b-0 active:translate-y-0.5 border-b-4 border-indigo-800 text-white font-black text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Claim & Continue</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>

      </div>
    </div>
  );
};
