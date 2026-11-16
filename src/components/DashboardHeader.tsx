import React from 'react';
import { Download, RotateCcw, BarChart3, Filter, Database, Globe, Calculator, FileText, Languages } from 'lucide-react';
import { evaluateDaxFilterEngine, isUsingCustomDataset, getActiveDatasetName, getActiveJobRecords } from '../data/jobDataEngine';
import { CurrencyCode, CURRENCIES } from '../utils/currency';
import { Language, useTranslation } from '../utils/i18n';

interface DashboardHeaderProps {
  activeFiltersCount: number;
  onResetFilters: () => void;
  selectedCountry: string;
  selectedCategory: string;
  selectedModality: string;
  selectedAI: string;
  selectedSeniority: string;
  onOpenImportModal: () => void;
  onOpenLiveSearchModal: () => void;
  onOpenDaxModal: () => void;
  onOpenReportModal: () => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  language: Language;
  setLanguage: (l: Language) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  activeFiltersCount,
  onResetFilters,
  selectedCountry,
  selectedCategory,
  selectedModality,
  selectedAI,
  selectedSeniority,
  onOpenImportModal,
  onOpenLiveSearchModal,
  onOpenDaxModal,
  onOpenReportModal,
  currency,
  setCurrency,
  language,
  setLanguage,
}) => {
  const { t, isRTL } = useTranslation(language);
  const isCustom = isUsingCustomDataset();
  const datasetName = getActiveDatasetName();
  const activeRecords = getActiveJobRecords();

  const handleExportCsv = () => {
    const result = evaluateDaxFilterEngine({
      country: selectedCountry,
      category: selectedCategory,
      modality: selectedModality,
      ai: selectedAI,
      seniority: selectedSeniority,
      search: ''
    });

    const escapeCsvCell = (value: string | number) => {
      const str = String(value ?? '');
      return /[",\r\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
    };

    const headers = ['Job_ID', 'Job_Title', 'Company', 'Job_Category', 'Seniority', 'Workplace_Modality', 'Is_Remote', 'Is_AI_Job', 'Country', 'Location', 'Date_Posted', 'Salary_Avg_USD', 'Skills_List'];
    const rows = [
      headers.map(escapeCsvCell).join(','),
      ...result.matchingRecords.map(j => [
        j.Job_ID, j.Job_Title, j.Company, j.Job_Category, j.Seniority, j.Workplace_Modality,
        j.Is_Remote, j.Is_AI_Job, j.Country, j.Location, j.Date_Posted, j.Salary_Avg_USD || 0, j.Skills_List
      ].map(escapeCsvCell).join(','))
    ].join('\r\n');

    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent('\ufeff' + rows);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    const filterSuffix = selectedCountry !== 'All' ? `_${selectedCountry}` : '';
    const dateStamp = new Date().toISOString().split('T')[0];
    link.setAttribute("download", `LaborMarketReport_${dateStamp}${filterSuffix}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalCount = activeRecords.length;
  const totalCountries = new Set(activeRecords.map(r => r.Country).filter(Boolean)).size;
  const totalCompanies = new Set(activeRecords.map(r => r.Company).filter(Boolean)).size;

  return (
    <header className="dashboard-header bg-white border-b border-slate-200 px-4 sm:px-6 py-3 shadow-2xs">
      <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        {/* Title & Metadata */}
        <div>
          <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#118dff] to-[#12239e] flex items-center justify-center text-white shadow-xs">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-none">
                {t('appTitle')}
              </h1>
              {isCustom && (
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold tracking-wide uppercase">
                  {t('customDatasetActive')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Global Controls & Action Toolbars */}
        <div className="flex flex-wrap items-center gap-2 self-start xl:self-auto">
          
          {/* Language Switcher */}
          <div className="flex items-center space-x-1 rtl:space-x-reverse bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs">
            <Languages className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent font-bold text-slate-800 cursor-pointer focus:outline-hidden text-xs"
            >
              <option value="ar">العربية (Arabic)</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Currency Switcher */}
          <div className="flex items-center space-x-1 rtl:space-x-reverse bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs">
            <span className="text-slate-500 font-medium">{t('currency')}:</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="bg-transparent font-bold text-slate-800 cursor-pointer focus:outline-hidden pr-1 text-xs"
            >
              {Object.entries(CURRENCIES).map(([code, info]) => (
                <option key={code} value={code}>
                  {info.flag} {language === 'ar' ? `${info.nameAr} (${info.symbol})` : `${code} (${info.symbol})`}
                </option>
              ))}
            </select>
          </div>

          {/* Live Search & Feed Sync */}
          <button
            onClick={onOpenLiveSearchModal}
            className="px-2.5 py-1.5 rounded text-xs font-semibold border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center space-x-1.5 rtl:space-x-reverse transition-colors shadow-2xs cursor-pointer"
            title={t('liveJobSearch')}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('liveJobSearch')}</span>
          </button>

          {/* DAX Playground */}
          <button
            onClick={onOpenDaxModal}
            className="px-2.5 py-1.5 rounded text-xs font-semibold border border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-800 flex items-center space-x-1.5 rtl:space-x-reverse transition-colors shadow-2xs cursor-pointer"
            title={t('daxPlayground')}
          >
            <Calculator className="w-3.5 h-3.5 text-[#118dff]" />
            <span>{t('daxPlayground')}</span>
          </button>

          {/* Executive Briefing Report */}
          <button
            onClick={onOpenReportModal}
            className="px-2.5 py-1.5 rounded text-xs font-semibold border border-slate-300 bg-slate-50 hover:bg-white text-slate-800 hover:border-slate-400 flex items-center space-x-1.5 rtl:space-x-reverse transition-colors shadow-2xs cursor-pointer"
            title={t('executiveReport')}
          >
            <FileText className="w-3.5 h-3.5 text-violet-600" />
            <span>{t('executiveReport')}</span>
          </button>

          {/* Import / Manage Data Button */}
          <button
            onClick={onOpenImportModal}
            className="px-2.5 py-1.5 rounded text-xs font-semibold border border-slate-300 bg-slate-50 hover:bg-white text-slate-700 hover:border-slate-400 flex items-center space-x-1.5 rtl:space-x-reverse transition-colors shadow-2xs cursor-pointer"
            title={t('importDataset')}
          >
            <Database className="w-3.5 h-3.5 text-[#118dff]" />
            <span>{t('importDataset')}</span>
          </button>

          {/* Active Filter Indicator */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1 bg-sky-50 border border-sky-200 rounded text-xs text-sky-800 font-medium">
              <Filter className="w-3 h-3 text-sky-600" />
              <span>{activeFiltersCount} {t('filterApplied')}</span>
            </div>
          )}

          {/* Reset Filters */}
          <button
            onClick={onResetFilters}
            disabled={activeFiltersCount === 0}
            className={`px-2.5 py-1.5 rounded text-xs font-medium flex items-center space-x-1 rtl:space-x-reverse border transition-all ${
              activeFiltersCount > 0
                ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400 shadow-2xs cursor-pointer'
                : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
            }`}
            title={t('resetFilters')}
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t('resetFilters')}</span>
          </button>

          {/* Export Dataset */}
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded text-xs font-semibold bg-[#118dff] hover:bg-[#0078d4] text-white flex items-center space-x-1.5 rtl:space-x-reverse transition-colors shadow-2xs cursor-pointer"
            title={t('exportCsv')}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('exportCsv')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

