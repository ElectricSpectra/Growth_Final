import React, { useState } from 'react';
import { User, Award, Target, Zap, Star, Trophy, TrendingUp, Clock } from 'lucide-react';

interface Achievement {
  id: number;
  title: string;
  date: string;
  icon: any;
  color: string;
}

interface Stats {
  focusHours: number;
  completedTasks: number;
  currentStreak: number;
  totalAchievements: number;
}

const mockData = {
  user: {
    name: "Alex Chen",
    title: "Growth Seeker",
    joinedDate: "2025-01-15",
    avatar: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Alex",
    level: 7,
    xp: 2750,
    nextLevelXp: 3000
  },
  stats: {
    focusHours: 127,
    completedTasks: 342,
    currentStreak: 12,
    totalAchievements: 24
  },
  recentAchievements: [
    {
      id: 1,
      title: "Focus Master",
      date: "2025-04-15",
      icon: Zap,
      color: "text-yellow-400"
    },
    {
      id: 2,
      title: "Streak Warrior",
      date: "2025-04-14",
      icon: Trophy,
      color: "text-purple-400"
    }
  ]
};

function Profile() {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements'>('overview');

  const xpProgress = (mockData.user.xp / mockData.user.nextLevelXp) * 100;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Profile Header */}
      <div className="bg-black rounded-xl p-8 border border-white/10 neon-border relative overflow-hidden">
        {/* Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
        
        <div className="relative flex items-start gap-8">
          {/* Avatar Section */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-2 border-white/20 overflow-hidden relative">
              <img 
                src={mockData.user.avatar} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-purple-500 rounded-full p-2 border-2 border-black">
              <Star className="w-4 h-4" />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold glow">{mockData.user.name}</h1>
              <p className="text-white/60">{mockData.user.title}</p>
            </div>

            {/* Level Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Level {mockData.user.level}</span>
                <span className="text-sm text-white/60">{mockData.user.xp} / {mockData.user.nextLevelXp} XP</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-300 rounded-full transition-all duration-1000"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { icon: Clock, label: 'Focus Hours', value: mockData.stats.focusHours },
                { icon: Target, label: 'Tasks Done', value: mockData.stats.completedTasks },
                { icon: Zap, label: 'Current Streak', value: mockData.stats.currentStreak },
                { icon: Award, label: 'Achievements', value: mockData.stats.totalAchievements }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all group"
                >
                  <stat.icon className="w-5 h-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-2xl font-bold glow-sm">{stat.value}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-black rounded-xl p-6 border border-white/10 neon-border">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Recent Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockData.recentAchievements.map((achievement) => (
            <div 
              key={achievement.id}
              className="group relative bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
              <div className="relative flex items-center gap-4">
                <div className={`p-2 rounded-lg bg-white/5 ${achievement.color}`}>
                  <achievement.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium">{achievement.title}</h3>
                  <p className="text-sm text-white/60">{achievement.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;