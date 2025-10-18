'use client';
import { useGameStore } from '@/store/gameStore';
import CharacterSheet from '@/components/game/CharacterSheet';
import CultivationPanel from '@/components/game/CultivationPanel';
import WorldMap from '@/components/game/WorldMap';
import Inventory from '@/components/game/Inventory';
import CombatSystem from '@/components/game/CombatSystem';
import SectManagement from '@/components/game/SectManagement';
import Relationships from '@/components/game/Relationships';
import StoryQuests from '@/components/game/StoryQuests';

export default function GamePage() {
  const { player } = useGameStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-100 p-4">
      <header className="bg-white shadow-lg rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-cultivation-primary">
            Martial Peak Journey
          </h1>
          <div className="text-right">
            <p className="font-semibold">{player.name}</p>
            <p className="text-sm text-gray-600">
              {player.cultivation.realm} Stage {player.cultivation.stage}
            </p>
          </div>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        <aside className="lg:col-span-1 space-y-6">
          <CharacterSheet />
          <Inventory />
        </aside>
        
        <main className="lg:col-span-3 space-y-6">
          <CultivationPanel />
          <WorldMap />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CombatSystem />
            <SectManagement />
            <Relationships />
            <StoryQuests />
          </div>
        </main>
      </div>
    </div>
  );
}