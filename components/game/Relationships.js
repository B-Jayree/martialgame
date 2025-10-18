'use client';
import { useGameStore } from '@/store/gameStore';
import { RelationshipsEngine } from '@/lib/gameEngine/relationships';

export default function Relationships() {
  const { player } = useGameStore();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-cultivation-primary mb-4">
        Relationships
      </h2>

      <div className="space-y-4">
        {Object.entries(RelationshipsEngine.factions).map(([faction, data]) => (
          <div key={faction} className="border rounded-lg p-4">
            <h3 className="font-bold text-lg">{faction}</h3>
            
            <div className="flex items-center gap-4 mb-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    data.relations >= 50 ? 'bg-green-500' :
                    data.relations >= 0 ? 'bg-blue-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${data.relations + 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{data.relations}</span>
            </div>

            <div className="text-sm text-gray-600">
              <p>Alignment: <span className="capitalize">{data.alignment}</span></p>
              <p>Benefits: {RelationshipsEngine.getFactionBenefits(data.relations).join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}