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

  const escapeCsvCell = (cell: string | number) => {
    const str = String(cell ?? '');
    return /[",\r\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const handleExportData = () => {
    if (!tableData) return;
    const csvContent = "\ufeff"
      + tableData.headers.map(escapeCsvCell).join(",") + "\r\n"
      + tableData.rows.map(r => r.map(escapeCsvCell).join(",")).join("\r\n");
    const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title.replace(/\s+/g, '_') || 'visual'}_data.csv`);
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
        case 'treemap': return 'خريطة شجرية';
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
      case 'bar': return <BarChart2 className="w-3 h-3 text-[#EFA05A]" />;
      case 'donut': return <PieIcon className="w-3 h-3 text-[#e66c37]" />;
      case 'line': return <TrendingUp className="w-3 h-3 text-[#C58A61]" />;
      case 'area': return <Activity className="w-3 h-3 text-[#D6A15B]" />;
      case 'treemap': return <Layers className="w-3 h-3 text-[#75A77A]" />;
      case 'table': return <TableIcon className="w-3 h-3 text-[#75A77A]" />;
      default: return <BarChart2 className="w-3 h-3 text-slate-500" />;
    }
  };

  return (
    <div
      className={`dashboard-visual min-w-0 w-full max-w-full bg-[#151e28] border border-[#39495b] transition-all duration-200 flex flex-col justify-between overflow-hidden relative ${
        isSpotlight
          ? 'ring-1 ring-[#f59e0b] shadow-xl border-[#f59e0b]'
          : 'border-[#39495b] hover:border-[#f59e0b] shadow-[0_8px_22px_rgba(0,0,0,0.22)]'
      } rounded-[4px] ${className}`}
    >
      {/* Power BI Visual Header & Action Toolbar */}
      <div className="dashboard-visual-header flex items-start justify-between px-4 py-3 border-b border-[#39495b] bg-[#1d2936] select-none">
        <div className="pr-2 rtl:pr-0 rtl:pl-2 min-w-0">
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse flex-wrap gap-y-1">
            <span className="inline-flex items-center space-x-1 rtl:space-x-reverse px-1.5 py-0.5 rounded bg-[#263443] text-[#f5bd68] text-[10px] font-semibold border border-[#46576b]">
              {getVisualIcon()}
              <span>{badge || getVisualTypeLabel()}</span>
            </span>
            <h3 className="text-[13px] font-bold text-[#f2f5f9] tracking-tight truncate leading-tight">
              {title}
            </h3>
          </div>
          {subtitle && (
            <p className="text-[11px] text-[#aebaca] mt-1 leading-normal">{subtitle}</p>
          )}
        </div>

        {/* Power BI Visual Action Icons */}
        <div className="flex items-center space-x-0.5 rtl:space-x-reverse shrink-0 bg-[#111b26] px-1 py-0.5 rounded-lg border border-[#405064]">
          {filterContext && (
            <span
              className="p-1 text-[#aebaca] hover:text-[#ffb547] hover:bg-[#263443] rounded transition-colors cursor-help"
              title={`${t('filterApplied')}: ${filterContext}`}
            >
              <Filter className="w-3.5 h-3.5 text-sky-600" />
            </span>
          )}

          {tableData && (
            <button
              onClick={() => setShowTableView(!showTableView)}
              className="p-1 text-[#aebaca] hover:text-[#f2f5f9] hover:bg-[#263443] rounded transition-colors cursor-pointer"
              title={showTableView ? (language === 'ar' ? 'التبديل إلى المخطط' : 'Switch to Chart') : (language === 'ar' ? 'عرض كجدول' : 'Show as Table')}
              aria-label={showTableView ? (language === 'ar' ? 'التبديل إلى المخطط' : 'Switch to Chart') : (language === 'ar' ? 'عرض كجدول' : 'Show as Table')}
            >
              {showTableView ? <BarChart2 className="w-3.5 h-3.5 text-[#EFA05A]" /> : <TableIcon className="w-3.5 h-3.5" />}
            </button>
          )}

          {tableData && (
            <button
              onClick={handleExportData}
              className="p-1 text-[#aebaca] hover:text-[#f2f5f9] hover:bg-[#263443] rounded transition-colors cursor-pointer"
              title={t('visualExportData')}
              aria-label={t('visualExportData')}
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}

          {onFocusMode && (
            <button
              onClick={onFocusMode}
              className="p-1 text-[#aebaca] hover:text-[#f2f5f9] hover:bg-[#263443] rounded transition-colors cursor-pointer"
              title={t('visualFocusMode')}
              aria-label={t('visualFocusMode')}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* More options */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-[#aebaca] hover:text-[#f2f5f9] hover:bg-[#263443] rounded transition-colors cursor-pointer"
              title={language === 'ar' ? 'خيارات إضافية' : 'More options'}
              aria-label={language === 'ar' ? 'خيارات إضافية' : 'More options'}
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <div
                className="absolute right-0 rtl:right-auto rtl:left-0 top-full mt-1 w-40 bg-[#202c39] border border-[#526276] rounded-lg shadow-2xl py-1 z-30 text-xs"
                onMouseLeave={() => setShowMenu(false)}
              >
                <button
                  onClick={() => {
                    setIsSpotlight(!isSpotlight);
                    setShowMenu(false);
                  }}
                  className="w-full text-left rtl:text-right px-3 py-2 hover:bg-[#263443] text-[#dce5ee] flex items-center justify-between cursor-pointer"
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
                    className="w-full text-left rtl:text-right px-3 py-2 hover:bg-[#263443] text-[#dce5ee] cursor-pointer"
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
                    className="w-full text-left rtl:text-right px-3 py-2 hover:bg-[#263443] text-[#dce5ee] cursor-pointer"
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
      <div className="dashboard-visual-body p-4 flex-1 flex flex-col justify-center bg-transparent min-h-[160px]">
        {showTableView && tableData ? (
          <div className="overflow-x-auto max-h-64 text-xs w-full">
            <table className="w-full text-left rtl:text-right border-collapse">
              <thead>
                <tr className="bg-[#263443] text-[#e7edf4] border-b border-[#405064] text-[11px] font-semibold sticky top-0">
                  {tableData.headers.map((h, idx) => (
                    <th key={idx} className="p-2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tableData.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-[#263443] transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-2 text-[#d4dde7] font-mono text-[11px]">
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
