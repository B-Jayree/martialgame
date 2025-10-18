'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';

export default function Manual() {
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();
  const { player } = useGameStore();

  const pages = [
    {
      title: "Welcome to Cultivation",
      content: `Welcome, ${player.name}! As a new disciple of the ${player.sect} sect, you must learn the ways of cultivation.`,
      icon: "👋"
    },
    {
      title: "Understanding Qi",
      content: "Qi is spiritual energy that flows through all living things. By gathering Qi, you can strengthen your body and spirit, eventually achieving immortality.",
      icon: "💫"
    },
    {
      title: "Cultivation Basics",
      content: "Sit in meditation and gather Qi. When you have enough, you can breakthrough to higher stages and realms, gaining new abilities and longer lifespan.",
      icon: "🧘"
    },
    {
      title: "Your First Goal",
      content: "Reach Qi Condensation Realm to truly begin your cultivation journey. This requires diligent practice and gathering spiritual energy.",
      icon: "🎯"
    }
  ];

  const handleCompleteTutorial = () => {
    router.push('/game');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent mb-4">
            Cultivation Manual
          </h1>
          <div className="text-lg text-gray-300">
            Page {currentPage + 1} of {pages.length}
          </div>
        </div>

        {/* Content */}
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-white/10 mb-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{pages[currentPage].icon}</div>
            <h2 className="text-2xl font-bold mb-4">{pages[currentPage].title}</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              {pages[currentPage].content}
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {pages.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentPage 
                    ? 'bg-purple-500 scale-125' 
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg transition-all"
            >
              ← Previous
            </button>

            {currentPage < pages.length - 1 ? (
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-lg transition-all"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleCompleteTutorial}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-3 rounded-lg font-bold transition-all"
              >
                🚀 Start Playing
              </button>
            )}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-blue-500/20 rounded-xl p-6 border border-blue-500/30">
          <h3 className="font-bold text-lg mb-3 text-blue-300">💡 Quick Tip</h3>
          <p className="text-blue-200">
            Remember: Patience is key in cultivation. Rushing can lead to Qi deviation!
          </p>
        </div>
      </div>
    </div>
  );
}