'use client';
import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { CultivationEngine } from '@/lib/gameEngine/cultivation';
import { useSession } from 'next-auth/react';

export default function CharacterSheet() {
  const { 
    player, 
    breakthrough, 
    loadGame, 
    saveGame, 
    isLoading, 
    error,
    clearError
  } = useGameStore();
  const { data: session } = useSession();
  
  const progress = CultivationEngine.getProgressPercentage(player.cultivation);
  const canBreakthrough = CultivationEngine.canBreakthrough(player.cultivation);
  const nextRealm = CultivationEngine.getNextRealmInfo(player.cultivation.realm);

  // Auto-load game when user logs in
  useEffect(() => {
    if (session?.user?.id && !player._id) {
      loadGame(session.user.id);
    }
  }, [session, player._id, loadGame]);

  // Clear errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleSaveGame = async () => {
    await saveGame();
  };

  const handleLoadGame = async () => {
    if (session?.user?.id) {
      await loadGame(session.user.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-cultivation-primary">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-cultivation-primary">
          Character Sheet
        </h2>
        
        {/* Save/Load Buttons */}
        {session && (
          <div className="flex gap-2">
            <button
              onClick={handleSaveGame}
              disabled={isLoading}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Saving...' : '💾 Save'}
            </button>
            <button
              onClick={handleLoadGame}
              disabled={isLoading}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Loading...' : '📂 Load'}
            </button>
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Authentication Status */}
      {!session && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 text-sm">
          🔒 Sign in to save your progress
        </div>
      )}

      {/* Character Info */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{player.name}</h3>
        <p className="text-gray-600">
          {player.cultivation.realm} Stage {player.cultivation.stage}
        </p>
        {player._id && (
          <p className="text-xs text-gray-500 mt-1">Game ID: {player._id.toString().slice(-8)}...</p>
        )}
      </div>
      
      {/* Health Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Health</span>
          <span>{player.health}/{player.maxHealth}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-red-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Cultivation Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Qi Accumulation</span>
          <span>{player.cultivation.qi.toFixed(0)}/{player.cultivation.maxQi.toFixed(0)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-cultivation-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Progress: {progress.toFixed(1)}%
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
        <div className="flex justify-between">
          <span>Strength:</span>
          <span className="font-semibold">{player.stats.strength}</span>
        </div>
        <div className="flex justify-between">
          <span>Agility:</span>
          <span className="font-semibold">{player.stats.agility}</span>
        </div>
        <div className="flex justify-between">
          <span>Intelligence:</span>
          <span className="font-semibold">{player.stats.intelligence}</span>
        </div>
        <div className="flex justify-between">
          <span>Vitality:</span>
          <span className="font-semibold">{player.stats.vitality}</span>
        </div>
      </div>

      {/* Gold */}
      <div className="flex justify-between items-center mb-4 p-2 bg-yellow-50 rounded">
        <span className="text-sm">Gold:</span>
        <span className="font-bold text-yellow-600">{player.gold} 🪙</span>
      </div>
      
      {/* Breakthrough Button */}
      {canBreakthrough && (
        <button
          onClick={breakthrough}
          disabled={isLoading}
          className="w-full mt-2 bg-cultivation-secondary text-white py-2 px-4 rounded hover:bg-cultivation-primary transition-colors disabled:opacity-50"
        >
          🌀 Breakthrough to Next Stage
        </button>
      )}
      
      {/* Next Realm Info */}
      {nextRealm && (
        <div className="mt-4 p-3 bg-cultivation-accent bg-opacity-20 rounded border border-cultivation-accent">
          <p className="text-sm font-semibold text-cultivation-primary">
            Next Realm: {nextRealm.name}
          </p>
          <p className="text-xs text-gray-600 mt-1">{nextRealm.description}</p>
        </div>
      )}

      {/* Location Info */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          📍 Location: <span className="font-medium capitalize">{player.location.replace('-', ' ')}</span>
        </p>
      </div>
    </div>
  );
}