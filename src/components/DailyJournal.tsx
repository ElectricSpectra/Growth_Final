import React, { useState } from 'react';
import { Brain, Heart, DollarSign, Zap, Star, Activity, Calendar } from 'lucide-react';

const categories = [
  { name: 'Spiritual', icon: Star, color: 'text-white' },
  { name: 'Physical', icon: Activity, color: 'text-white' },
  { name: 'Mental', icon: Brain, color: 'text-white' },
  { name: 'Economic', icon: DollarSign, color: 'text-white' },
  { name: 'Emotional', icon: Heart, color: 'text-white' },
  { name: 'General', icon: Zap, color: 'text-white' },
];

function DailyJournal() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(categories.map(cat => [cat.name, 0]))
  );

  const handleScore = (category: string, value: number) => {
    setScores(prev => {
      const newScores = { ...prev, [category]: prev[category] + value };
      // Add animation class to the button
      const btn = document.querySelector(`[data-category="${category}"][data-value="${value}"]`);
      btn?.classList.add('scale-110');
      setTimeout(() => btn?.classList.remove('scale-110'), 200);
      return newScores;
    });
  };

  return (
    <div className="bg-black rounded-xl p-6 shadow-xl border border-white/10 neon-border">
      <div className="flex items-center justify-between mb-6">
        <div className="mb-10"> {/* Added wrapper div with margin */}
          <h2 className="text-xl font-semibold flex items-center gap-3 glow-sm">
            <Star className="w-6 h-6 text-white" />
            Daily Journal
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-white/70" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent border border-white/10 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-white/30 neon-border"
          />
        </div>
      </div>
      
      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.name} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <category.icon className={`w-5 h-5 ${category.color}`} />
                <h3 className="font-medium tracking-wide">{category.name}</h3>
              </div>
              <span className={`text-lg font-semibold ${
                scores[category.name] > 0 ? 'text-emerald-400' :
                scores[category.name] < 0 ? 'text-red-400' : 'text-white/50'
              }`}>
                {scores[category.name] > 0 ? '+' : ''}{scores[category.name]}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">Wins</label>
                <textarea
                  className="w-full bg-white/5 rounded-lg border border-white/10 p-3 text-sm focus:ring-2 focus:ring-white/30 focus:border-transparent neon-border"
                  rows={2}
                  placeholder={`What were your ${category.name.toLowerCase()} wins today?`}
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Losses</label>
                <textarea
                  className="w-full bg-white/5 rounded-lg border border-white/10 p-3 text-sm focus:ring-2 focus:ring-white/30 focus:border-transparent neon-border"
                  rows={2}
                  placeholder={`What were your ${category.name.toLowerCase()} losses today?`}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                data-category={category.name}
                data-value={1}
                onClick={() => handleScore(category.name, 1)}
                className="px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 transition-all duration-200 text-sm border border-emerald-500/30 text-emerald-400 neon-border hover:scale-105"
              >
                +1 Win
              </button>
              <button
                data-category={category.name}
                data-value={-1}
                onClick={() => handleScore(category.name, -1)}
                className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-all duration-200 text-sm border border-red-500/30 text-red-400 neon-border hover:scale-105"
              >
                -1 Loss
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DailyJournal;