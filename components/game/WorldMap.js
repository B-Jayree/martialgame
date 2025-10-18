'use client';
import { useGameStore } from '@/store/gameStore';

export default function WorldMap() {
  const { player, world, travelTo, discoverLocation } = useGameStore();

  const locations = {
    'starting-village': {
      name: 'Starting Village',
      description: 'Your humble beginning. A peaceful village where you first learned of cultivation.',
      level: 'Mortal',
      type: 'safe',
      x: 50,
      y: 70,
      connections: ['forest', 'training-grounds'],
      shops: ['basic-shop'],
      events: ['tutorial']
    },
    'forest': {
      name: 'Mysterious Forest',
      description: 'A dense forest filled with spiritual energy and low-level demon beasts.',
      level: 'Qi Condensation',
      type: 'wilderness',
      x: 30,
      y: 40,
      connections: ['starting-village', 'mountain-foot'],
      events: ['combat', 'herb-gathering']
    },
    'training-grounds': {
      name: 'Training Grounds',
      description: 'Where cultivators practice techniques and spar with each other.',
      level: 'All',
      type: 'training',
      x: 70,
      y: 60,
      connections: ['starting-village'],
      events: ['training', 'technique-learning']
    },
    'mountain-foot': {
      name: 'Mountain Foot',
      description: 'The base of the Spiritual Mountains. Higher spiritual energy here.',
      level: 'Foundation',
      type: 'wilderness',
      x: 40,
      y: 20,
      connections: ['forest'],
      events: ['cultivation-boost']
    },
    'sect-hall': {
      name: `${player.sect} Sect Hall`,
      description: `The main hall of your ${player.sect} sect. Receive missions and guidance here.`,
      level: 'All',
      type: 'sect',
      x: 80,
      y: 30,
      connections: [],
      events: ['sect-quests', 'techniques']
    }
  };

  const handleLocationClick = (locationId) => {
    if (world.discoveredLocations.includes(locationId) || locationId === 'starting-village') {
      travelTo(locationId);
      
      // Discover connected locations
      const connectedLocations = locations[locationId]?.connections || [];
      connectedLocations.forEach(connId => {
        if (!world.discoveredLocations.includes(connId)) {
          discoverLocation(connId);
        }
      });
    }
  };

  const canTravelTo = (locationId) => {
    const location = locations[locationId];
    if (!location) return false;
    
    // Check cultivation level requirement
    const levelRequirements = {
      'Mortal': 0,
      'Qi Condensation': 1,
      'Foundation': 2,
      'Golden Core': 3,
      'Nascent Soul': 4
    };
    
    const playerLevel = levelRequirements[player.cultivation.realm] || 0;
    const locationLevel = levelRequirements[location.level] || 0;
    
    return playerLevel >= locationLevel;
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-white/10 p-6 text-white">
      <h2 className="text-2xl font-bold text-blue-300 mb-6 flex items-center gap-3">
        🗺️ World Map
      </h2>

      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-green-900 to-blue-900 h-96 rounded-xl border-2 border-yellow-500/30 mb-6 overflow-hidden">
        {/* Simplified Background Pattern */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
        
        {/* Locations */}
        {Object.entries(locations).map(([id, location]) => {
          const isDiscovered = world.discoveredLocations.includes(id) || id === 'starting-village';
          const isCurrent = player.location === id;
          const canTravel = canTravelTo(id);
          
          return (
            <button
              key={id}
              onClick={() => handleLocationClick(id)}
              disabled={!isDiscovered || !canTravel}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                isCurrent
                  ? 'bg-red-500 text-white shadow-2xl scale-110 ring-4 ring-red-400/50 z-10'
                  : isDiscovered && canTravel
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:scale-105 hover:shadow-xl cursor-pointer'
                  : isDiscovered
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed opacity-70'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-40'
              }`}
              style={{ left: `${location.x}%`, top: `${location.y}%` }}
              title={!isDiscovered ? 'Undiscovered' : !canTravel ? `Requires ${location.level} Realm` : location.description}
            >
              <div className="flex items-center gap-2">
                <span>
                  {isCurrent ? '📍' : 
                   location.type === 'safe' ? '🏠' :
                   location.type === 'wilderness' ? '🌲' :
                   location.type === 'training' ? '⚔️' :
                   location.type === 'sect' ? '🏯' : '📍'}
                </span>
                <span>{location.name}</span>
              </div>
              {isCurrent && <div className="text-xs mt-1">Current Location</div>}
            </button>
          );
        })}

        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {Object.entries(locations).map(([id, location]) =>
            location.connections.map(connId => {
              const connLocation = locations[connId];
              if (!connLocation) return null;
              
              const isDiscovered = world.discoveredLocations.includes(connId) || connId === 'starting-village';
              
              return (
                <line
                  key={`${id}-${connId}`}
                  x1={`${location.x}%`}
                  y1={`${location.y}%`}
                  x2={`${connLocation.x}%`}
                  y2={`${connLocation.y}%`}
                  stroke={isDiscovered ? "rgba(59, 130, 246, 0.5)" : "rgba(75, 85, 99, 0.3)"}
                  strokeWidth="2"
                  strokeDasharray={isDiscovered ? "none" : "5,5"}
                />
              );
            })
          )}
        </svg>
      </div>

      {/* Location Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
          <h3 className="font-bold text-lg mb-3">Current Location</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Name:</span>
              <span className="text-white font-semibold">{locations[player.location]?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Type:</span>
              <span className="capitalize text-blue-300">{locations[player.location]?.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Level:</span>
              <span className="text-green-300">{locations[player.location]?.level}</span>
            </div>
            <p className="text-gray-300 text-sm mt-3">{locations[player.location]?.description}</p>
          </div>
        </div>

        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
          <h3 className="font-bold text-lg mb-3">Exploration Progress</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Discovered Locations:</span>
              <span>{world.discoveredLocations.length} / {Object.keys(locations).length}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(world.discoveredLocations.length / Object.keys(locations).length) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-400">
              Discover new locations by traveling to connected areas
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}