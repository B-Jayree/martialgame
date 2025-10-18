'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('welcome');
  const [playerName, setPlayerName] = useState('');
  const [selectedSect, setSelectedSect] = useState('');
  const router = useRouter();
  const { initializePlayer } = useGameStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const sects = [
    {
      id: 'cloud-sword',
      name: 'Cloud Sword Sect',
      description: 'A righteous sect specializing in sword techniques and honorable cultivation',
      alignment: 'Righteous',
      bonus: '+20% Sword Technique Power',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'shadow-palace',
      name: 'Shadow Palace',
      description: 'A demonic sect that values power and freedom above all else',
      alignment: 'Demonic',
      bonus: '+30% Cultivation Speed',
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'neutral-alliance',
      name: 'Neutral Alliance',
      description: 'Balance between extremes, focusing on harmony with nature',
      alignment: 'Neutral',
      bonus: '+25% Resource Gathering',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const handleStartGame = () => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!selectedSect) {
      alert('Please choose a sect');
      return;
    }

    initializePlayer({
      name: playerName,
      sect: selectedSect,
      startingTime: new Date().toISOString()
    });

    router.push('/manual');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Initializing Cultivation World...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 rounded-full flex items-center justify-center mr-4 animate-pulse">
              <span className="text-3xl">⚡</span>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-300 via-red-300 to-purple-400 bg-clip-text text-transparent">
              Martial Peak
            </h1>
          </div>
          <p className="text-xl text-gray-300">Begin Your Journey to Immortality</p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          {['welcome', 'character', 'sect'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          {/* Welcome Tab */}
          {activeTab === 'welcome' && (
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Welcome, Aspiring Cultivator
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                In the world of Martial Peak, you begin as a mortal with dreams of immortality. 
                Through cultivation, you will gather Qi, learn powerful techniques, and ascend through realms.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-8">
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-2xl mb-2">🧘</div>
                  <h3 className="font-bold mb-2">Cultivate Qi</h3>
                  <p className="text-sm text-gray-400">Gather spiritual energy to breakthrough realms</p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-2xl mb-2">⚔️</div>
                  <h3 className="font-bold mb-2">Learn Techniques</h3>
                  <p className="text-sm text-gray-400">Master combat and cultivation techniques</p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="text-2xl mb-2">🏯</div>
                  <h3 className="font-bold mb-2">Join Sects</h3>
                  <p className="text-sm text-gray-400">Align with factions for power and resources</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('character')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg px-8 py-4 rounded-lg mt-6 transition-all"
              >
                Begin Your Journey →
              </button>
            </div>
          )}

          {/* Character Creation Tab */}
          {activeTab === 'character' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                Create Your Cultivator
              </h2>
              <div className="max-w-md mx-auto">
                <label className="block text-lg font-semibold mb-3">
                  What is your name, cultivator?
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                />
                {playerName && (
                  <p className="text-green-400 mt-2 text-sm">Welcome, {playerName}!</p>
                )}
              </div>
              <div className="text-center">
                <button
                  onClick={() => setActiveTab('sect')}
                  disabled={!playerName.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-lg transition-all"
                >
                  Choose Your Sect →
                </button>
              </div>
            </div>
          )}

          {/* Sect Selection Tab */}
          {activeTab === 'sect' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Choose Your Path
              </h2>
              <p className="text-center text-gray-300">
                Your sect will determine your cultivation path and available techniques
              </p>
              
              <div className="grid gap-4">
                {sects.map((sect) => (
                  <div
                    key={sect.id}
                    onClick={() => setSelectedSect(sect.id)}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedSect === sect.id
                        ? `bg-gradient-to-r ${sect.color} border-white shadow-2xl scale-105`
                        : 'bg-white/10 border-white/10 hover:bg-white/20'
                    }`}
                  >
                    <h3 className="text-xl font-bold mb-2">{sect.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        sect.alignment === 'Righteous' ? 'bg-blue-500' :
                        sect.alignment === 'Demonic' ? 'bg-red-500' :
                        'bg-green-500'
                      }`}>
                        {sect.alignment}
                      </span>
                      <span className="text-yellow-400 text-sm">{sect.bonus}</span>
                    </div>
                    <p className="text-gray-300">{sect.description}</p>
                  </div>
                ))}
              </div>

              {selectedSect && (
                <div className="text-center">
                  <button
                    onClick={handleStartGame}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg px-12 py-4 rounded-lg shadow-2xl transition-all"
                  >
                    🚀 Start Cultivation Journey
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}