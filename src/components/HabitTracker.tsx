import React from 'react';
import { XCircle } from 'lucide-react';

function HabitTracker() {
  return (
    <div className="bg-black rounded-xl p-6 shadow-xl border border-white/10 neon-border">
      
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-white/70 mb-2">What habit are you trying to overcome?</label>
          <input
            type="text"
            className="w-full bg-white/5 rounded-lg border border-white/10 p-3 text-sm focus:ring-2 focus:ring-white/30 focus:border-transparent neon-border"
            placeholder="Enter the habit you want to overcome..."
          />
        </div>
        
        <div className="flex space-x-4">
          <button className="flex-1 px-4 py-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors border border-emerald-500/30 text-emerald-400 neon-border">
            I Resisted Today 💪
          </button>
          <button className="flex-1 px-4 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors border border-red-500/30 text-red-400 neon-border">
            Couldn't Resist Today 😔
          </button>
        </div>
      </div>
    </div>
  );
}

export default HabitTracker;