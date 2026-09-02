import React, { useState } from 'react';
import { 
  Maximize2, 
  Table as TableIcon, 
  Download, 
  BarChart2, 
  PieChart as PieIcon, 
  TrendingUp, 
  Filter, 
  MoreHorizontal,
  Layers,
  Activity
} from 'lucide-react';
import { Language, useTranslation } from '../utils/i18n';

export type VisualType = 'bar' | 'donut' | 'line' | 'table' | 'kpi' | 'area' | 'treemap' | 'custom';

interface VisualCardProps {
  title: string;
  subtitle?: string;
  visualType?: VisualType;
  children: React.ReactNode;
  className?: string;
  onFocusMode?: () => void;
  tableData?: { headers: string[]; rows: (string | number)[][] };
  badge?: string;
  filterContext?: string;
  language?: Language;
}

export const VisualCard: React.FC<VisualCardProps> = ({
  title,
  subtitle,
  visualType = 'custom',
  children,
  className = '',
  onFocusMode,
  tableData,
  badge,
  filterContext,
  language = 'ar',
}) => {
  const { t } = useTranslation(language);
  const [showTableView, setShowTableView] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isSpotlight, setIsSpotlight] = useState(false);

  const handleExportData = () => {
    if (!tableData) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + tableData.headers.join(",") + "\n"
      + tableData.rows.map(r => r.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title.replace(/\s+/g, '_')}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getVisualTypeLabel = () => {
    if (language === 'ar') {
      switch (visualType) {
        case 'bar': return 'مخطط شريطي';
        case 'donut': return 'مخطط دائري';
        case 'line': return 'مخطط خطي';
        case 'table': return 'جدول بيانات';
        case 'kpi': return 'بطاقة مؤشر KPI';
        case 'area': return 'مخطط مساحي';
        case 'treemap': return 'شجرة هرمية';
        default: return 'عنصر مرئي';
      }
    }
    switch (visualType) {
      case 'bar': return 'Bar Chart';
      case 'donut': return 'Donut Chart';
      case 'line': return 'Line Chart';
      case 'table': return 'Matrix Table';
      case 'kpi': return 'Card Visual';
      case 'area': return 'Area Chart';
      case 'treemap': return 'Treemap';
      default: return 'Visual';
    }
  };

  const getVisualIcon = () => {
    switch (visualType) {
      case 'bar': return <BarChart2 className="w-3 h-3 text-[#118dff]" />;
      case 'donut': return <PieIcon className="w-3 h-3 text-[#e66c37]" />;
      case 'line': return <TrendingUp className="w-3 h-3 text-[#6b007b]" />;
      case 'area': return <Activity className="w-3 h-3 text-[#00b7c3]" />;
      case 'treemap': return <Layers className="w-3 h-3 text-[#107c41]" />;
      case 'table': return <TableIcon className="w-3 h-3 text-[#107c41]" />;
      default: return <BarChart2 className="w-3 h-3 text-slate-500" />;
    }
  };

  return (
    <div 
      className={`bg-white border transition-all duration-150 flex flex-col justify-between overflow-hidden relative ${
        isSpotlight 
          ? 'ring-2 ring-[#118dff] shadow-md border-[#118dff]' 
          : 'border-[#e2e8f0] hover:border-[#cbd5e1] shadow-[0_1px_3px_0_rgba(0,0,0,0.06),0_1px_2px_0_rgba(0,0,0,0.04)]'
      } rounded-[4px] ${className}`}
    >
      {/* Power BI Visual Header & Action Toolbar */}
      <div className="flex items-start justify-between px-3.5 py-2.5 border-b border-[#f1f5f9] bg-white select-none">
        <div className="pr-2 rtl:pr-0 rtl:pl-2 min-w-0">
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse flex-wrap gap-y-1">
            <span className="inline-flex items-center space-x-1 rtl:space-x-reverse px-1.5 py-0.5 rounded bg-slate-100/90 text-slate-600 text-[10px] font-semibold border border-slate-200/80">
              {getVisualIcon()}
              <span>{badge || getVisualTypeLabel()}</span>
            </span>
            <h3 className="text-[13px] font-bold text-[#1e293b] tracking-tight truncate leading-tight font-sans">
              {title}
            </h3>
          </div>
          {subtitle && (
            <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">{subtitle}</p>
          )}
        </div>

        {/* Power BI Visual Action Icons */}
        <div className="flex items-center space-x-0.5 rtl:space-x-reverse shrink-0 bg-slate-50/80 px-1 py-0.5 rounded border border-slate-200/60">
          {filterContext && (
            <span 
              className="p-1 text-slate-400 hover:text-sky-600 hover:bg-white rounded transition-colors cursor-help"
              title={`${t('filterApplied')}: ${filterContext}`}
            >
              <Filter className="w-3.5 h-3.5 text-sky-600" />
            </span>
          )}

          {tableData && (
            <button
              onClick={() => setShowTableView(!showTableView)}
              className="p-1 text-slate-400 hover:text-slate-800 hover:bg-white rounded transition-colors cursor-pointer"
              title={showTableView ? (language === 'ar' ? 'التبديل إلى المخطط' : 'Switch to Chart') : (language === 'ar' ? 'عرض كجدول' : 'Show as Table')}
            >
              {showTableView ? <BarChart2 className="w-3.5 h-3.5 text-[#118dff]" /> : <TableIcon className="w-3.5 h-3.5" />}
            </button>
          )}

          {tableData && (
            <button
              onClick={handleExportData}
              className="p-1 text-slate-400 hover:text-slate-800 hover:bg-white rounded transition-colors cursor-pointer"
              title={t('visualExportData')}
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}

          {onFocusMode && (
            <button
              onClick={onFocusMode}
              className="p-1 text-slate-400 hover:text-slate-800 hover:bg-white rounded transition-colors cursor-pointer"
              title={t('visualFocusMode')}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* More options */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-slate-400 hover:text-slate-800 hover:bg-white rounded transition-colors cursor-pointer"
              title={language === 'ar' ? 'خيارات إضافية' : 'More options'}
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <div 
                className="absolute right-0 rtl:right-auto rtl:left-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded shadow-lg py-1 z-30 text-xs"
                onMouseLeave={() => setShowMenu(false)}
              >
                <button
                  onClick={() => {
                    setIsSpotlight(!isSpotlight);
                    setShowMenu(false);
                  }}
                  className="w-full text-left rtl:text-right px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center justify-between cursor-pointer"
                >
                  <span>{language === 'ar' ? 'تسليط الضوء (Spotlight)' : 'Spotlight'}</span>
                  {isSpotlight && <span className="text-sky-600 font-bold">✓</span>}
                </button>
                {tableData && (
                  <button
                    onClick={() => {
                      handleExportData();
                      setShowMenu(false);
                    }}
                    className="w-full text-left rtl:text-right px-3 py-1.5 hover:bg-slate-50 text-slate-700 cursor-pointer"
                  >
                    {language === 'ar' ? 'تصدير الملخص' : 'Export summarized'}
                  </button>
                )}
                {onFocusMode && (
                  <button
                    onClick={() => {
                      onFocusMode();
                      setShowMenu(false);
                    }}
                    className="w-full text-left rtl:text-right px-3 py-1.5 hover:bg-slate-50 text-slate-700 cursor-pointer"
                  >
                    {t('visualFocusMode')}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visual Canvas Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-center bg-white min-h-[140px]">
        {showTableView && tableData ? (
          <div className="overflow-x-auto max-h-64 text-xs w-full">
            <table className="w-full text-left rtl:text-right border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] text-slate-600 border-b border-slate-200 text-[11px] font-semibold sticky top-0">
                  {tableData.headers.map((h, idx) => (
                    <th key={idx} className="p-2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tableData.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-2 text-slate-700 font-mono text-[11px]">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};
