import React, { useState } from 'react';
// Import Link and Outlet from react-router-dom
import { BrowserRouter as Router, Routes, Route, Navigate, Link, Outlet } from 'react-router-dom'; 
import { Moon, Sun, Star, Calendar, LayoutDashboard, TrendingUp, Menu, X, Timer, User, Settings, LogOut, LineChart, Award } from 'lucide-react'; // Added Award for consistency
import DailyJournal from './components/DailyJournal';
import HabitTracker from './components/HabitTracker';
import SelfReflection from './components/SelfReflection';
import CandleChart from './components/CandleChart';
import MonthlyProgress from './components/MonthlyProgress';
import Achievements from './components/Achievements';
import FocusFlow from './components/FocusFlow';
import Profile from './components/Profile';
import MonthlyGrowthRecap from './components/MonthlyGrowthRecap';

// Define a Layout component for the main app structure
function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  // Use location to determine active link
  const location = useLocation(); 

  const menuItems = [
    // Update `to` prop for Link
    { id: 'daily', path: '/app/daily', label: 'Daily Journal', icon: LayoutDashboard },
    { id: 'monthly', path: '/app/monthly', label: 'Monthly Progress', icon: Calendar },
    { id: 'achievements', path: '/app/achievements', label: 'Achievements', icon: TrendingUp },
    { id: 'focus', path: '/app/focus', label: 'Focus Timer', icon: Timer },
    { id: 'recap', path: '/app/recap', label: 'Growth Recap', icon: LineChart },
  ];

  const mockUser = {
    name: "Alex Chen",
    avatar: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Alex",
    level: 7
  };

  // Function to determine if a link is active
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className={`fixed lg:static lg:flex h-screen bg-black border-r border-white/10 transition-all duration-300 z-50 ${isSidebarOpen ? 'w-64' : 'w-0 lg:w-20'}`}>
        <div className="flex flex-col h-full w-64 lg:w-full">
          {/* ... (Sidebar Header - unchanged) ... */}
          <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-white animate-pulse" />
                <h1 className={`text-xl font-bold glow tracking-wider transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100'}`}>
                  GROWTH
                </h1>
              </div>
            </div>

          <nav className="flex-1 p-4">
            {menuItems.map((item) => (
              // Use Link instead of button
              <Link
                key={item.id}
                to={item.path} // Use path for routing
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive(item.path) // Check if active based on path
                    ? 'bg-white/10 neon-border'
                    : 'hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className={`transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100'}`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* ... (Sidebar Footer/Profile - modified to use Link for Profile) ... */}
          <div className="p-4 border-t border-white/10">
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-all duration-300"
                aria-haspopup="true" // Accessibility
                aria-expanded={showProfileMenu} // Accessibility
              >
                {/* ... (user avatar etc) ... */}
                 <div className="relative">
                  <img
                    src={mockUser.avatar}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border border-white/20"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-500 rounded-full border-2 border-black flex items-center justify-center">
                    <span className="text-[10px] font-bold">{mockUser.level}</span>
                  </div>
                </div>
                <div className={`flex-1 text-left transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100'}`}>
                  <div className="font-medium truncate">{mockUser.name}</div>
                  <div className="text-xs text-white/50">View Profile</div>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute bottom-full left-0 w-full mb-2 bg-black border border-white/10 rounded-lg shadow-xl animate-fadeIn">
                  {/* Use Link for Profile navigation */}
                  <Link
                    to="/app/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  {/* ... (Settings, Log Out buttons - keep as button or implement actions) ... */}
                   <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <div className="border-t border-white/10" />
                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-red-400 transition-all">
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Use Outlet to render nested routes */}
      <main className="flex-1 overflow-auto">
        {/* Outlet will render the matched child route component */}
        <Outlet /> 
      </main>
    </div>
  );
}


// --- Define Components for Daily View ---
// You might want these in separate files eventually
function DailyView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 animate-fadeIn">
      <div className="space-y-8">
        <DailyJournal />
        <HabitTracker />
      </div>
      <div className="space-y-8">
        <SelfReflection />
        <CandleChart title="Weekly Progress" timeframe="week" />
      </div>
    </div>
  );
}

function MonthlyView() {
  return (
    <div className="p-8 animate-fadeIn">
      <MonthlyProgress />
    </div>
  );
}

function AchievementsView() {
  return (
    <div className="p-8 animate-fadeIn">
      <Achievements />
    </div>
  );
}

function FocusView() {
    return (
        <div className="animate-fadeIn"> {/* Adjust padding/margin as needed */}
            <FocusFlow />
        </div>
    );
}

function RecapView() {
  return (
    <div className="p-8 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold glow-sm mb-2">Growth Recap</h1>
        <p className="text-white/60">Review your holistic growth journey</p>
      </div>
      <MonthlyGrowthRecap />
    </div>
  );
}

function ProfileView() {
    return (
        <div className="animate-fadeIn"> {/* Adjust padding/margin as needed */}
           <Profile />
        </div>
    );
}

// --- Main App Component ---
function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to landing page */}
        <Route path="/" element={<Navigate to="/landing" replace />} />

        {/* Landing page route */}
        <Route
          path="/landing"
          element={
            <div className="min-h-screen bg-black">
              <iframe src="/landing.html" title="Landing Page" className="w-full h-screen border-0" />
            </div>
          }
        />

        {/* Main app route with nested routes */}
        <Route path="/app" element={<AppLayout />}> {/* Use AppLayout as the wrapper */}
          {/* Default route within /app */}
          <Route index element={<Navigate to="daily" replace />} /> 
          <Route path="daily" element={<DailyView />} />
          <Route path="monthly" element={<MonthlyView />} />
          <Route path="achievements" element={<AchievementsView />} />
          <Route path="focus" element={<FocusView />} />
          <Route path="recap" element={<RecapView />} />
          <Route path="profile" element={<ProfileView />} />
          {/* Add other nested routes here */}
        </Route>

        {/* Optional: Catch-all for unknown routes */}
        <Route path="*" element={<Navigate to="/landing" replace />} /> 
      </Routes>
    </Router>
  );
}

// Need to import useLocation for the AppLayout
import { useLocation } from 'react-router-dom'; 

export default App;