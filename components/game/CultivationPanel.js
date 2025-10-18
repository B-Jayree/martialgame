'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { CultivationEngine } from '@/lib/gameEngine/cultivation';

export default function CultivationPanel() {
  const { 
    player, 
    cultivate, 
    breakthrough, 
    processAutoCultivation,
    useItem 
  } = useGameStore();
  
  const [cultivationAmount, setCultivationAmount] = useState(20);
  const [isCultivating, setIsCultivating] = useState(false);
  const [autoBreakthrough, setAutoBreakthrough] = useState(true);
  const [cultivationLog, setCultivationLog] = useState([]);

  // Memoized cultivation stats for performance
  const cultivationStats = useMemo(() => ({
    speed: CultivationEngine.getCultivationSpeed(player),
    progress: CultivationEngine.getProgressPercentage(player.cultivation),
    canBreakthrough: CultivationEngine.canBreakthrough(player.cultivation),
    nextRealm: CultivationEngine.getNextRealmInfo(player.cultivation.realm),
    breakthroughCost: CultivationEngine.calculateBreakthroughCost(
      player.cultivation.realm, 
      player.cultivation.stage
    ),
    efficiency: CultivationEngine.getCultivationEfficiency(player)
  }), [player]);

  const { 
    speed: cultivationSpeed, 
    progress, 
    canBreakthrough, 
    nextRealm, 
    breakthroughCost,
    efficiency 
  } = cultivationStats;

  // Process auto-cultivation on mount
  useEffect(() => {
    processAutoCultivation();
  }, [processAutoCultivation]);

  // Stable log function with useCallback
  const addToLog = useCallback((message, type = 'info') => {
    const newLog = {
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
      id: Date.now() + Math.random()
    };
    setCultivationLog(prev => [newLog, ...prev.slice(0, 14)]); // Keep last 15 messages
  }, []);

  // Safe cultivation with error handling
  const handleCultivate = useCallback(() => {
    try {
      const actualAmount = cultivationAmount * cultivationSpeed;
      
      if (actualAmount <= 0) {
        addToLog('❌ Invalid cultivation amount', 'error');
        return;
      }
      
      cultivate(actualAmount);
      addToLog(`🧘 Cultivated ${Math.floor(actualAmount)} Qi`, 'cultivation');
      
      // Check for automatic breakthrough with fresh state
      if (autoBreakthrough && CultivationEngine.canBreakthrough(useGameStore.getState().player.cultivation)) {
        handleBreakthrough();
      }
    } catch (error) {
      console.error('Cultivation error:', error);
      addToLog(`❌ Cultivation failed: ${error.message}`, 'error');
    }
  }, [cultivate, cultivationAmount, cultivationSpeed, autoBreakthrough, addToLog]);

  // Safe breakthrough with error handling
  const handleBreakthrough = useCallback(() => {
    try {
      const currentState = useGameStore.getState();
      const currentCanBreakthrough = CultivationEngine.canBreakthrough(currentState.player.cultivation);
      
      if (currentCanBreakthrough) {
        breakthrough();
        const updatedPlayer = useGameStore.getState().player;
        const nextStage = updatedPlayer.cultivation.stage;
        const currentRealm = updatedPlayer.cultivation.realm;
        const isRealmChange = nextStage === 1 && currentRealm !== player.cultivation.realm;
        
        if (isRealmChange && nextRealm) {
          addToLog(`🌟 BREAKTHROUGH! Advanced to ${currentRealm} Realm!`, 'breakthrough');
        } else {
          addToLog(`⚡ BREAKTHROUGH! Advanced to Stage ${nextStage}`, 'breakthrough');
        }
      } else {
        addToLog('❌ Not enough Qi for breakthrough', 'error');
      }
    } catch (error) {
      console.error('Breakthrough error:', error);
      addToLog(`❌ Breakthrough failed: ${error.message}`, 'error');
    }
  }, [breakthrough, nextRealm, player.cultivation.realm, addToLog]);

  // Continuous cultivation with proper state management
  const startContinuousCultivation = useCallback(() => {
    if (isCultivating) {
      setIsCultivating(false);
      addToLog('⏹️ Stopped continuous cultivation', 'info');
      return;
    }

    setIsCultivating(true);
    addToLog('🌀 Started continuous cultivation', 'info');
  }, [isCultivating, addToLog]);

  // FIXED: Continuous cultivation with proper state access
  useEffect(() => {
    if (!isCultivating) return;

    const interval = setInterval(() => {
      try {
        const currentState = useGameStore.getState();
        const currentPlayer = currentState.player;
        
        const speed = CultivationEngine.getCultivationSpeed(currentPlayer);
        const actualAmount = cultivationAmount * speed;
        
        if (actualAmount > 0) {
          currentState.cultivate(actualAmount);
          addToLog(`🧘 Cultivated ${Math.floor(actualAmount)} Qi`, 'cultivation');
          
          // Check for automatic breakthrough with current state
          const currentCanBreakthrough = CultivationEngine.canBreakthrough(currentPlayer.cultivation);
          if (autoBreakthrough && currentCanBreakthrough) {
            currentState.breakthrough();
            const updatedPlayer = useGameStore.getState().player;
            const nextStage = updatedPlayer.cultivation.stage;
            const currentRealm = updatedPlayer.cultivation.realm;
            const isRealmChange = nextStage === 1 && currentRealm !== currentPlayer.cultivation.realm;
            
            if (isRealmChange) {
              addToLog(`🌟 BREAKTHROUGH! Advanced to ${currentRealm} Realm!`, 'breakthrough');
            } else {
              addToLog(`⚡ BREAKTHROUGH! Advanced to Stage ${nextStage}`, 'breakthrough');
            }
          }
        }
      } catch (error) {
        console.error('Continuous cultivation error:', error);
        addToLog('❌ Cultivation error occurred', 'error');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isCultivating, cultivationAmount, autoBreakthrough, addToLog]);

  // FIXED: Auto item usage with proper state access
  useEffect(() => {
    if (isCultivating) return; // Don't auto-use items during continuous cultivation

    const currentState = useGameStore.getState();
    const currentPlayer = currentState.player;
    
    if (currentPlayer.cultivation.qi < cultivationAmount) {
      const qiPill = currentPlayer.inventory.find(item => item.type === 'qi-pill');
      if (qiPill) {
        currentState.useItem(qiPill.id);
        addToLog('💊 Used Qi Pill to replenish energy', 'item');
      }
    }
  }, [player.cultivation.qi, cultivationAmount, isCultivating, addToLog]);

  const getRealmGradient = () => {
    const gradients = {
      'Mortal': 'from-gray-500 to-gray-700',
      'Qi Condensation': 'from-green-500 to-green-700',
      'Foundation': 'from-blue-500 to-blue-700',
      'Golden Core': 'from-yellow-500 to-yellow-700',
      'Nascent Soul': 'from-purple-500 to-purple-700'
    };
    return gradients[player.cultivation.realm] || 'from-gray-500 to-gray-700';
  };

  const getLogColor = (type) => {
    const colors = {
      cultivation: 'text-green-400',
      breakthrough: 'text-yellow-400',
      item: 'text-blue-400',
      error: 'text-red-400',
      info: 'text-gray-400'
    };
    return colors[type] || 'text-gray-400';
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-white/10 p-6 text-white relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          Cultivation Chamber
        </h2>
        <div className={`px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${getRealmGradient()}`}>
          {player.cultivation.realm} Stage {player.cultivation.stage}
        </div>
      </div>
      
      {/* Qi Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-300">Qi Accumulation</span>
          <span className="font-mono text-green-400">
            {Math.floor(player.cultivation.qi)} / {Math.floor(player.cultivation.maxQi)}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 mb-1">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Progress: {progress.toFixed(1)}%</span>
          <span>Next: {Math.floor(breakthroughCost)} Qi</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Cultivation Controls */}
        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
          <h3 className="font-semibold mb-3 text-lg">Cultivation Controls</h3>
          
          {/* Cultivation Amount */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Cultivation Intensity</span>
              <span className="font-mono text-green-400">
                {cultivationAmount} Qi/s ({(cultivationAmount * cultivationSpeed).toFixed(0)} with bonuses)
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={cultivationAmount}
              onChange={(e) => setCultivationAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-green"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Gentle</span>
              <span>Intense</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button
              onClick={handleCultivate}
              disabled={isCultivating}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
            >
              <span>🧘</span>
              <span>Cultivate</span>
            </button>
            
            <button
              onClick={startContinuousCultivation}
              className={`font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
                isCultivating
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
              }`}
            >
              <span>{isCultivating ? '⏹️' : '🌀'}</span>
              <span>{isCultivating ? 'Stop' : 'Auto'}</span>
            </button>
          </div>

          {/* Auto Settings */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span>Auto Breakthrough</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoBreakthrough}
                  onChange={(e) => setAutoBreakthrough(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span>Use Items</span>
              <span className="text-green-400 text-xs">Auto</span>
            </div>
          </div>
        </div>

        {/* Cultivation Stats */}
        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
          <h3 className="font-semibold mb-3 text-lg">Cultivation Stats</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Speed Multiplier:</span>
                <span className="text-green-400 font-mono">{cultivationSpeed.toFixed(2)}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Intelligence:</span>
                <span className="text-blue-400">+{(player.stats.intelligence / 100 * 100).toFixed(0)}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Stage Bonus:</span>
                <span className="text-yellow-400">+{((player.cultivation.stage - 1) * 5).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Realm Multiplier:</span>
                <span className="text-purple-400">
                  {(() => {
                    const baseSpeed = CultivationEngine.getCultivationSpeed({ 
                      cultivation: { realm: player.cultivation.realm, stage: 1, speed: 1 },
                      stats: { intelligence: 0 }
                    });
                    return `${((baseSpeed - 1) * 100).toFixed(0)}%`;
                  })()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Efficiency Bonuses */}
          {efficiency.bonuses.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <h4 className="text-sm font-semibold mb-2 text-gray-300">Active Bonuses:</h4>
              <div className="space-y-1">
                {efficiency.bonuses.map((bonus, index) => (
                  <div key={index} className="text-xs text-green-400 flex items-center gap-2">
                    <span>✨</span>
                    <span>{bonus}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Breakthrough Section */}
        {canBreakthrough && (
          <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-xl p-4 border border-yellow-500/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg text-yellow-300">Breakthrough Available!</h3>
              <div className="px-2 py-1 bg-yellow-500/30 rounded text-sm text-yellow-200">
                ⚡ Ready
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-yellow-200">
                Advance to {
                  player.cultivation.stage === CultivationEngine.REALMS[player.cultivation.realm].maxStage && nextRealm
                    ? `${nextRealm.name} Realm`
                    : `Stage ${player.cultivation.stage + 1}`
                }
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={handleBreakthrough}
                  className="flex-1 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg shadow-yellow-500/25 flex items-center justify-center gap-2"
                >
                  <span>⚡</span>
                  <span>Breakthrough</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cultivation Log */}
        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
          <h3 className="font-semibold mb-3 text-lg">Cultivation Log</h3>
          <div className="h-40 overflow-y-auto space-y-2 text-sm">
            {cultivationLog.length === 0 ? (
              <div className="text-gray-500 text-center py-8">No cultivation activity yet...</div>
            ) : (
              cultivationLog.map(log => (
                <div 
                  key={log.id} 
                  className={`flex justify-between items-center py-2 px-3 rounded border-l-4 ${
                    log.type === 'breakthrough' ? 'border-l-yellow-500 bg-yellow-500/10' :
                    log.type === 'cultivation' ? 'border-l-green-500 bg-green-500/10' :
                    log.type === 'item' ? 'border-l-blue-500 bg-blue-500/10' :
                    log.type === 'error' ? 'border-l-red-500 bg-red-500/10' :
                    'border-l-gray-500 bg-gray-500/10'
                  }`}
                >
                  <span className={getLogColor(log.type)}>{log.message}</span>
                  <span className="text-gray-500 text-xs">{log.timestamp}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Continuous Cultivation Overlay */}
      {isCultivating && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 animate-pulse pointer-events-none border-2 border-green-500/20"></div>
      )}
    </div>
  );
}