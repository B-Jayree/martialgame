'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Menu items with colors and icons
  const menuItems = [
    { id: 'overview', name: 'Overview', icon: '🏠', color: 'from-blue-500 to-cyan-500' },
    { id: 'realms', name: 'Cultivation Realms', icon: '⚡', color: 'from-purple-500 to-pink-500' },
    { id: 'features', name: 'Game Features', icon: '🎮', color: 'from-green-500 to-emerald-500' },
    { id: 'sects', name: 'Sects & Factions', icon: '🏯', color: 'from-orange-500 to-red-500' },
    { id: 'techniques', name: 'Techniques', icon: '📜', color: 'from-yellow-500 to-amber-500' },
    { id: 'world', name: 'World Map', icon: '🗺️', color: 'from-indigo-500 to-blue-500' }
  ];

  const realms = [
    { name: 'Mortal', color: 'from-gray-400 to-gray-600', description: 'Begin your journey as an ordinary mortal', abilities: ['Basic Meditation', 'Physical Training'] },
    { name: 'Qi Condensation', color: 'from-green-400 to-green-600', description: 'Sense and absorb spiritual energy', abilities: ['Qi Control', 'Elemental Affinity'] },
    { name: 'Foundation', color: 'from-blue-400 to-blue-600', description: 'Build your cultivation foundation', abilities: ['Flight', 'Spiritual Sense'] },
    { name: 'Golden Core', color: 'from-yellow-400 to-yellow-600', description: 'Form your golden core', abilities: ['Soul Projection', 'Realm Creation'] },
    { name: 'Nascent Soul', color: 'from-purple-400 to-purple-600', description: 'Achieve immortality', abilities: ['Laws Comprehension', 'Divine Abilities'] }
  ];

  const features = [
    { name: 'Cultivation System', icon: '🧘', description: 'Meditate and gather qi to breakthrough realms', details: 'Real-time cultivation with various techniques and bonuses' },
    { name: 'Combat System', icon: '⚔️', description: 'Strategic turn-based combat', details: 'Master techniques, elemental affinities, and divine abilities' },
    { name: 'Sect Management', icon: '🏯', description: 'Join or create your own sect', details: 'Recruit disciples, manage resources, and conquer territories' },
    { name: 'Alchemy & Crafting', icon: '⚗️', description: 'Create powerful pills and artifacts', details: 'Gather materials and master alchemical recipes' },
    { name: 'Auction House', icon: '💰', description: 'Trade with other cultivators', details: 'Buy, sell, and auction rare items and techniques' },
    { name: 'Quest System', icon: '📖', description: 'Embark on epic journeys', details: 'Story quests, daily missions, and world events' }
  ];

  const sects = [
    { name: 'Righteous Path', color: 'from-blue-400 to-cyan-400', alignment: 'Good', description: 'Uphold justice and protect the weak', techniques: ['Righteous Sword Art', 'Purifying Light'] },
    { name: 'Demonic Path', color: 'from-red-400 to-pink-400', alignment: 'Evil', description: 'Pursue power at any cost', techniques: ['Blood Art', 'Soul Devouring'] },
    { name: 'Neutral Alliance', color: 'from-green-400 to-emerald-400', alignment: 'Neutral', description: 'Balance between extremes', techniques: ['Nature Harmony', 'Elemental Fusion'] }
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4 text-lg">Initializing Cultivation World...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-300 via-red-300 to-purple-400 bg-clip-text text-transparent">
              Martial Peak
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Embark on an epic cultivation journey to immortality!
          </p>
        </div>

        {/* Navigation Menu */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === item.id
                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg scale-105`
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:scale-105'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </div>

        {/* Main CTA */}
        <div className="text-center mb-12">
          <Link 
            href="/game" 
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg px-12 py-4 rounded-lg hover:scale-105 transition-all duration-300 shadow-xl"
          >
            🚀 Start Cultivating Now
          </Link>
        </div>

        {/* Tab Content */}
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-6">
                Welcome to Martial Peak
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <span>🎯</span> Your Journey Begins
                  </h3>
                  <p className="text-gray-300">
                    Start as a mortal and ascend through cultivation realms. Each breakthrough unlocks new powers, techniques, and abilities.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-500/30">
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <span>🌟</span> Key Features
                  </h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Deep cultivation system with 5 major realms</li>
                    <li>• Strategic combat with elemental techniques</li>
                    <li>• Sect politics and alliances</li>
                    <li>• Alchemy, crafting, and trading</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-2xl text-yellow-400 mb-2">⚡</div>
                  <div className="text-xl font-bold">5</div>
                  <div className="text-gray-400 text-sm">Realms</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-2xl text-blue-400 mb-2">🗡️</div>
                  <div className="text-xl font-bold">50+</div>
                  <div className="text-gray-400 text-sm">Techniques</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-2xl text-green-400 mb-2">🏯</div>
                  <div className="text-xl font-bold">3</div>
                  <div className="text-gray-400 text-sm">Major Sects</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-2xl text-purple-400 mb-2">🌍</div>
                  <div className="text-xl font-bold">12+</div>
                  <div className="text-gray-400 text-sm">Locations</div>
                </div>
              </div>
            </div>
          )}

          {/* Realms Tab */}
          {activeTab === 'realms' && (
            <div>
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-8">
                The Path to Immortality
              </h2>
              <div className="grid gap-6">
                {realms.map((realm, index) => (
                  <div 
                    key={realm.name}
                    className={`bg-gradient-to-r ${realm.color} rounded-xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer`}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-3xl">🌟</div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{realm.name}</h3>
                        <p className="text-white/90">{realm.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {realm.abilities.map((ability, idx) => (
                        <span key={idx} className="bg-black/30 text-white/90 px-3 py-1 rounded-full text-sm">
                          {ability}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div>
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent mb-8">
                Game Features
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div 
                    key={feature.name}
                    className="bg-white/10 rounded-xl p-6 border border-white/20 hover:border-purple-400 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{feature.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{feature.name}</h3>
                        <p className="text-gray-300 mb-2">{feature.description}</p>
                        <p className="text-gray-400 text-sm">{feature.details}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sects Tab */}
          {activeTab === 'sects' && (
            <div>
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-8">
                Sects & Factions
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {sects.map((sect, index) => (
                  <div 
                    key={sect.name}
                    className={`bg-gradient-to-br ${sect.color} rounded-xl p-6 text-white hover:scale-105 transition-all duration-300`}
                  >
                    <h3 className="text-xl font-bold mb-2">{sect.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        sect.alignment === 'Good' ? 'bg-blue-500' :
                        sect.alignment === 'Evil' ? 'bg-red-500' :
                        'bg-green-500'
                      }`}>
                        {sect.alignment}
                      </span>
                    </div>
                    <p className="mb-4">{sect.description}</p>
                    <div>
                      <h4 className="font-semibold mb-2">Signature Techniques:</h4>
                      <div className="space-y-1">
                        {sect.techniques.map((tech, idx) => (
                          <div key={idx} className="text-sm bg-black/30 px-2 py-1 rounded">
                            • {tech}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Techniques Tab */}
          {activeTab === 'techniques' && (
            <div>
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent mb-8">
                Cultivation Techniques
              </h2>
              <div className="grid gap-4">
                {[
                  { name: 'Dragon Tiger Fist', type: 'Offensive', element: 'Fire', realm: 'Qi Condensation', power: 'High' },
                  { name: 'Cloud Sword Art', type: 'Offensive', element: 'Wind', realm: 'Foundation', power: 'Very High' },
                  { name: 'Nine Heavens Thunder', type: 'Offensive', element: 'Lightning', realm: 'Golden Core', power: 'Extreme' },
                  { name: 'Heavenly Meditation', type: 'Cultivation', element: 'Pure', realm: 'All', power: 'Support' },
                  { name: 'Shadow Step', type: 'Movement', element: 'Dark', realm: 'Foundation', power: 'Medium' },
                ].map((tech, index) => (
                  <div key={tech.name} className="bg-white/10 rounded-lg p-4 border border-white/20 hover:border-yellow-400 transition-all duration-300">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold">{tech.name}</h3>
                        <div className="flex gap-2 mt-1">
                          <span className="bg-purple-500/30 text-purple-300 px-2 py-1 rounded text-xs">{tech.type}</span>
                          <span className="bg-blue-500/30 text-blue-300 px-2 py-1 rounded text-xs">{tech.element}</span>
                          <span className="bg-green-500/30 text-green-300 px-2 py-1 rounded text-xs">{tech.realm}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        tech.power === 'Extreme' ? 'bg-red-500' :
                        tech.power === 'Very High' ? 'bg-orange-500' :
                        tech.power === 'High' ? 'bg-yellow-500 text-black' :
                        'bg-gray-500'
                      }`}>
                        {tech.power}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* World Tab */}
          {activeTab === 'world' && (
            <div>
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent mb-8">
                World of Martial Peak
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { name: 'Starting Village', type: 'Safe Zone', description: 'Begin your journey in this peaceful village', level: 'Mortal' },
                  { name: 'Mysterious Forest', type: 'Wilderness', description: 'Dense forest filled with spiritual energy', level: 'Qi Condensation' },
                  { name: 'Spiritual Mountains', type: 'Sacred Ground', description: 'Ancient mountains where masters meditate', level: 'Foundation' },
                  { name: 'Demon Beast Valley', type: 'Danger Zone', description: 'Home to powerful demonic creatures', level: 'Golden Core' },
                  { name: 'Immortal City', type: 'Metropolis', description: 'Capital city of cultivators', level: 'Nascent Soul' },
                  { name: 'Heavenly Realm', type: 'Divine', description: 'The ultimate cultivation destination', level: 'Immortal' },
                ].map((location, index) => (
                  <div key={location.name} className="bg-white/10 rounded-xl p-4 border border-white/20 hover:border-blue-400 transition-all duration-300">
                    <h3 className="text-lg font-bold mb-2">{location.name}</h3>
                    <div className="flex gap-2 mb-2">
                      <span className="bg-blue-500/30 text-blue-300 px-2 py-1 rounded text-xs">{location.type}</span>
                      <span className="bg-green-500/30 text-green-300 px-2 py-1 rounded text-xs">{location.level}</span>
                    </div>
                    <p className="text-gray-300">{location.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 pt-8 border-t border-white/10">
          <p className="text-gray-500">
            © 2024 Martial Peak Game - Begin your path to immortality today!
          </p>
        </footer>
      </div>
    </div>
  );
}