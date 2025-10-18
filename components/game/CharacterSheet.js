'use client';
import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { CultivationEngine } from '@/lib/gameEngine/cultivation';

export default function CharacterSheet() {
  const { 
    player, 
    breakthrough, 
    saveGame, 
    isLoading, 
    error,
    clearError
  } = useGameStore();
  
  const progress = CultivationEngine.getProgressPercentage(player.cultivation);
  const canBreakthrough = CultivationEngine.canBreakthrough(player.cultivation);
  const nextRealm = CultivationEngine.getNextRealmInfo(player.cultivation.realm);
  const breakthroughCost = CultivationEngine.calculateBreakthroughCost(
    player.cultivation.realm, 
    player.cultivation.stage
  );

  // Clear errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const getRealmGradient = () => {
    const gradients = {
      'Mortal': 'from-gray-500 to-gray-700',
      'Qi Condensation': 'from-green-500 to-green-700',
      'Foundation': 'from-blue-500 to-blue-700',
      'Golden Core': 'from-yellow-500 to-yellow-700',
      'Nascent Soul': 'from-purple-500 to-purple-700',
      'Immortal Emperor': 'from-rose-500 to-violet-700'
    };
    return gradients[player.cultivation.realm] || 'from-gray-500 to-gray-700';
  };

  const getRealmIcon = () => {
    const icons = {
      'Mortal': '👤',
      'Qi Condensation': '💨',
      'Foundation': '🏔️',
      'Golden Core': '☀️',
      'Nascent Soul': '👁️',
      'Immortal Emperor': '👑'
    };
    return icons[player.cultivation.realm] || '👤';
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-white/10 p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          Character Sheet
        </h2>
        <div className={`px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${getRealmGradient()}`}>
          {getRealmIcon()} {player.cultivation.realm}
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Character Info */}
      <div className="bg-black/30 rounded-xl p-4 border border-white/10 mb-4">
        <div className="text-center mb-3">
          <h3 className="text-xl font-bold text-white">{player.name}</h3>
          <p className="text-gray-400 text-sm">{player.sect} Sect</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl">{getRealmIcon()}</div>
            <div className="text-sm text-gray-400">Realm</div>
            <div className="font-bold text-white">{player.cultivation.realm}</div>
          </div>
          <div>
            <div className="text-2xl">🌀</div>
            <div className="text-sm text-gray-400">Stage</div>
            <div className="font-bold text-white">{player.cultivation.stage}</div>
          </div>
        </div>
      </div>

      {/* Health Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Health</span>
          <span className="font-mono">{player.health}/{player.maxHealth}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-red-500 to-pink-500 h-3 rounded-full transition-all duration-500 shadow-lg shadow-red-500/25"
            style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Cultivation Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Qi Accumulation</span>
          <span className="font-mono text-green-400">
            {Math.floor(player.cultivation.qi)} / {Math.floor(player.cultivation.maxQi)}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 mb-1">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500 shadow-lg shadow-green-500/25"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Progress: {progress.toFixed(1)}%</span>
          <span>Next: {Math.floor(breakthroughCost)} Qi</span>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="bg-black/30 rounded-xl p-4 border border-white/10 mb-4">
        <h3 className="font-bold text-lg mb-3 text-center text-blue-300">Cultivation Stats</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between items-center p-2 bg-white/5 rounded">
            <span className="text-gray-400">Strength:</span>
            <span className="font-bold text-red-400">{player.stats.strength}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-white/5 rounded">
            <span className="text-gray-400">Agility:</span>
            <span className="font-bold text-green-400">{player.stats.agility}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-white/5 rounded">
            <span className="text-gray-400">Intelligence:</span>
            <span className="font-bold text-blue-400">{player.stats.intelligence}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-white/5 rounded">
            <span className="text-gray-400">Vitality:</span>
            <span className="font-bold text-purple-400">{player.stats.vitality}</span>
          </div>
        </div>
      </div>

      {/* Gold & Save */}
      <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-xl p-4 border border-yellow-500/30 mb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-yellow-300 font-semibold">Spiritual Resources</span>
          <span className="text-2xl font-bold text-yellow-400">{player.gold} 🪙</span>
        </div>
        <button
          onClick={saveGame}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          {isLoading ? '🌀 Saving...' : '💾 Save Progress'}
        </button>
      </div>
      
      {/* Breakthrough Button */}
      {canBreakthrough && (
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30 mb-4">
          <h3 className="font-bold text-lg mb-2 text-purple-300 text-center">
            ⚡ Breakthrough Available!
          </h3>
          <p className="text-sm text-purple-200 text-center mb-3">
            Ready to advance to {
              player.cultivation.stage === CultivationEngine.REALMS[player.cultivation.realm].maxStage && nextRealm
                ? `${nextRealm.name} Realm`
                : `Stage ${player.cultivation.stage + 1}`
            }
          </p>
          <button
            onClick={breakthrough}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg shadow-purple-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            🌀 Breakthrough Now
          </button>
        </div>
      )}
      
      {/* Next Realm Info */}
      {nextRealm && (
        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-500/30">
          <h3 className="font-bold text-lg mb-2 text-blue-300 text-center">
            Next Realm: {nextRealm.name}
          </h3>
          <p className="text-sm text-blue-200 text-center mb-3">{nextRealm.description}</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-blue-300">
            <div className="text-center">
              <div>❤️ +{nextRealm.healthBonus} HP</div>
            </div>
            <div className="text-center">
              <div>🧠 +{nextRealm.statBonus.intelligence} INT</div>
            </div>
            <div className="text-center">
              <div>💪 +{nextRealm.statBonus.strength} STR</div>
            </div>
            <div className="text-center">
              <div>🏃 +{nextRealm.statBonus.agility} AGI</div>
            </div>
          </div>
        </div>
      )}

      {/* Location Info */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">📍 Current Location</span>
          <span className="text-white font-semibold capitalize">{player.location.replace('-', ' ')}</span>
        </div>
      </div>
    </div>
  );
}