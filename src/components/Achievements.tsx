import React from 'react';
import { Award, Flame, Star, Zap, Trophy, Target, Heart, Brain, Dumbbell } from 'lucide-react';
import Flamometer from './Flamometer';

const mockAchievements = {
  streakData: {
    currentStreak: 7,
    longestStreak: 21,
    totalDays: 45
  },
  recent: [
    {
      id: 1,
      title: "Mind Master",
      description: "Completed 30 days of meditation",
      date: "2025-04-15",
      icon: Brain,
      color: "text-cyan-400",
      rarity: "Rare"
    },
    {
      id: 2,
      title: "Iron Will",
      description: "Maintained a 7-day streak",
      date: "2025-04-14",
      icon: Flame,
      color: "text-orange-400",
      rarity: "Common"
    }
  ],
  categories: [
    {
      name: "Physical",
      progress: 70,
      achievements: 12,
      total: 20,
      icon: Dumbbell,
      color: "from-red-500"
    },
    {
      name: "Mental",
      progress: 85,
      achievements: 17,
      total: 20,
      icon: Brain,
      color: "from-blue-500"
    },
    {
      name: "Emotional",
      progress: 60,
      achievements: 9,
      total: 15,
      icon: Heart,
      color: "from-pink-500"
    }
  ]
};

function StreakFlame({ days }: { days: number }) {
  const getFlameColors = () => {
    if (days >= 30) return 'text-red-500 group-hover:text-red-400';
    if (days >= 14) return 'text-orange-500 group-hover:text-orange-400';
    return 'text-yellow-500 group-hover:text-yellow-400';
  };

  return (
    <div className="group relative">
      <div className={`absolute -inset-1 rounded-lg bg-gradient-to-r from-white/20 to-transparent opacity-75 group-hover:opacity-100 blur transition-all`} />
      <div className="relative flex items-center gap-3 bg-black rounded-lg p-4 border border-white/10">
        <Flame className={`w-8 h-8 ${getFlameColors()} animate-pulse transition-colors`} />
        <div>
          <div className="text-2xl font-bold">{days} days</div>
          <div className="text-white/60 text-sm">Current Streak</div>
        </div>
      </div>
    </div>
  );
}

function AchievementCard({ achievement }: { achievement: typeof mockAchievements.recent[0] }) {
  const IconComponent = achievement.icon;
  
  return (
    <div className="group relative">
      <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-white/20 to-transparent opacity-75 group-hover:opacity-100 blur transition-all" />
      <div className="relative bg-black rounded-lg p-6 border border-white/10 hover:scale-[1.02] transition-transform">
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-lg bg-white/5 ${achievement.color}`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-white/10">{achievement.rarity}</span>
        </div>
        <h3 className="text-lg font-semibold mt-4">{achievement.title}</h3>
        <p className="text-white/60 text-sm mt-2">{achievement.description}</p>
        <div className="text-white/40 text-xs mt-4">Unlocked {achievement.date}</div>
      </div>
    </div>
  );
}

function Achievements() {
  return (
    <div className="space-y-16 p-10">
      {/* Streak Flamometer Section */}
      <div className="bg-black rounded-xl p-10 border border-white/10 neon-border">
        <h2 className="text-xl font-semibold mb-10 text-center glow-sm">Streak Flamometer</h2>
        <div className="max-w-lg mx-auto">
          <Flamometer 
            streak={mockAchievements.streakData.currentStreak} 
            maxStreak={mockAchievements.streakData.longestStreak} 
          />
        </div>
      </div>

      {/* Streak Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <StreakFlame days={mockAchievements.streakData.currentStreak} />
        <div className="relative">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-500/20 to-transparent opacity-75 blur" />
          <div className="relative bg-black rounded-lg p-4 border border-white/10">
            <Trophy className="w-8 h-8 text-purple-400 mb-2" />
            <div className="text-2xl font-bold">{mockAchievements.streakData.longestStreak} days</div>
            <div className="text-white/60 text-sm">Longest Streak</div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-emerald-500/20 to-transparent opacity-75 blur" />
          <div className="relative bg-black rounded-lg p-4 border border-white/10">
            <Star className="w-8 h-8 text-emerald-400 mb-2" />
            <div className="text-2xl font-bold">{mockAchievements.streakData.totalDays} days</div>
            <div className="text-white/60 text-sm">Total Journey</div>
          </div>
        </div>
      </div>

      {/* Categories Progress */}
      <div className="bg-black rounded-xl p-10 border border-white/10">
        <h2 className="text-xl font-semibold mb-10 flex items-center gap-2">
          <Award className="w-6 h-6 text-white" />
          Achievement Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {mockAchievements.categories.map((category) => (
            <div key={category.name} className="group relative">
              <div className={`absolute -inset-1 rounded-lg bg-gradient-to-r ${category.color} to-transparent opacity-50 group-hover:opacity-75 blur transition-all`} />
              <div className="relative bg-black rounded-lg p-4 border border-white/10">
                <category.icon className={`w-6 h-6 ${category.color.replace('from-', 'text-')} mb-2`} />
                <h3 className="font-semibold">{category.name}</h3>
                <div className="mt-2 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${category.color} to-transparent rounded-full transition-all duration-1000`}
                    style={{ width: `${category.progress}%` }}
                  />
                </div>
                <div className="mt-2 text-sm text-white/60">
                  {category.achievements}/{category.total} completed
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-black rounded-xl p-10 border border-white/10">
        <h2 className="text-xl font-semibold mb-10 flex items-center gap-2">
          <Zap className="w-6 h-6 text-white" />
          Recent Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {mockAchievements.recent.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Achievements;