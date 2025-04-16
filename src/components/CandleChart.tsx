import React from 'react';
import { TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

interface ChartData {
  date: string;
  productivity: number;
  mood: number;
  overall: number;
}

const generateMockData = (days: number): ChartData[] => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Generate more realistic data with trends
    const dayProgress = i / (days - 1); // 0 to 1
    const trendBase = Math.sin(dayProgress * Math.PI) * 2; // Creates a wave pattern
    const randomVariation = (Math.random() - 0.5) * 2; // Random variation
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      productivity: Math.min(10, Math.max(1, 5 + trendBase + randomVariation)),
      mood: Math.min(10, Math.max(1, 6 + Math.cos(dayProgress * Math.PI) * 2 + randomVariation)),
      overall: Math.min(10, Math.max(1, 5.5 + trendBase * 0.8 + randomVariation * 0.5))
    };
  });
};

const mockChartData = {
  week: generateMockData(7),
  month: generateMockData(30)
};

interface CandleChartProps {
  title?: string;
  timeframe: 'week' | 'month';
}

function CandleChart({ title = 'Progress Chart', timeframe = 'week' }: CandleChartProps) {
  const data = mockChartData[timeframe];
  
  const getPathFromPoints = (points: number[][]): string => {
    return points.reduce((path, [x, y], i) => {
      return path + (i === 0 ? `M ${x},${y}` : ` L ${x},${y}`);
    }, '');
  };

  const generateDataPoints = (metric: keyof ChartData) => {
    return data.map((point, i) => [
      (i / (data.length - 1)) * 100,
      (1 - (point[metric] - 1) / 9) * 80 + 10
    ]);
  };

  const productivityPoints = generateDataPoints('productivity');
  const moodPoints = generateDataPoints('mood');
  const overallPoints = generateDataPoints('overall');

  return (
    <div className="bg-black rounded-xl p-6 shadow-xl border border-white/10 neon-border" data-timeframe={timeframe}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 glow-sm">
          <TrendingUp className="w-5 h-5 text-white" />
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <button className="p-1 rounded-lg hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1 rounded-lg hover:bg-white/10 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="h-64 relative">
        {/* Grid */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Horizontal grid lines with labels */}
            {Array.from({ length: 10 }).map((_, i) => (
              <g key={`grid-${i}`}>
                <line
                  x1="0"
                  y1={`${i * 10}`}
                  x2="100"
                  y2={`${i * 10}`}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="0.2"
                  vectorEffect="non-scaling-stroke"
                />
                <text
                  x="-3"
                  y={`${i * 10}`}
                  fill="rgba(255, 255, 255, 0.5)"
                  fontSize="3"
                  dominantBaseline="middle"
                >
                  {10 - i}
                </text>
              </g>
            ))}
            
            {/* Vertical grid lines */}
            {data.map((_, i) => (
              <line
                key={`v-${i}`}
                x1={`${(i / (data.length - 1)) * 100}`}
                y1="0"
                x2={`${(i / (data.length - 1)) * 100}`}
                y2="100"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="0.2"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
        </div>

        {/* Chart Lines */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="productivity-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="mood-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="overall-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
              </linearGradient>
              
              {/* Glow filters */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Area fills */}
            <path
              d={`${getPathFromPoints(productivityPoints)} L 100,100 L 0,100 Z`}
              fill="url(#productivity-gradient)"
              className="transition-all duration-300"
            />
            <path
              d={`${getPathFromPoints(moodPoints)} L 100,100 L 0,100 Z`}
              fill="url(#mood-gradient)"
              className="transition-all duration-300"
            />
            <path
              d={`${getPathFromPoints(overallPoints)} L 100,100 L 0,100 Z`}
              fill="url(#overall-gradient)"
              className="transition-all duration-300"
            />

            {/* Lines */}
            <path
              d={getPathFromPoints(productivityPoints)}
              fill="none"
              stroke="#10B981"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
              className="chart-line transition-all duration-300"
            />
            <path
              d={getPathFromPoints(moodPoints)}
              fill="none"
              stroke="#60A5FA"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
              className="chart-line transition-all duration-300"
            />
            <path
              d={getPathFromPoints(overallPoints)}
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
              className="chart-line transition-all duration-300"
            />

            {/* Data Points - Only show for weekly view */}
            {timeframe === 'week' && data.map((point, i) => {
              const x = (i / (data.length - 1)) * 100;
              return (
                <g key={i}>
                  {/* Productivity Point */}
                  <g className="chart-point">
                    <circle
                      cx={x}
                      cy={(1 - (point.productivity - 1) / 9) * 80 + 10}
                      r="1.5"
                      fill="#10B981"
                      className="transition-all duration-300"
                      filter="url(#glow)"
                    >
                      <title>{`Productivity: ${point.productivity.toFixed(1)} (${point.date})`}</title>
                    </circle>
                    <circle
                      cx={x}
                      cy={(1 - (point.productivity - 1) / 9) * 80 + 10}
                      r="0.8"
                      fill="#ffffff"
                      className="transition-all duration-300"
                    />
                  </g>

                  {/* Mood Point */}
                  <g className="chart-point">
                    <circle
                      cx={x}
                      cy={(1 - (point.mood - 1) / 9) * 80 + 10}
                      r="1.5"
                      fill="#60A5FA"
                      className="transition-all duration-300"
                      filter="url(#glow)"
                    >
                      <title>{`Mood: ${point.mood.toFixed(1)} (${point.date})`}</title>
                    </circle>
                    <circle
                      cx={x}
                      cy={(1 - (point.mood - 1) / 9) * 80 + 10}
                      r="0.8"
                      fill="#ffffff"
                      className="transition-all duration-300"
                    />
                  </g>

                  {/* Overall Point */}
                  <g className="chart-point">
                    <circle
                      cx={x}
                      cy={(1 - (point.overall - 1) / 9) * 80 + 10}
                      r="1.5"
                      fill="#8B5CF6"
                      className="transition-all duration-300"
                      filter="url(#glow)"
                    >
                      <title>{`Overall: ${point.overall.toFixed(1)} (${point.date})`}</title>
                    </circle>
                    <circle
                      cx={x}
                      cy={(1 - (point.overall - 1) / 9) * 80 + 10}
                      r="0.8"
                      fill="#ffffff"
                      className="transition-all duration-300"
                    />
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
          {data.map((point, i) => (
            <span key={i} className="text-xs text-white/50 transform rotate-45 origin-left">
              {point.date}
            </span>
          ))}
        </div>

        {/* Legend */}
        <div className="absolute top-0 right-0 flex flex-col gap-2 bg-black/50 p-2 rounded">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#10B981]" />
            <span className="text-xs text-white/70">Productivity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#60A5FA]" />
            <span className="text-xs text-white/70">Mood</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
            <span className="text-xs text-white/70">Overall</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandleChart;