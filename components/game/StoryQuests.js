'use client';
import { useGameStore } from '@/store/gameStore';

export default function StoryQuests() {
  const { world } = useGameStore();

  const quests = [
    { id: 1, name: 'First Steps', description: 'Reach Qi Condensation Realm', completed: true },
    { id: 2, name: 'Forest Exploration', description: 'Discover the Mysterious Forest', completed: world.discoveredLocations.includes('forest') },
    { id: 3, name: 'Mountain Ascent', description: 'Reach the Spiritual Mountains', completed: world.discoveredLocations.includes('mountains') },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-cultivation-primary mb-4">
        Story Quests
      </h2>

      <div className="space-y-3">
        {quests.map(quest => (
          <div key={quest.id} className="flex items-center gap-3 p-3 border rounded-lg">
            <div className={`w-3 h-3 rounded-full ${quest.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <div className="flex-1">
              <h3 className="font-semibold">{quest.name}</h3>
              <p className="text-sm text-gray-600">{quest.description}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${
              quest.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {quest.completed ? 'Completed' : 'In Progress'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}