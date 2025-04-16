import React from 'react';
import { TrendingUp, Award, Target } from 'lucide-react';
import CandleChart from './CandleChart';

const mockMonthlyStats = {
  totalWins: 45,
  totalLosses: 15,
  streaks: {
    current: 5,
    best: 8
  },
  improvements: [
    { category: 'Spiritual', progress: 75 },
    { category: 'Physical', progress: 60 },
    { category: 'Mental', progress: 85 },
    { category: 'Economic', progress: 70 },
    { category: 'Emotional', progress: 90 },
    { category: 'General', progress: 80 }
  ]
};

function MonthlyProgress() {
  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black rounded-xl p-6 border border-white/10 neon-border hover:scale-105 transition-transform duration-300">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold">Monthly Balance</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-400 glow-sm">+{mockMonthlyStats.totalWins - mockMonthlyStats.totalLosses}</p>
          <p className="text-white/70 mt-2">
            {mockMonthlyStats.totalWins} wins / {mockMonthlyStats.totalLosses} losses
          </p>
        </div>

        <div className="bg-black rounded-xl p-6 border border-white/10 neon-border hover:scale-105 transition-transform duration-300">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-semibold">Current Streak</h3>
          </div>
          <p className="text-3xl font-bold text-amber-400 glow-sm">{mockMonthlyStats.streaks.current} days</p>
          <p className="text-white/70 mt-2">Keep going strong!</p>
        </div>

        <div className="bg-black rounded-xl p-6 border border-white/10 neon-border hover:scale-105 transition-transform duration-300">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold">Best Streak</h3>
          </div>
          <p className="text-3xl font-bold text-purple-400 glow-sm">{mockMonthlyStats.streaks.best} days</p>
          <p className="text-white/70 mt-2">Your record to beat</p>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="bg-black rounded-xl p-6 border border-white/10 neon-border">
        <h3 className="text-xl font-semibold mb-6">Category Progress</h3>
        <div className="space-y-6">
          {mockMonthlyStats.improvements.map((item) => (
            <div key={item.category}>
              <div className="flex justify-between mb-2">
                <span className="text-white/70">{item.category}</span>
                <span className="text-white/90">{item.progress}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-white/30 to-white/50 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Chart */}
      <CandleChart title="Monthly Overview" timeframe="month" />
    </div>
  );
}

export default MonthlyProgress;