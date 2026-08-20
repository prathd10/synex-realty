import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({
  label,
  value,
  secondary,
  change,
  isPositive = true,
  sparklineData = [30, 45, 38, 62, 55, 78, 92, 85, 110],
  accentColor = '#C5A880',
  icon: Icon
}) {
  // Generate smooth SVG polyline points from sparklineData
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min || 1;
  const width = 100;
  const height = 32;
  const points = sparklineData
    .map((val, i) => {
      const x = (i / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="relative group overflow-hidden glass border border-white/10 hover:border-accent/40 rounded-2xl p-5 shadow-luxury transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 bg-gradient-to-b from-white/[0.04] to-white/[0.01]">
      {/* Subtle background glow on hover */}
      <div className="absolute -right-8 -top-8 w-28 h-28 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-all duration-500 pointer-events-none" />

      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/25 flex items-center justify-center text-accent shrink-0">
              <Icon size={15} />
            </div>
          )}
          <div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-cream/50">{label}</div>
            {secondary && <div className="text-[9px] text-cream/35 tracking-wide">{secondary}</div>}
          </div>
        </div>

        {change && (
          <div
            className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isPositive
                ? 'text-emerald-400 bg-emerald-950/30 border-emerald-800/30'
                : 'text-rose-400 bg-rose-950/30 border-rose-800/30'
            }`}
          >
            {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            <span>{change}</span>
          </div>
        )}
      </div>

      <div className="flex items-end justify-between gap-4 mt-2">
        <div className="font-serif font-bold text-2xl lg:text-3xl text-white tracking-tight">
          {value}
        </div>

        {/* Sparkline Visual */}
        <div className="w-24 h-8 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id={`grad-${label.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accentColor} stopOpacity="0.5" />
                <stop offset="100%" stopColor={accentColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <polyline
              fill="none"
              stroke={accentColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
