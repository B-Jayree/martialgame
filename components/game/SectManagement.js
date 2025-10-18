'use client';
import { useGameStore } from '@/store/gameStore';
import { SECTS, getAvailableSects } from '@/lib/data/sects';

export default function SectManagement() {
  const { player } = useGameStore();
  const availableSects = getAvailableSects(player.cultivation.realm, player.cultivation.stage);

  const joinSect = (sectId) => {
    // In real implementation, this would update player's sect
    alert(`Joined ${SECTS[sectId].name}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-cultivation-primary mb-4">
        Sect Management
      </h2>

      <div className="space-y-4">
        {availableSects.length === 0 ? (
          <p className="text-gray-500">No sects available. Advance your cultivation to join a sect.</p>
        ) : (
          availableSects.map(sect => (
            <div key={sect.id} className="border rounded-lg p-4">
              <h3 className="font-bold text-lg">{sect.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{sect.description}</p>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    sect.alignment === 'righteous' ? 'bg-blue-100 text-blue-800' :
                    sect.alignment === 'demonic' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {sect.alignment}
                  </span>
                </div>
                
                <button
                  onClick={() => joinSect(sect.id)}
                  className="bg-cultivation-primary text-white px-4 py-2 rounded hover:bg-cultivation-secondary"
                >
                  Join Sect
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}