'use client';
import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function Shop() {
  const { player, addItem, removeGold, addGold } = useGameStore();
  const [activeCategory, setActiveCategory] = useState('pills');

  const shopItems = {
    pills: [
      {
        id: 'healing-pill',
        name: 'Healing Pill',
        description: 'Restores 50 health points instantly',
        price: 30,
        type: 'healing-pill',
        rarity: 'common'
      },
      {
        id: 'qi-pill',
        name: 'Qi Restoration Pill',
        description: 'Instantly restores 80 Qi',
        price: 50,
        type: 'qi-pill',
        rarity: 'uncommon'
      },
      {
        id: 'great-pill',
        name: 'Great Restoration Pill',
        description: 'Restores 80 health and 120 Qi',
        price: 80,
        type: 'great-pill',
        rarity: 'rare'
      },
      {
        id: 'breakthrough-pill',
        name: 'Breakthrough Pill',
        description: 'Massive Qi infusion of 200 points',
        price: 150,
        type: 'breakthrough-pill',
        rarity: 'epic'
      }
    ],
    stats: [
      {
        id: 'stat-pill-strength',
        name: 'Strength Pill',
        description: 'Permanently increases Strength by 3',
        price: 200,
        type: 'stat-pill-strength',
        rarity: 'rare'
      },
      {
        id: 'stat-pill-intelligence',
        name: 'Intelligence Pill',
        description: 'Permanently increases Intelligence by 3',
        price: 200,
        type: 'stat-pill-intelligence',
        rarity: 'rare'
      }
    ],
    techniques: [
      {
        id: 'basic-cultivation',
        name: 'Basic Cultivation Manual',
        description: 'Increases cultivation speed by 10%',
        price: 100,
        type: 'technique',
        rarity: 'uncommon'
      }
    ]
  };

  const handleBuyItem = (item) => {
    if (player.gold >= item.price) {
      removeGold(item.price);
      addItem(item);
      
      // Show purchase message
      alert(`Purchased ${item.name}!`);
    } else {
      alert('Not enough gold!');
    }
  };

  const handleSellItem = (item) => {
    const sellPrice = Math.floor(item.price * 0.6); // 60% of purchase price
    addGold(sellPrice);
    alert(`Sold ${item.name} for ${sellPrice} gold!`);
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: 'text-gray-400',
      uncommon: 'text-green-400',
      rare: 'text-blue-400',
      epic: 'text-purple-400',
      legendary: 'text-yellow-400'
    };
    return colors[rarity] || 'text-gray-400';
  };

  return (
    <div className="bg-gradient-to-br from-amber-900 to-yellow-900 rounded-2xl shadow-2xl border border-amber-500/30 p-6 text-white">
      <h2 className="text-2xl font-bold text-amber-300 mb-6 flex items-center gap-3">
        🏪 Cultivation Shop
      </h2>

      {/* Player Gold */}
      <div className="bg-amber-500/20 rounded-lg p-4 mb-6 border border-amber-500/30">
        <div className="flex justify-between items-center">
          <span className="text-amber-300 font-semibold">Your Gold:</span>
          <span className="text-2xl font-bold text-yellow-400">{player.gold} 🪙</span>
        </div>
      </div>

      {/* Shop Categories */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {Object.keys(shopItems).map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-lg capitalize transition-all flex-shrink-0 ${
              activeCategory === category
                ? 'bg-amber-600 text-white shadow-lg'
                : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid gap-4 mb-6">
        {shopItems[activeCategory].map(item => (
          <div key={item.id} className="bg-black/30 rounded-xl p-4 border border-white/10">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-amber-200">{item.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getRarityColor(item.rarity)} bg-white/10`}>
                    {item.rarity}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-2">{item.description}</p>
              </div>
              <div className="text-right">
                <div className="text-yellow-400 font-bold text-lg mb-2">{item.price} 🪙</div>
                <button
                  onClick={() => handleBuyItem(item)}
                  disabled={player.gold < item.price}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm transition-all"
                >
                  Buy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sell Items Section */}
      <div className="bg-black/40 rounded-lg p-4 border border-amber-500/20">
        <h3 className="font-semibold mb-3 text-amber-300">Sell Items</h3>
        <div className="space-y-2">
          {player.inventory.length === 0 ? (
            <p className="text-gray-400 text-sm">No items to sell</p>
          ) : (
            player.inventory.map((item, index) => (
              <div key={`${item.id}_${index}`} className="flex justify-between items-center p-2 bg-white/5 rounded">
                <div>
                  <span className="text-amber-200">{item.name}</span>
                  <span className="text-gray-400 text-sm ml-2">
                    (Sell: {Math.floor((item.price || 20) * 0.6)}🪙)
                  </span>
                </div>
                <button
                  onClick={() => handleSellItem(item)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                >
                  Sell
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Shopkeeper Message */}
      <div className="mt-6 p-4 bg-black/40 rounded-lg border border-amber-500/20">
        <p className="text-amber-200 text-sm italic">
          "These treasures will aid your path to immortality, young cultivator. Choose wisely!"
        </p>
      </div>
    </div>
  );
}