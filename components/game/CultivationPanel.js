'use client';
import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { CultivationEngine } from '@/lib/gameEngine/cultivation';

export default function CultivationPanel() {
  const { player, cultivate } = useGameStore();
  const [cultivationAmount, setCultivationAmount] = useState(10);
  
  const handleCultivate = () => {
    const speed = CultivationEngine.getCultivationSpeed(player);
    const actualAmount = cultivationAmount * speed;
    cultivate(actualAmount);
  };

  const cultivationSpeed = CultivationEngine.getCultivationSpeed(player);
  const efficiency = CultivationEngine.getCultivationEfficiency(player);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-cultivation-primary mb-4">
        Cultivation Chamber
      </h2>
      
      <div className="space-y-4">
        <div className="flex gap-4 items-center">
          <input
            type="range"
            min="5"
            max="50"
            value={cultivationAmount}
            onChange={(e) => setCultivationAmount(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm font-medium">{cultivationAmount} Qi</span>
          <button
            onClick={handleCultivate}
            className="bg-cultivation-primary text-white px-4 py-2 rounded hover:bg-cultivation-secondary transition-colors"
          >
            Cultivate
          </button>
        </div>
        
        <div className="text-sm text-gray-600 space-y-2">
          <p>Current Speed: {cultivationSpeed.toFixed(2)}x</p>
          <p>Realm: {player.cultivation.realm}</p>
          <p>Intelligence Bonus: +{player.stats.intelligence}%</p>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-2">Cultivation Techniques</h3>
          <p className="text-sm text-gray-500">No techniques learned yet</p>
        </div>
      </div>
    </div>
  );
}