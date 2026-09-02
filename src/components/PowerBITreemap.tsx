import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CATEGORY_DATA, COUNTRY_DATA, METRICS_DATA } from '../data/jobData';
import { Language, useTranslation, translateCategory, translateCountry } from '../utils/i18n';
import { CurrencyCode, formatSalary } from '../utils/currency';

// Power BI Official Palette
const PBI_PALETTE = [
  '#118DFF', // Power BI Primary Cobalt Blue
  '#12239E', // Deep Navy
  '#E66C37', // Coral / Orange
  '#6B007B', // Royal Violet
  '#00B7C3', // Cyan / Teal
  '#107C41', // Microsoft Excel Green
  '#D64550', // Crimson Red
  '#D97706', // Amber
  '#008272', // Dark Teal
  '#744DA9', // Medium Purple
  '#5C2E91', // Indigo Violet
  '#B4009E', // Magenta
  '#004E8C', // Steel Blue
  '#8764B8', // Lilac
  '#3B5998', // Classic Slate Blue
  '#498205', // Olive Green
];

export interface TreemapNode {
  id: string;
  name: string;
  category?: string;
  country?: string;
  value: number;
  percentage: number;
  avgSalary?: number;
  remotePct?: number;
  aiPct?: number;
  color: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

interface PowerBITreemapProps {
  mode?: 'category' | 'country' | 'cross';
  height?: number;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  selectedCountry?: string;
  onSelectCountry?: (country: string) => void;
  allowDrilldown?: boolean;
  onDrillThrough?: (target: {
    type: 'category' | 'country' | 'cross';
    title: string;
    category?: string;
    country?: string;
  }) => void;
  language?: Language;
  currency?: CurrencyCode;
}

// Squarified Treemap Algorithm (Bruls, Huizing, van Wijk)
function computeSquarifiedLayout(
  items: TreemapNode[],
  x: number,
  y: number,
  w: number,
  h: number
): TreemapNode[] {
  if (items.length === 0 || w <= 0 || h <= 0) return [];

  const total = items.reduce((sum, item) => sum + item.value, 0);
  if (total <= 0) return [];

  const totalArea = w * h;
  const normalized = items.map(item => ({
    ...item,
    area: (item.value / total) * totalArea,
  })).sort((a, b) => b.area - a.area);

  const result: TreemapNode[] = [];

  function worstAspectRatio(row: typeof normalized, rowWidth: number): number {
    const rowArea = row.reduce((sum, item) => sum + item.area, 0);
    if (rowArea === 0 || rowWidth === 0) return Infinity;
    const rowHeight = rowArea / rowWidth;
    let worst = 0;
    for (const item of row) {
      const itemW = item.area / rowHeight;
      const aspect = Math.max(itemW / rowHeight, rowHeight / itemW);
      if (aspect > worst) worst = aspect;
    }
    return worst;
  }

  function layoutRow(row: typeof normalized, rx: number, ry: number, rw: number, isVertical: boolean) {
    const rowArea = row.reduce((sum, item) => sum + item.area, 0);
    const rowThickness = rowArea / rw;

    let offset = 0;
    for (const item of row) {
      const itemLength = item.area / rowThickness;
      if (isVertical) {
        result.push({
          ...item,
          x: rx,
          y: ry + offset,
          w: rowThickness,
          h: itemLength,
        });
      } else {
        result.push({
          ...item,
          x: rx + offset,
          y: ry,
          w: itemLength,
          h: rowThickness,
        });
      }
      offset += itemLength;
    }
  }

  function squarify(children: typeof normalized, currentX: number, currentY: number, currentW: number, currentH: number) {
    if (children.length === 0) return;
    if (children.length === 1) {
      result.push({
        ...children[0],
        x: currentX,
        y: currentY,
        w: currentW,
        h: currentH,
      });
      return;
    }

    const isVertical = currentW < currentH;
    const sideLength = isVertical ? currentH : currentW;

    const row: typeof normalized = [];
    let remaining = [...children];

    while (remaining.length > 0) {
      const nextItem = remaining[0];
      const testRow = [...row, nextItem];

      if (row.length === 0) {
        row.push(nextItem);
        remaining.shift();
      } else {
        const currentWorst = worstAspectRatio(row, sideLength);
        const nextWorst = worstAspectRatio(testRow, sideLength);

        if (nextWorst <= currentWorst) {
          row.push(nextItem);
          remaining.shift();
        } else {
          break;
        }
      }
    }

    const rowArea = row.reduce((sum, item) => sum + item.area, 0);
    const rowThickness = rowArea / sideLength;

    layoutRow(row, currentX, currentY, sideLength, isVertical);

    if (isVertical) {
      squarify(remaining, currentX + rowThickness, currentY, currentW - rowThickness, currentH);
    } else {
      squarify(remaining, currentX, currentY + rowThickness, currentW, currentH - rowThickness);
    }
  }

  squarify(normalized, x, y, w, h);
  return result;
}

export const PowerBITreemap: React.FC<PowerBITreemapProps> = ({
  mode = 'category',
  height = 320,
  selectedCategory = 'All',
  onSelectCategory,
  selectedCountry = 'All',
  onSelectCountry,
  allowDrilldown = true,
  onDrillThrough,
  language = 'ar',
  currency = 'USD',
}) => {
  const { t } = useTranslation(language);
  const [activeMode, setActiveMode] = useState<'category' | 'country' | 'cross'>(mode);
  const [hoveredNode, setHoveredNode] = useState<TreemapNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 600, height });

  // Update dimensions on resize
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setDimensions({
            width: entry.contentRect.width,
            height: height || 320,
          });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [height]);

  // Construct items based on mode with localized names
  const rawNodes: TreemapNode[] = useMemo(() => {
    if (activeMode === 'category') {
      return CATEGORY_DATA.map((c, idx) => ({
        id: `cat-${c.category}`,
        name: translateCategory(c.category, language),
        category: c.category,
        value: c.jobs,
        percentage: c.share,
        avgSalary: c.avgSalary,
        remotePct: c.remotePct,
        aiPct: c.aiPct,
        color: PBI_PALETTE[idx % PBI_PALETTE.length],
      }));
    } else if (activeMode === 'country') {
      return COUNTRY_DATA.map((c, idx) => ({
        id: `country-${c.country}`,
        name: translateCountry(c.country, language),
        country: c.country,
        value: c.jobs,
        percentage: c.share,
        avgSalary: c.avgSalary,
        remotePct: c.remotePct,
        color: PBI_PALETTE[idx % PBI_PALETTE.length],
      }));
    } else {
      // Cross hierarchy
      const list: TreemapNode[] = [];
      let colorIdx = 0;
      CATEGORY_DATA.slice(0, 6).forEach((cat) => {
        COUNTRY_DATA.slice(0, 4).forEach((cntry) => {
          const val = Math.round((cat.jobs * (cntry.share / 100)));
          if (val > 20) {
            const catName = translateCategory(cat.category, language);
            const cntryName = translateCountry(cntry.country, language);
            list.push({
              id: `cross-${cat.category}-${cntry.country}`,
              name: `${catName}`,
              category: cat.category,
              country: cntry.country,
              value: val,
              percentage: Number(((val / (METRICS_DATA?.total_jobs || 12000)) * 100).toFixed(1)),
              avgSalary: Math.round((cat.avgSalary + cntry.avgSalary) / 2),
              remotePct: cat.remotePct,
              color: PBI_PALETTE[colorIdx % PBI_PALETTE.length],
            });
            colorIdx++;
          }
        });
      });
      return list;
    }
  }, [activeMode, language]);

  // Compute squarified coordinates
  const laidOutNodes = useMemo(() => {
    const padding = 2;
    const w = Math.max(dimensions.width - padding * 2, 100);
    const h = Math.max(dimensions.height - padding * 2, 100);
    return computeSquarifiedLayout(rawNodes, padding, padding, w, h);
  }, [rawNodes, dimensions]);

  // Handle clicking a node for drill-through and cross-filtering
  const handleNodeClick = (node: TreemapNode) => {
    if (onDrillThrough) {
      if (activeMode === 'cross' && node.category && node.country) {
        onDrillThrough({
          type: 'cross',
          title: `${translateCategory(node.category, language)} - ${translateCountry(node.country, language)}`,
          category: node.category,
          country: node.country
        });
      } else if (activeMode === 'country' && node.country) {
        onDrillThrough({
          type: 'country',
          title: translateCountry(node.country, language),
          country: node.country
        });
      } else if (node.category) {
        onDrillThrough({
          type: 'category',
          title: translateCategory(node.category, language),
          category: node.category
        });
      }
      return;
    }

    if (node.category && onSelectCategory) {
      onSelectCategory(selectedCategory === node.category ? 'All' : node.category);
    }
    if (node.country && onSelectCountry && activeMode === 'country') {
      onSelectCountry(selectedCountry === node.country ? 'All' : node.country);
    }
  };

  const isCrossFiltered = selectedCategory !== 'All' || selectedCountry !== 'All';

  return (
    <div className="flex flex-col h-full w-full select-none" ref={containerRef}>
      {/* Power BI Treemap Header Controls & Slicers */}
      {allowDrilldown && (
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 gap-2 flex-wrap text-xs">
          <div className="flex items-center space-x-1 rtl:space-x-reverse font-sans text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700">{language === 'ar' ? 'مستوى التجميع:' : 'Hierarchy Level:'}</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 font-bold">
              {activeMode === 'category' 
                ? (language === 'ar' ? `القطاع التقني (${CATEGORY_DATA.length})` : `Industry Category (${CATEGORY_DATA.length})`) 
                : activeMode === 'country' 
                ? (language === 'ar' ? `الدولة (${COUNTRY_DATA.length})` : `Country (${COUNTRY_DATA.length})`) 
                : (language === 'ar' ? 'القطاع × الدولة' : 'Category × Country')}
            </span>
          </div>

          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <button
              onClick={() => setActiveMode('category')}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors border cursor-pointer ${
                activeMode === 'category'
                  ? 'bg-[#118dff] text-white border-[#118dff] shadow-2xs font-semibold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {language === 'ar' ? 'حسب القطاع' : 'By Category'}
            </button>
            <button
              onClick={() => setActiveMode('country')}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors border cursor-pointer ${
                activeMode === 'country'
                  ? 'bg-[#118dff] text-white border-[#118dff] shadow-2xs font-semibold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {language === 'ar' ? 'حسب الدولة' : 'By Country'}
            </button>
            <button
              onClick={() => setActiveMode('cross')}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors border cursor-pointer ${
                activeMode === 'cross'
                  ? 'bg-[#118dff] text-white border-[#118dff] shadow-2xs font-semibold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {language === 'ar' ? 'القطاع × الدولة' : 'Category × Country'}
            </button>
          </div>
        </div>
      )}

      {/* Squarified Canvas Container */}
      <div 
        className="relative w-full rounded-[3px] overflow-hidden bg-slate-100/50 border border-slate-200"
        style={{ height: dimensions.height }}
        onMouseLeave={() => setHoveredNode(null)}
      >
        {laidOutNodes.map((node) => {
          const isSelected = 
            (node.category && selectedCategory === node.category) ||
            (node.country && selectedCountry === node.country);
          const isDimmed = isCrossFiltered && !isSelected;

          const w = Math.max(0, (node.w || 0) - 2);
          const h = Math.max(0, (node.h || 0) - 2);
          const x = (node.x || 0) + 1;
          const y = (node.y || 0) + 1;

          const showLargeLabel = w > 75 && h > 45;
          const showCompactLabel = w > 50 && h > 28;
          const showMiniLabel = w > 35 && h > 18;

          return (
            <div
              key={node.id}
              onClick={() => handleNodeClick(node)}
              onMouseMove={(e) => {
                const rect = containerRef.current?.getBoundingClientRect();
                if (rect) {
                  setTooltipPos({
                    x: e.clientX - rect.left + 12,
                    y: e.clientY - rect.top + 12,
                  });
                }
                setHoveredNode(node);
              }}
              style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${w}px`,
                height: `${h}px`,
                backgroundColor: node.color,
                opacity: isDimmed ? 0.32 : 1,
              }}
              className={`absolute transition-all duration-150 cursor-pointer overflow-hidden p-1.5 flex flex-col justify-between text-white border ${
                isSelected
                  ? 'ring-2 ring-slate-900 border-white z-10 scale-[1.01] shadow-md'
                  : 'border-white/30 hover:border-white hover:brightness-110'
              }`}
            >
              {/* Node Header Content */}
              <div>
                {showLargeLabel && (
                  <div className="font-bold text-[11px] leading-tight truncate drop-shadow-xs">
                    {node.name}
                  </div>
                )}
                {showCompactLabel && !showLargeLabel && (
                  <div className="font-bold text-[10px] leading-tight truncate drop-shadow-xs">
                    {node.name}
                  </div>
                )}
                {showMiniLabel && !showCompactLabel && (
                  <div className="font-semibold text-[9px] leading-tight truncate">
                    {node.name.slice(0, 10)}
                  </div>
                )}

                {node.country && activeMode === 'cross' && showLargeLabel && (
                  <div className="text-[9px] text-white/80 font-sans flex items-center space-x-0.5 rtl:space-x-reverse truncate mt-0.5">
                    <span>📍</span>
                    <span>{translateCountry(node.country, language)}</span>
                  </div>
                )}
              </div>

              {/* Node Value Footer */}
              {showLargeLabel && (
                <div className="flex items-end justify-between font-mono text-[10px] pt-1 border-t border-white/20 mt-auto">
                  <span className="font-bold">{node.value.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</span>
                  <span className="text-white/85 text-[9px]">{node.percentage}%</span>
                </div>
              )}
              {showCompactLabel && !showLargeLabel && (
                <div className="font-mono text-[9px] font-bold text-white/95 mt-auto">
                  {node.value.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} ({node.percentage}%)
                </div>
              )}
            </div>
          );
        })}

        {/* Power BI Interactive Floating Tooltip */}
        {hoveredNode && (
          <div
            className="absolute z-30 pointer-events-none bg-slate-900/95 text-white p-2.5 rounded-[4px] shadow-lg border border-slate-700 text-xs font-sans min-w-44 max-w-64 backdrop-blur-xs"
            style={{
              left: Math.min(tooltipPos.x, dimensions.width - 200),
              top: Math.min(tooltipPos.y, dimensions.height - 130),
            }}
          >
            <div className="font-bold text-[12px] text-white border-b border-slate-700 pb-1 mb-1.5 flex items-center justify-between">
              <span>{hoveredNode.name}</span>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hoveredNode.color }}></span>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex items-center justify-between text-slate-300">
                <span>{language === 'ar' ? 'إعلانات الوظائف:' : 'Job Postings:'}</span>
                <strong className="text-white font-bold font-mono">{hoveredNode.value.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</strong>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>{language === 'ar' ? 'الحصة السوقية:' : 'Market Share:'}</span>
                <strong className="text-[#118dff] font-bold font-mono">{hoveredNode.percentage}%</strong>
              </div>

              {hoveredNode.country && (
                <div className="flex items-center justify-between text-slate-300">
                  <span>{language === 'ar' ? 'الدولة:' : 'Country:'}</span>
                  <strong className="text-white">{translateCountry(hoveredNode.country, language)}</strong>
                </div>
              )}

              {hoveredNode.avgSalary && (
                <div className="flex items-center justify-between text-slate-300">
                  <span>{language === 'ar' ? 'متوسط الراتب:' : 'Avg Salary:'}</span>
                  <strong className="text-emerald-400 font-bold font-mono">
                    {formatSalary(hoveredNode.avgSalary, currency, { isArabic: language === 'ar' })}
                  </strong>
                </div>
              )}

              {hoveredNode.remotePct !== undefined && (
                <div className="flex items-center justify-between text-slate-300">
                  <span>{language === 'ar' ? 'نسبة العمل عن بعد:' : 'Remote Rate:'}</span>
                  <strong className="text-purple-300 font-bold font-mono">{hoveredNode.remotePct}%</strong>
                </div>
              )}
            </div>

            <div className="mt-1.5 pt-1 border-t border-slate-800 text-[9px] text-sky-400 italic flex items-center justify-between">
              <span>{language === 'ar' ? '⚡ انقر للتعمق في قائمة الوظائف' : '⚡ Click to drill-through listings'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Treemap Legend & Footnote Summary */}
      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
          <span className="w-2 h-2 rounded-full bg-[#118dff]"></span>
          <span>{language === 'ar' ? 'تتناسب مساحة المربع مع إجمالي عدد إعلانات الوظائف' : 'Tile area is proportional to total job postings'}</span>
        </span>
        <span className="hidden sm:inline">
          {activeMode === 'category' 
            ? (language === 'ar' ? `${CATEGORY_DATA.length} قطاعات وظيفية` : `${CATEGORY_DATA.length} Sectors`) 
            : activeMode === 'country' 
            ? (language === 'ar' ? `${COUNTRY_DATA.length} دول عالمية` : `${COUNTRY_DATA.length} Countries`) 
            : (language === 'ar' ? 'توزيع القطاعات حسب الدول' : 'Category by Country Breakdown')}
        </span>
      </div>
    </div>
  );
};
