'use client';
import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { CombatEngine } from '@/lib/gameEngine/combat';

export default function CombatSystem() {
  const { player } = useGameStore();
  const [enemy, setEnemy] = useState(null);
  const [combatLog, setCombatLog] = useState([]);
  const [inCombat, setInCombat] = useState(false);

  const startCombat = () => {
    const newEnemy = CombatEngine.generateEnemy(player.cultivation.stage);
    setEnemy(newEnemy);
    setInCombat(true);
    setCombatLog([{ type: 'info', message: `A ${newEnemy.name} appears!` }]);
  };

  const playerAttack = () => {
    if (!enemy || !inCombat) return;

    const logEntries = CombatEngine.executeTurn(player, enemy, { type: 'attack' });
    setCombatLog(prev => [...prev, ...logEntries]);

    // Check if combat ended
    if (player.health <= 0 || enemy.health <= 0) {
      setInCombat(false);
    }
  };

  const fleeCombat = () => {
    setCombatLog(prev => [...prev, { type: 'info', message: 'You fled from combat!' }]);
    setInCombat(false);
    setEnemy(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-cultivation-primary mb-4">
        Combat Training
      </h2>

      {!inCombat ? (
        <div className="text-center">
          <button
            onClick={startCombat}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            Start Combat Training
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Combatants */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded">
              <h3 className="font-bold">{player.name}</h3>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm">{player.health}/{player.maxHealth} HP</p>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded">
              <h3 className="font-bold">{enemy?.name}</h3>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${(enemy?.health / enemy?.maxHealth) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm">{enemy?.health}/{enemy?.maxHealth} HP</p>
            </div>
          </div>

          {/* Combat Log */}
          <div className="h-32 overflow-y-auto border rounded p-2 bg-gray-50">
            {combatLog.map((entry, index) => (
              <p key={index} className={`text-sm ${
                entry.type === 'player_attack' ? 'text-green-600' :
                entry.type === 'enemy_attack' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {entry.message}
              </p>
            ))}
          </div>

          {/* Combat Actions */}
          <div className="flex gap-2">
            <button
              onClick={playerAttack}
              className="flex-1 bg-cultivation-primary text-white py-2 rounded hover:bg-cultivation-secondary"
            >
              Attack
            </button>
            <button
              onClick={fleeCombat}
              className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
            >
              Flee
            </button>
          </div>
        </div>
      )}
    </div>
  );
}