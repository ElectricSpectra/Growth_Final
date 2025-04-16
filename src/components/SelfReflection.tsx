import React from 'react';
import { BookOpen, Smile, Meh, Frown } from 'lucide-react';

function SelfReflection() {
  return (
    <div className="bg-black rounded-xl p-6 shadow-xl border border-white/10 neon-border">
      <div className="mb-10"> {/* Wrap heading in div with margin */}
        <h2 className="text-xl font-semibold flex items-center gap-3 glow-sm">
          <BookOpen className="w-6 h-6 text-white" />
          Self Reflection
        </h2>
      </div>
      <div className="space-y-6">
        {/* Productivity */}
        <div>
          <label className="block text-sm text-white/70 mb-2">Productivity (1-10)</label>
          <input
            type="range"
            min="1"
            max="10"
            className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-white"
          />
          <div className="flex justify-between text-sm text-white/50 mt-1">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>

        {/* Mood */}
        <div>
          <label className="block text-sm text-white/70 mb-2">Today's Mood</label>
          <div className="flex justify-center space-x-8">
            <button className="p-3 rounded-full hover:bg-white/10 transition-colors neon-border">
              <Smile className="w-8 h-8 text-emerald-400" />
            </button>
            <button className="p-3 rounded-full hover:bg-white/10 transition-colors neon-border">
              <Meh className="w-8 h-8 text-amber-400" />
            </button>
            <button className="p-3 rounded-full hover:bg-white/10 transition-colors neon-border">
              <Frown className="w-8 h-8 text-red-400" />
            </button>
          </div>
        </div>

        {/* Gratitude */}
        <div>
          <label className="block text-sm text-white/70 mb-2">Today I am thankful for:</label>
          <div className="space-y-2">
            <input
              type="text"
              className="w-full bg-white/5 rounded-lg border border-white/10 p-3 text-sm focus:ring-2 focus:ring-white/30 focus:border-transparent neon-border"
              placeholder="First gratitude..."
            />
            <input
              type="text"
              className="w-full bg-white/5 rounded-lg border border-white/10 p-3 text-sm focus:ring-2 focus:ring-white/30 focus:border-transparent neon-border"
              placeholder="Second gratitude..."
            />
          </div>
        </div>

        {/* Proud of */}
        <div>
          <label className="block text-sm text-white/70 mb-2">Today I am proud of:</label>
          <div className="space-y-2">
            <input
              type="text"
              className="w-full bg-white/5 rounded-lg border border-white/10 p-3 text-sm focus:ring-2 focus:ring-white/30 focus:border-transparent neon-border"
              placeholder="First achievement..."
            />
            <input
              type="text"
              className="w-full bg-white/5 rounded-lg border border-white/10 p-3 text-sm focus:ring-2 focus:ring-white/30 focus:border-transparent neon-border"
              placeholder="Second achievement..."
            />
          </div>
        </div>

        {/* Daily Note */}
        <div>
          <label className="block text-sm text-white/70 mb-2">Today's Note</label>
          <textarea
            className="w-full bg-white/5 rounded-lg border border-white/10 p-3 text-sm focus:ring-2 focus:ring-white/30 focus:border-transparent neon-border"
            rows={4}
            placeholder="Write your thoughts for the day..."
          />
        </div>
      </div>
    </div>
  );
}

export default SelfReflection;