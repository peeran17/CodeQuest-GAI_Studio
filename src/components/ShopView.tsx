import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Diamond, 
  Shield, 
  HeartPulse, 
  Zap, 
  Palette, 
  Terminal, 
  Sunset, 
  Check, 
  Sparkles,
  Lock
} from 'lucide-react';
import { ShopItem, UserStats } from '../types';
import { SHOP_ITEMS } from '../data/badges';
import { playSound } from '../utils/audio';

interface ShopViewProps {
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({ stats, onUpdateStats }) => {
  const [purchaseSuccessId, setPurchaseSuccessId] = useState<string | null>(null);

  const handleBuyItem = (item: ShopItem) => {
    if (stats.gems < item.costGems) {
      playSound('error', stats.soundEnabled);
      return;
    }

    playSound('gem', stats.soundEnabled);
    const newGems = stats.gems - item.costGems;
    const newInventory = [...stats.inventory, item.id];

    if (item.id === 'streak_freeze') {
      onUpdateStats({
        gems: newGems,
        streakFreezeCount: stats.streakFreezeCount + 1,
        inventory: newInventory,
      });
    } else if (item.id === 'heart_refill') {
      onUpdateStats({
        gems: newGems,
        hearts: stats.maxHearts,
        inventory: newInventory,
      });
    } else if (item.id === 'double_xp') {
      onUpdateStats({
        gems: newGems,
        doubleXpRemaining: stats.doubleXpRemaining + 3,
        inventory: newInventory,
      });
    } else if (item.category === 'theme') {
      onUpdateStats({
        gems: newGems,
        themeId: item.id,
        inventory: newInventory,
      });
    }

    setPurchaseSuccessId(item.id);
    setTimeout(() => setPurchaseSuccessId(null), 2500);
  };

  const getItemIcon = (icon: string) => {
    switch (icon) {
      case 'Shield':
        return <Shield className="w-6 h-6 text-cyan-400" />;
      case 'HeartPulse':
        return <HeartPulse className="w-6 h-6 text-rose-400" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-amber-400" />;
      case 'Palette':
        return <Palette className="w-6 h-6 text-purple-400" />;
      case 'Terminal':
        return <Terminal className="w-6 h-6 text-emerald-400" />;
      case 'Sunset':
        return <Sunset className="w-6 h-6 text-orange-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-indigo-400" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Shop Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-cyan-600 via-indigo-600 to-blue-600 text-white border-b-4 border-indigo-900 p-6 sm:p-8 rounded-3xl mb-8 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 text-white border-2 border-white/30 flex items-center justify-center shadow-inner">
            <ShoppingBag className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              CodeQuest Store
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 font-medium">
              Exchange your earned challenge gems for powerups, streak freezes, and visual themes.
            </p>
          </div>
        </div>

        {/* Current Wallet Balance */}
        <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 px-5 py-2.5 rounded-2xl shadow-sm shrink-0">
          <Diamond className="w-6 h-6 text-cyan-200 fill-cyan-200 stroke-[2.5]" />
          <div>
            <div className="text-[10px] text-cyan-100 font-black uppercase tracking-wider">Your Balance</div>
            <div className="text-xl font-black text-white">{stats.gems} Gems</div>
          </div>
        </div>
      </div>

      {/* Active Boosts Indicator */}
      {(stats.doubleXpRemaining > 0 || stats.streakFreezeCount > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {stats.doubleXpRemaining > 0 && (
            <div className="p-3.5 bg-amber-50 border-2 border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-950 font-bold shadow-xs">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600 fill-amber-600" />
                <span>2X XP Boost Active ({stats.doubleXpRemaining} quests left)</span>
              </div>
            </div>
          )}
          {stats.streakFreezeCount > 0 && (
            <div className="p-3.5 bg-cyan-50 border-2 border-cyan-200 rounded-2xl flex items-center justify-between text-xs text-cyan-950 font-bold shadow-xs">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-600 stroke-[2.5]" />
                <span>{stats.streakFreezeCount} Streak Freezes equipped</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Shop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SHOP_ITEMS.map((item) => {
          const isOwned = item.category === 'theme' && stats.inventory?.includes(item.id);
          const isAffordable = stats.gems >= item.costGems;
          const isSuccess = purchaseSuccessId === item.id;

          return (
            <div
              key={item.id}
              className="bg-white border-2 border-indigo-100 rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:border-indigo-300 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-13 h-13 rounded-2xl bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                    {getItemIcon(item.icon)}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {item.category}
                  </span>
                </div>

                <h3 className="font-black text-slate-900 text-lg mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed mb-3">
                  {item.description}
                </p>
                <div className="text-xs font-black text-indigo-600 mb-4 bg-indigo-50/60 p-2 rounded-xl border border-indigo-100/60">
                  ✦ {item.effect}
                </div>
              </div>

              {/* Purchase Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-black text-cyan-700 bg-cyan-50 px-3 py-1.5 rounded-full border border-cyan-200 text-sm">
                  <Diamond className="w-4 h-4 fill-cyan-600 text-cyan-600" />
                  <span>{item.costGems}</span>
                </div>

                {isSuccess ? (
                  <span className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black flex items-center gap-1 shadow-sm">
                    <Check className="w-4 h-4 stroke-[3]" /> Purchased!
                  </span>
                ) : isOwned ? (
                  <button
                    onClick={() => {
                      playSound('click', stats.soundEnabled);
                      onUpdateStats({ themeId: item.id });
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      stats.themeId === item.id
                        ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {stats.themeId === item.id ? 'Equipped' : 'Equip'}
                  </button>
                ) : (
                  <button
                    disabled={!isAffordable}
                    onClick={() => handleBuyItem(item)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                      isAffordable
                        ? 'bg-indigo-600 hover:bg-indigo-700 active:border-b-0 active:translate-y-0.5 border-b-4 border-indigo-800 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                    }`}
                  >
                    <span>Buy Item</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
