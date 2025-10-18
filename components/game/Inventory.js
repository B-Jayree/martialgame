'use client';
import { useGameStore } from '@/store/gameStore';
import { ITEMS } from '@/lib/data/items';

export default function Inventory() {
  const { player, removeItem } = useGameStore();

  const handleUseItem = (item) => {
    // In a real implementation, this would apply item effects
    alert(`Used ${item.name}`);
    removeItem(item.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-cultivation-primary mb-4">
        Inventory
      </h2>
      
      <div className="mb-4 p-3 bg-yellow-50 rounded border border-yellow-200">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Gold:</span>
          <span className="text-yellow-600 font-bold">{player.gold} 🪙</span>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {player.inventory.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Your inventory is empty</p>
        ) : (
          player.inventory.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded border">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <button
                onClick={() => handleUseItem(item)}
                className="bg-cultivation-primary text-white px-3 py-1 rounded text-sm hover:bg-cultivation-secondary"
              >
                Use
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}