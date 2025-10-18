'use client';
import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { CombatEngine } from '@/lib/gameEngine/combat';

export default function CombatSystem() {
  const { 
    player, 
    combat, 
    startCombat, 
    playerAttack, 
    fleeCombat,
    addItem,
    healFull
  } = useGameStore();
  
  const [availableEnemies, setAvailableEnemies] = useState([]);

  // Generate enemies based on player level
  useEffect(() => {
    const enemies = [];
    for (let i = 0; i < 3; i++) {
      enemies.push(CombatEngine.generateEnemy(player.cultivation.stage));
    }
    setAvailableEnemies(enemies);
  }, [player.cultivation.stage]);

  const handleStartCombat = (enemy) => {
    startCombat({ ...enemy });
  };

  const handleUseItem = (itemType) => {
    // Simplified item usage for combat
    switch (itemType) {
      case 'healing-pill':
        healFull();
        addItem({ type: 'healing-pill', name: 'Healing Pill' }, -1); // Remove item
        break;
    }
  };

  const canFlee = () => {
    return player.stats.agility > (combat.currentEnemy?.stats.agility || 10);
  };

  if (combat.inCombat) {
    return (
      <div className="bg-gradient-to-br from-red-900 to-gray-800 rounded-2xl shadow-2xl border border-red-500/30 p-6 text-white">
        <h2 className="text-2xl font-bold text-red-300 mb-6 flex items-center gap-3">
          ⚔️ Combat
        </h2>

        {/* Combatants */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Player */}
          <div className="bg-gradient-to-br from-green-900 to-gray-800 rounded-xl p-4 border border-green-500/30">
            <h3 className="font-bold text-lg text-green-300 mb-3">{player.name}</h3>
            
            {/* Health Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Health</span>
                <span>{player.health}/{player.maxHealth}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Qi Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Qi</span>
                <span>{Math.floor(player.cultivation.qi)}/{player.cultivation.maxQi}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(player.cultivation.qi / player.cultivation.maxQi) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center p-1 bg-white/5 rounded">
                <div>💪 {player.stats.strength}</div>
              </div>
              <div className="text-center p-1 bg-white/5 rounded">
                <div>🏃 {player.stats.agility}</div>
              </div>
            </div>
          </div>

          {/* Enemy */}
          <div className="bg-gradient-to-br from-red-900 to-gray-800 rounded-xl p-4 border border-red-500/30">
            <h3 className="font-bold text-lg text-red-300 mb-3">{combat.currentEnemy.name}</h3>
            
            {/* Health Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Health</span>
                <span>{combat.currentEnemy.health}/{combat.currentEnemy.maxHealth}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-red-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(combat.currentEnemy.health / combat.currentEnemy.maxHealth) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center p-1 bg-white/5 rounded">
                <div>💪 {combat.currentEnemy.stats.strength}</div>
              </div>
              <div className="text-center p-1 bg-white/5 rounded">
                <div>🏃 {combat.currentEnemy.stats.agility}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Combat Log */}
        <div className="bg-black/40 rounded-xl p-4 border border-white/10 mb-6">
          <h4 className="font-semibold mb-3 text-gray-300">Combat Log</h4>
          <div className="h-32 overflow-y-auto space-y-2 text-sm">
            {combat.combatLog.map((log, index) => (
              <div 
                key={index} 
                className={`p-2 rounded ${
                  log.type === 'player_attack' ? 'bg-green-500/20 text-green-300' :
                  log.type === 'enemy_attack' ? 'bg-red-500/20 text-red-300' :
                  log.type === 'victory' ? 'bg-yellow-500/20 text-yellow-300' :
                  log.type === 'defeat' ? 'bg-red-500/20 text-red-300' :
                  'bg-blue-500/20 text-blue-300'
                }`}
              >
                {log.message}
              </div>
            ))}
          </div>
        </div>

        {/* Combat Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={playerAttack}
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
          >
            <span>⚔️</span>
            <span>Attack</span>
          </button>
          
          <button
            onClick={fleeCombat}
            disabled={!canFlee()}
            className="bg-gradient-to-r from-gray-600 to-blue-600 hover:from-gray-700 hover:to-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
          >
            <span>🏃</span>
            <span>Flee {!canFlee() && '(Low Agility)'}</span>
          </button>
        </div>

        {/* Quick Items */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => handleUseItem('healing-pill')}
            disabled={!player.inventory.find(item => item.type === 'healing-pill')}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-white py-2 rounded transition-all duration-300 text-sm flex items-center justify-center gap-1"
          >
            <span>💊</span>
            <span>Heal</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-white/10 p-6 text-white">
      <h2 className="text-2xl font-bold text-red-300 mb-6 flex items-center gap-3">
        ⚔️ Combat Training
      </h2>

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3">Available Enemies</h3>
        <div className="grid gap-3">
          {availableEnemies.map((enemy, index) => (
            <div key={index} className="bg-black/30 rounded-xl p-4 border border-white/10">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-red-300">{enemy.name}</h4>
                <div className="text-sm text-gray-400">
                  Level: {Math.floor(enemy.maxHealth / 30)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Health:</span>
                    <span>{enemy.health}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Strength:</span>
                    <span>{enemy.stats.strength}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleStartCombat(enemy)}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-2 rounded transition-all duration-300"
              >
                Challenge
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Combat Stats */}
      <div className="bg-black/30 rounded-xl p-4 border border-white/10">
        <h3 className="font-semibold mb-3">Your Combat Stats</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Strength:</span>
              <span className="text-red-400">{player.stats.strength}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Agility:</span>
              <span className="text-green-400">{player.stats.agility}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Vitality:</span>
              <span className="text-purple-400">{player.stats.vitality}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Health:</span>
              <span className="text-red-300">{player.health}/{player.maxHealth}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}