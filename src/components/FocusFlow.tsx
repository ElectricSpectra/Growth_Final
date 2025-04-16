import React, { useState, useEffect, useCallback } from 'react';
import { Timer, Pause, Play, RotateCcw, Settings, TrendingUp, History, CheckCircle2 } from 'lucide-react';

interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  mode: 'focus' | 'break';
  rounds: number;
}

interface FocusSession {
  id: string;
  date: string;
  duration: number;
  type: 'focus' | 'break';
  completed: boolean;
  taskDescription?: string;
}

const mockSessions: FocusSession[] = [
  {
    id: '1',
    date: '2025-04-16T09:30:00',
    duration: 1500, // 25 minutes in seconds
    type: 'focus',
    completed: true,
    taskDescription: 'Project Planning'
  },
  {
    id: '2',
    date: '2025-04-16T10:00:00',
    duration: 300, // 5 minutes in seconds
    type: 'break',
    completed: true
  }
];

function FocusFlow() {
  const [sessions, setSessions] = useState<FocusSession[]>(mockSessions);
  const [timer, setTimer] = useState<TimerState>({
    minutes: 25,
    seconds: 0,
    isRunning: false,
    mode: 'focus',
    rounds: 0
  });
  const [showHistory, setShowHistory] = useState(false);

  const resetTimer = useCallback(() => {
    setTimer(prev => ({
      ...prev,
      minutes: prev.mode === 'focus' ? 25 : 5,
      seconds: 0,
      isRunning: false
    }));
  }, []);

  const toggleTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const switchMode = useCallback(() => {
    setTimer(prev => ({
      ...prev,
      mode: prev.mode === 'focus' ? 'break' : 'focus',
      rounds: prev.mode === 'focus' ? prev.rounds + 1 : prev.rounds,
      isRunning: false
    }));
    resetTimer();
  }, [resetTimer]);

  const completeSession = useCallback(() => {
    const newSession: FocusSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration: timer.mode === 'focus' ? 1500 : 300,
      type: timer.mode,
      completed: true
    };
    setSessions(prev => [newSession, ...prev]);
  }, [timer.mode]);

  const finishSession = useCallback(() => {
    if (timer.isRunning) {
      const newSession: FocusSession = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        duration: (25 - timer.minutes) * 60 + (60 - timer.seconds), // actual duration
        type: timer.mode,
        completed: true
      };
      setSessions(prev => [newSession, ...prev]);
      resetTimer();
      setTimer(prev => ({ ...prev, isRunning: false }));
    }
  }, [timer, resetTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer.isRunning) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev.minutes === 0 && prev.seconds === 0) {
            clearInterval(interval);
            completeSession();
            switchMode();
            return prev;
          }

          if (prev.seconds === 0) {
            return {
              ...prev,
              minutes: prev.minutes - 1,
              seconds: 59
            };
          }

          return {
            ...prev,
            seconds: prev.seconds - 1
          };
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer.isRunning, switchMode, completeSession]);

  // Calculate progress percentage
  const totalSeconds = timer.mode === 'focus' ? 25 * 60 : 5 * 60;
  const currentSeconds = timer.minutes * 60 + timer.seconds;
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;
  const strokeDashoffset = 283 - (283 * progress) / 100;

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2 glow-sm">
          <Timer className="w-6 h-6" />
          Focus Flow
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/50">Total Sessions: {sessions.length}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Timer Section */}
        <div className="bg-black rounded-xl p-6 border border-white/10 neon-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 glow-sm">
              <Timer className="w-5 h-5" />
              Focus Flow
            </h2>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm ${
                timer.mode === 'focus' 
                  ? 'bg-purple-500/20 text-purple-300' 
                  : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {timer.mode === 'focus' ? 'Focus Time' : 'Break Time'}
              </span>
              <span className="text-white/50 text-sm">Round {timer.rounds + 1}</span>
            </div>
          </div>

          <div className="relative w-64 h-64 mx-auto">
            {/* Enhanced Progress Ring */}
            <svg className="w-full h-full transform -rotate-90">
              {/* Background ripple effect */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
                className="animate-pulse"
              />
              {/* Main progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={timer.mode === 'focus' ? 'url(#focusGradient)' : 'url(#breakGradient)'}
                strokeWidth="3"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 drop-shadow-glow"
              />
              {/* Enhanced gradients */}
              <defs>
                <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="50%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#4F46E5" />
                </linearGradient>
                <linearGradient id="breakGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="50%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#6EE7B7" />
                </linearGradient>
              </defs>
            </svg>

            {/* Enhanced Time Display */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className={`text-5xl font-bold ${timer.isRunning ? 'animate-pulse' : ''}`}>
                {String(timer.minutes).padStart(2, '0')}:
                {String(timer.seconds).padStart(2, '0')}
              </span>
              <p className="text-white/50 text-sm mt-2">{timer.mode === 'focus' ? 'Focus Session' : 'Break Time'}</p>
            </div>

            {/* Enhanced Controls */}
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
              <button
                onClick={resetTimer}
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/10 neon-border focus-timer-btn"
                title="Reset Timer"
              >
                <RotateCcw className="w-6 h-6 text-white/80" />
              </button>
              <button
                onClick={toggleTimer}
                className="p-4 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/10 neon-border focus-timer-btn"
                title={timer.isRunning ? 'Pause' : 'Start'}
              >
                {timer.isRunning ? (
                  <Pause className="w-8 h-8 text-red-400" />
                ) : (
                  <Play className="w-8 h-8 text-emerald-400" />
                )}
              </button>
              <button
                onClick={finishSession}
                disabled={!timer.isRunning}
                className={`p-3 rounded-full transition-all border border-white/10 neon-border focus-timer-btn ${
                  timer.isRunning 
                    ? 'bg-emerald-500/20 hover:bg-emerald-500/30 cursor-pointer' 
                    : 'bg-white/5 cursor-not-allowed opacity-50'
                }`}
                title="Finish Session"
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Session History Section */}
        <div className="bg-black/50 rounded-xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <History className="w-5 h-5" />
              Recent Sessions
            </h3>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
            {sessions.map(session => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    session.type === 'focus' ? 'bg-purple-400' : 'bg-emerald-400'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">
                      {new Date(session.date).toLocaleTimeString()}
                    </p>
                    <p className="text-xs text-white/50">
                      {session.type === 'focus' ? 'Focus Session' : 'Break Time'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {Math.floor(session.duration / 60)} mins
                  </p>
                  <p className="text-xs text-white/50">
                    {new Date(session.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FocusFlow;