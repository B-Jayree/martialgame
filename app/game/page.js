'use client';
import { useGameStore } from '@/store/gameStore';
import { useState } from 'react';
import CharacterSheet from '@/components/game/CharacterSheet';
import CultivationPanel from '@/components/game/CultivationPanel';
import WorldMap from '@/components/game/WorldMap';
import Inventory from '@/components/game/Inventory';
import CombatSystem from '@/components/game/CombatSystem';
import SectManagement from '@/components/game/SectManagement';
import Relationships from '@/components/game/Relationships';
import StoryQuests from '@/components/game/StoryQuests';
import Shop from '@/components/game/Shop';

export default function GamePage() {
  const { player } = useGameStore();
  const [activeGameTab, setActiveGameTab] = useState('cultivation');

  const gameMenuItems = [
    { id: 'cultivation', name: 'Cultivation', icon: '🧘', color: 'from-green-500 to-emerald-500' },
    { id: 'world', name: 'World Map', icon: '🗺️', color: 'from-blue-500 to-cyan-500' },
    { id: 'combat', name: 'Combat', icon: '⚔️', color: 'from-red-500 to-pink-500' },
    { id: 'sects', name: 'Sect', icon: '🏯', color: 'from-orange-500 to-amber-500' },
    { id: 'shop', name: 'Shop', icon: '🏪', color: 'from-yellow-500 to-orange-500' },
    { id: 'quests', name: 'Quests', icon: '📜', color: 'from-purple-500 to-indigo-500' },
    { id: 'inventory', name: 'Inventory', icon: '🎒', color: 'from-gray-500 to-blue-500' },
  ];

  const renderActiveTab = () => {
    switch (activeGameTab) {
      case 'cultivation':
        return <CultivationPanel />;
      case 'world':
        return <WorldMap />;
      case 'combat':
        return <CombatSystem />;
      case 'sects':
        return <SectManagement />;
      case 'shop':
        return <Shop />;
      case 'quests':
        return <StoryQuests />;
      case 'inventory':
        return <Inventory />;
      default:
        return <CultivationPanel />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-2xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Martial Peak Journey</h1>
                <div className="flex items-center gap-4 text-sm">
                  <span className="bg-black/30 px-2 py-1 rounded">{player.name}</span>
                  <span className="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">
                    {player.sect} Sect
                  </span>
                  <span className="bg-green-500/20 px-2 py-1 rounded text-green-300">
                    {player.cultivation.realm} Stage {player.cultivation.stage}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <span>❤️</span>
                  <span>{player.health}/{player.maxHealth}</span>
                </div>
                <div className="w-20 bg-gray-700 rounded-full h-1">
                  <div 
                    className="bg-red-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <span>⚡</span>
                  <span>{Math.floor(player.cultivation.qi)}/{player.cultivation.maxQi}</span>
                </div>
                <div className="w-20 bg-gray-700 rounded-full h-1">
                  <div 
                    className="bg-green-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${(player.cultivation.qi / player.cultivation.maxQi) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center gap-1">
                  <span>💰</span>
                  <span>{player.gold}</span>
                </div>
                <div className="text-yellow-400 text-xs">Gold</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Game Navigation Menu */}
      <nav className="bg-black/40 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto py-2 gap-1 scrollbar-hide">
            {gameMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveGameTab(item.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                  activeGameTab === item.id
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg scale-105`
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:scale-105'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Game Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Character & Inventory */}
          <aside className="lg:col-span-1 space-y-6">
            <CharacterSheet />
            <Inventory />
          </aside>
          
          {/* Main Game Area - Dynamic Content */}
          <main className="lg:col-span-3">
            {renderActiveTab()}
          </main>
        </div>
      </div>
    </div>
  );
}