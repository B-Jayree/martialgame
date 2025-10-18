'use client';
import { useGameStore } from '@/store/gameStore';
import { WORLDS } from '@/lib/data/worlds';

export default function WorldMap() {
  const { player, world, travelTo } = useGameStore();
  
  const locations = [
    { id: 'starting-village', name: 'Starting Village', x: 50, y: 70 },
    { id: 'forest', name: 'Mysterious Forest', x: 30, y: 40 },
    { id: 'mountains', name: 'Spiritual Mountains', x: 70, y: 30 },
    { id: 'cultivator-city', name: 'Cultivator City', x: 80, y: 60 },
  ];

  const handleLocationClick = (locationId) => {
    if (world.discoveredLocations.includes(locationId)) {
      travelTo(locationId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-cultivation-primary mb-4">
        World Map
      </h2>
      
      <div className="relative bg-green-100 h-96 rounded border-2 border-cultivation-secondary">
        {locations.map(location => {
          const isDiscovered = world.discoveredLocations.includes(location.id);
          const isCurrent = player.location === location.id;
          
          return (
            <button
              key={location.id}
              onClick={() => handleLocationClick(location.id)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full text-xs font-medium transition-all ${
                isCurrent 
                  ? 'bg-red-500 text-white shadow-lg scale-110' 
                  : isDiscovered 
                    ? 'bg-cultivation-primary text-white hover:bg-cultivation-secondary cursor-pointer'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
              style={{ left: `${location.x}%`, top: `${location.y}%` }}
              disabled={!isDiscovered}
            >
              {location.name}
              {isCurrent && " (Current)"}
            </button>
          );
        })}
        
        <div 
          className="absolute w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg animate-pulse"
          style={{ 
            left: `${locations.find(l => l.id === player.location)?.x || 50}%`, 
            top: `${locations.find(l => l.id === player.location)?.y || 50}%` 
          }}
        ></div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Current Location: {WORLDS[player.location]?.name || player.location}</p>
        <p>Discovered Areas: {world.discoveredLocations.length}/{locations.length}</p>
      </div>
    </div>
  );
}