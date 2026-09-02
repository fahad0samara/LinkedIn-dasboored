import React, { useState } from 'react';

export interface SparklinePoint {
  month: string;
  value: number;
}

interface KPICardWithSparklineProps {
  title: string;
  value: string;
  subValue?: string;
  badgeText?: string;
  badgeType?: 'positive' | 'negative' | 'neutral' | 'accent';
  subtitle: string;
  accentColor: string; // e.g. '#118DFF'
  data: SparklinePoint[];
  valuePrefix?: string;
  valueSuffix?: string;
  formatTooltip?: (val: number) => string;
  className?: string;
  trendLabel?: string;
}

export const KPICardWithSparkline: React.FC<KPICardWithSparklineProps> = ({
  title,
  value,
  subValue,
  badgeText,
  badgeType = 'positive',
  subtitle,
  accentColor,
  data,
  valuePrefix = '',
  valueSuffix = '',
  formatTooltip,
  className = '',
  trendLabel
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Calculate SVG dimensions and coordinate mapping
  const width = 160;
  const height = 40;
  const paddingX = 4;
  const paddingY = 5;

  const values = data.map(d => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((d.value - minVal) / range) * (height - paddingY * 2);
    return { x, y, data: d };
  });

  // Generate smooth cubic bezier SVG path
  const linePath = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = arr[i - 1];
    const cp1x = prev.x + (pt.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (pt.x - prev.x) / 2;
    const cp2y = pt.y;
    return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${pt.x},${pt.y}`;
  }, '');

  const areaPath = `${linePath} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;

  // Unique gradient ID per card
  const gradId = `spark-grad-${title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;

  // Find max point for indicator
  const maxIndex = values.indexOf(maxVal);
  const maxPoint = points[maxIndex];
  const lastPoint = points[points.length - 1];

  const activePoint = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div 
      className={`bg-white border border-slate-200 rounded-[4px] p-3 shadow-2xs relative overflow-hidden hover:shadow-xs transition-shadow flex flex-col justify-between ${className}`}
      style={{ borderTop: `3px solid ${accentColor}` }}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate pr-1 rtl:pr-0 rtl:pl-1">
          {title}
        </span>

        {badgeText && (
          <span 
            className={`px-1.5 py-0.2 rounded text-[9px] font-semibold tracking-tight shrink-0 border ${
              badgeType === 'positive' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : badgeType === 'accent'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            {badgeText}
          </span>
        )}
      </div>

      {/* Main Callout Number & Sparkline Area */}
      <div className="mt-1 flex items-end justify-between gap-2">
        <div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tracking-tight flex items-baseline space-x-1 rtl:space-x-reverse">
            <span>{value}</span>
            {subValue && <span className="text-xs font-normal text-slate-500 font-sans">{subValue}</span>}
          </div>
        </div>

        {/* Power BI Styled Sparkline Canvas */}
        <div className="relative w-28 sm:w-32 h-10 shrink-0 select-none ltr:origin-left rtl:origin-right">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible"
            onMouseLeave={() => setHoverIndex(null)}
          >
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accentColor} stopOpacity="0.30" />
                <stop offset="100%" stopColor={accentColor} stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Sparkline Gradient Fill */}
            <path d={areaPath} fill={`url(#${gradId})`} />

            {/* Sparkline Main Curve */}
            <path
              d={linePath}
              fill="none"
              stroke={accentColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Baseline grid indicator */}
            <line 
              x1="0" 
              y1={height - 1} 
              x2={width} 
              y2={height - 1} 
              stroke="#e2e8f0" 
              strokeWidth="1" 
              strokeDasharray="2 2" 
            />

            {/* Peak indicator dot */}
            {maxPoint && (
              <circle
                cx={maxPoint.x}
                cy={maxPoint.y}
                r="2"
                fill="#ffffff"
                stroke={accentColor}
                strokeWidth="1.5"
              />
            )}

            {/* End point marker dot */}
            {lastPoint && (
              <circle
                cx={lastPoint.x}
                cy={lastPoint.y}
                r="2.5"
                fill={accentColor}
              />
            )}

            {/* Active hover crosshair and point */}
            {activePoint && (
              <>
                <line
                  x1={activePoint.x}
                  y1={0}
                  x2={activePoint.x}
                  y2={height}
                  stroke={accentColor}
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  opacity="0.6"
                />
                <circle
                  cx={activePoint.x}
                  cy={activePoint.y}
                  r="3.5"
                  fill={accentColor}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </>
            )}

            {/* Invisible hover capture zones */}
            {points.map((pt, idx) => (
              <rect
                key={idx}
                x={pt.x - (width / points.length) / 2}
                y={0}
                width={width / points.length}
                height={height}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoverIndex(idx)}
              />
            ))}
          </svg>

          {/* Interactive Floating Hover Tooltip */}
          {activePoint && (
            <div 
              className="absolute -top-7 z-20 pointer-events-none bg-slate-900 text-white px-1.5 py-0.5 rounded text-[9px] font-mono shadow-sm whitespace-nowrap transform -translate-x-1/2"
              style={{
                left: `${(activePoint.x / width) * 100}%`,
              }}
            >
              {activePoint.data.month}: {formatTooltip ? formatTooltip(activePoint.data.value) : `${valuePrefix}${activePoint.data.value.toLocaleString()}${valueSuffix}`}
            </div>
          )}
        </div>
      </div>

      {/* Subtitle & Trend Footer */}
      <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
        <div className="truncate flex items-center space-x-1 rtl:space-x-reverse">
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }}></span>
          <span className="truncate">{subtitle}</span>
        </div>

        {trendLabel && (
          <span className="font-mono text-[9px] text-slate-400 shrink-0 pl-1 rtl:pl-0 rtl:pr-1">
            {trendLabel}
          </span>
        )}
      </div>
    </div>
  );
};
