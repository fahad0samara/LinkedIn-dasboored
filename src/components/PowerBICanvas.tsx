import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, AreaChart, Area
} from 'recharts';
import { 
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Grid3X3,
  Filter,
  X,
  RotateCcw
} from 'lucide-react';
import { 
  CATEGORY_DATA, 
  SENIORITY_DATA, 
  KEY_FINDINGS
} from '../data/jobData';
import { evaluateDaxFilterEngine } from '../data/jobDataEngine';
import { VisualCard } from './VisualCard';
import { PowerBITreemap } from './PowerBITreemap';
import { KPICardWithSparkline } from './KPICardWithSparkline';
import { DrillThroughOverlay, DrillThroughTarget } from './DrillThroughOverlay';
import { CurrencyCode, formatSalary } from '../utils/currency';
import { CustomMetric } from './DaxPlaygroundModal';
import { Language, useTranslation, translateCategory, translateCountry, translateSeniority, translateModality } from '../utils/i18n';

interface PowerBICanvasProps {
  activePage: number;
  selectedCountry: string;
  setSelectedCountry: (c: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  selectedModality: string;
  setSelectedModality: (m: string) => void;
  selectedAI: string;
  setSelectedAI: (a: string) => void;
  selectedSeniority: string;
  setSelectedSeniority: (s: string) => void;
  currency?: CurrencyCode;
  customPinnedMetrics?: CustomMetric[];
  onUnpinMetric?: (id: string) => void;
  language?: Language;
}

// Signature Microsoft Power BI Official Palette
const PBI_PALETTE = {
  blue: '#118DFF',
  navy: '#12239E',
  coral: '#E66C37',
  violet: '#6B007B',
  purple: '#6B007B',
  teal: '#00B7C3',
  green: '#107C41',
  crimson: '#D64550',
  amber: '#D97706',
  slate: '#64748B',
  lightSlate: '#CBD5E1',
  bgSoft: '#F8FAFC'
};

const MODALITY_COLORS = [PBI_PALETTE.blue, PBI_PALETTE.violet, PBI_PALETTE.teal];

export const PowerBICanvas: React.FC<PowerBICanvasProps> = ({
  activePage,
  selectedCountry,
  setSelectedCountry,
  selectedCategory,
  setSelectedCategory,
  selectedModality,
  setSelectedModality,
  selectedAI,
  setSelectedAI,
  selectedSeniority,
  setSelectedSeniority,
  currency = 'USD',
  customPinnedMetrics = [],
  onUnpinMetric,
  language = 'ar',
}) => {
  const { t } = useTranslation(language);
  const [jobSearch, setJobSearch] = useState<string>('');
  const [focusedVisual, setFocusedVisual] = useState<string | null>(null);
  const [atsTablePage, setAtsTablePage] = useState<number>(1);
  const [drillThroughTarget, setDrillThroughTarget] = useState<DrillThroughTarget | null>(null);
  const itemsPerPage = 7;

  const handleApplyDrillThroughSlicer = (filterKey: 'category' | 'country' | 'modality' | 'seniority' | 'ai', value: string) => {
    if (filterKey === 'category') setSelectedCategory(value);
    else if (filterKey === 'country') setSelectedCountry(value);
    else if (filterKey === 'modality') setSelectedModality(value);
    else if (filterKey === 'seniority') setSelectedSeniority(value);
    else if (filterKey === 'ai') setSelectedAI(value);
  };

  // Dynamic DAX evaluation engine calculating all metrics, distributions, and sample rows for the active filter intersection
  const daxMetrics = useMemo(() => {
    return evaluateDaxFilterEngine({
      country: selectedCountry,
      category: selectedCategory,
      modality: selectedModality,
      ai: selectedAI,
      seniority: selectedSeniority,
      search: jobSearch
    });
  }, [selectedCountry, selectedCategory, selectedModality, selectedAI, selectedSeniority, jobSearch]);

  const isFiltered = selectedCountry !== 'All' || selectedCategory !== 'All' || selectedModality !== 'All' || selectedAI !== 'All' || selectedSeniority !== 'All' || jobSearch.trim() !== '';

  const handleResetAllFilters = () => {
    setSelectedCountry('All');
    setSelectedCategory('All');
    setSelectedModality('All');
    setSelectedAI('All');
    setSelectedSeniority('All');
    setJobSearch('');
    setAtsTablePage(1);
  };

  // Paginated ATS rows
  const filteredJobs = daxMetrics.matchingRecords;
  const totalAtsPages = Math.ceil(filteredJobs.length / itemsPerPage) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (atsTablePage - 1) * itemsPerPage;
    return filteredJobs.slice(start, start + itemsPerPage);
  }, [filteredJobs, atsTablePage]);

  // Localized distributions for charts
  const localizedCategories = useMemo(() => {
    return daxMetrics.categoryDistribution.map(c => ({
      ...c,
      displayName: translateCategory(c.category, language)
    }));
  }, [daxMetrics.categoryDistribution, language]);

  const localizedCountries = useMemo(() => {
    return daxMetrics.countryDistribution.map(c => ({
      ...c,
      displayName: translateCountry(c.country, language)
    }));
  }, [daxMetrics.countryDistribution, language]);

  const localizedSeniority = useMemo(() => {
    return daxMetrics.seniorityDistribution.map(s => ({
      ...s,
      displayName: translateSeniority(s.level, language)
    }));
  }, [daxMetrics.seniorityDistribution, language]);

  const localizedModality = useMemo(() => {
    return daxMetrics.modalityDistribution.map(m => ({
      ...m,
      displayName: translateModality(m.modality, language)
    }));
  }, [daxMetrics.modalityDistribution, language]);

  // If a visual is in Focus Mode
  if (focusedVisual) {
    return (
      <div className="bg-white rounded-[4px] border border-slate-300 p-5 shadow-xs flex flex-col h-full min-h-[520px]">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
          <button 
            onClick={() => setFocusedVisual(null)}
            className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-semibold text-[#118dff] hover:text-[#0078d4] px-3 py-1.5 bg-sky-50 rounded-[4px] border border-sky-200 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{language === 'ar' ? 'العودة إلى لوحة التقرير الكاملة' : 'Back to Full Report Canvas'}</span>
          </button>
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-slate-600 font-medium">
            <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-sans border border-slate-200">{language === 'ar' ? 'وضع التركيز الموسّع' : 'Expanded View'}</span>
            <span className="font-bold text-slate-800">{focusedVisual}</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          {focusedVisual.includes('Treemap') || focusedVisual.includes('شجرة') ? (
            <div className="w-full h-full min-h-[440px]">
              <PowerBITreemap
                mode={focusedVisual.includes('Industry') || focusedVisual.includes('القطاع') ? 'cross' : 'category'}
                height={440}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedCountry={selectedCountry}
                onSelectCountry={setSelectedCountry}
                allowDrilldown={true}
                language={language}
                currency={currency}
              />
            </div>
          ) : (
            <div className="w-full h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={localizedCategories} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="displayName" angle={-30} textAnchor="end" interval={0} tick={{ fontSize: 11, fill: '#475569' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#475569' }} />
                  <Tooltip 
                    formatter={(val: any) => [`${val.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} ${language === 'ar' ? 'وظيفة' : 'postings'}`, language === 'ar' ? 'العدد' : 'Count']}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '4px', fontSize: '11px' }}
                  />
                  <Bar dataKey="jobs" fill={PBI_PALETTE.blue} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {/* Power BI Canvas Sub-Bar & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-[4px] text-[11px] text-slate-600 shadow-2xs gap-2">
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse font-bold text-slate-800">
            <Grid3X3 className="w-3.5 h-3.5 text-[#118dff]" />
            <span>{language === 'ar' ? 'مساحة عمل تقرير Power BI' : 'Power BI Report Canvas'}</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="text-slate-500">{language === 'ar' ? 'شبكة تفاعلية 16:9' : '16:9 Dashboard Grid'}</span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="text-emerald-700 font-medium flex items-center space-x-1 rtl:space-x-reverse bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              {language === 'ar' 
                ? `التصفية التبادلية DAX نشطة (${daxMetrics.totalJobs.toLocaleString('ar-EG')} سجل ضمن النطاق)`
                : `DAX Cross-Filtering Active (${daxMetrics.totalJobs.toLocaleString()} Records in Scope)`}
            </span>
          </span>
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse text-[11px]">
          <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-bold border border-slate-200">
            {language === 'ar' ? `الصفحة ${activePage} من 5` : `Page ${activePage} of 5`}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">Microsoft Power BI Service</span>
        </div>
      </div>

      {/* Active Cross-Filter Context Breadcrumb Strip */}
      {isFiltered && (
        <div className="bg-sky-50/70 border border-sky-200 rounded-[4px] p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center flex-wrap gap-1.5">
            <span className="text-[11px] font-bold text-sky-900 flex items-center space-x-1 rtl:space-x-reverse mr-1 rtl:mr-0 rtl:ml-1">
              <Filter className="w-3 h-3 text-[#118dff]" />
              <span>{t('filterContext')}:</span>
            </span>

            {selectedCountry !== 'All' && (
              <span className="inline-flex items-center space-x-1 rtl:space-x-reverse bg-white border border-sky-300 text-sky-800 px-2 py-0.5 rounded text-[11px] font-medium shadow-2xs">
                <span>{t('slicerCountry')}: <strong>{translateCountry(selectedCountry, language)}</strong></span>
                <button onClick={() => setSelectedCountry('All')} className="text-sky-400 hover:text-rose-500 ml-1 rtl:ml-0 rtl:mr-1 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center space-x-1 rtl:space-x-reverse bg-white border border-sky-300 text-sky-800 px-2 py-0.5 rounded text-[11px] font-medium shadow-2xs">
                <span>{t('slicerCategory')}: <strong>{translateCategory(selectedCategory, language)}</strong></span>
                <button onClick={() => setSelectedCategory('All')} className="text-sky-400 hover:text-rose-500 ml-1 rtl:ml-0 rtl:mr-1 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedModality !== 'All' && (
              <span className="inline-flex items-center space-x-1 rtl:space-x-reverse bg-white border border-sky-300 text-sky-800 px-2 py-0.5 rounded text-[11px] font-medium shadow-2xs">
                <span>{t('slicerModality')}: <strong>{translateModality(selectedModality, language)}</strong></span>
                <button onClick={() => setSelectedModality('All')} className="text-sky-400 hover:text-rose-500 ml-1 rtl:ml-0 rtl:mr-1 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedAI !== 'All' && (
              <span className="inline-flex items-center space-x-1 rtl:space-x-reverse bg-white border border-amber-300 text-amber-800 px-2 py-0.5 rounded text-[11px] font-medium shadow-2xs">
                <span>{t('slicerAI')}: <strong>{selectedAI === 'Yes' ? (language === 'ar' ? 'ذكاء اصطناعي' : 'AI Only') : (language === 'ar' ? 'عام' : 'Non-AI')}</strong></span>
                <button onClick={() => setSelectedAI('All')} className="text-amber-400 hover:text-rose-500 ml-1 rtl:ml-0 rtl:mr-1 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedSeniority !== 'All' && (
              <span className="inline-flex items-center space-x-1 rtl:space-x-reverse bg-white border border-purple-300 text-purple-800 px-2 py-0.5 rounded text-[11px] font-medium shadow-2xs">
                <span>{t('slicerSeniority')}: <strong>{translateSeniority(selectedSeniority, language)}</strong></span>
                <button onClick={() => setSelectedSeniority('All')} className="text-purple-400 hover:text-rose-500 ml-1 rtl:ml-0 rtl:mr-1 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {jobSearch.trim() !== '' && (
              <span className="inline-flex items-center space-x-1 rtl:space-x-reverse bg-white border border-slate-300 text-slate-800 px-2 py-0.5 rounded text-[11px] font-medium shadow-2xs">
                <span>{language === 'ar' ? 'بحث' : 'Search'}: <strong>"{jobSearch}"</strong></span>
                <button onClick={() => setJobSearch('')} className="text-slate-400 hover:text-rose-500 ml-1 rtl:ml-0 rtl:mr-1 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-[11px] text-sky-900 font-bold">
              {daxMetrics.totalJobs.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} {language === 'ar' ? `وظيفة مطابقة (${daxMetrics.totalCompanies} جهة توظيف)` : `matching positions (${daxMetrics.totalCompanies} employers)`}
            </span>
            <button
              onClick={handleResetAllFilters}
              className="flex items-center space-x-1 rtl:space-x-reverse text-[11px] text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-0.5 rounded font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t('clearAllSlicers')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Pinned Custom DAX Measures Strip */}
      {customPinnedMetrics && customPinnedMetrics.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-300 rounded-[4px] p-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900">
            <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'ar' ? `المقاييس المخصصة المثبتة DAX (${customPinnedMetrics.length})` : `Pinned Custom DAX Measures (${customPinnedMetrics.length})`}</span>
            </span>
            <span className="text-[10px] text-amber-700 font-normal">{language === 'ar' ? 'تُحسب ديناميكياً بناءً على سياق التصفية النشط' : 'Calculated dynamically against current filter scope'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {customPinnedMetrics.map((m) => (
              <div 
                key={m.id}
                className="bg-white p-2.5 rounded-[3px] border border-amber-200 shadow-2xs relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{m.category}</span>
                    {onUnpinMetric && (
                      <button 
                        onClick={() => onUnpinMetric(m.id)}
                        className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition-colors cursor-pointer"
                        title={language === 'ar' ? 'إلغاء التثبيت' : 'Unpin Measure'}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate mt-0.5" title={m.name}>
                    {m.name}
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-baseline justify-between font-mono">
                  <span className="text-base font-bold text-amber-900">{m.resultFormatted}</span>
                  <span className="text-[10px] text-slate-400 font-sans truncate max-w-[120px]" title={m.explanation}>
                    {m.explanation}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 1: EXECUTIVE OVERVIEW (DYNAMIC MULTI-CHART ANALYTICAL CANVAS) */}
      {/* ========================================================================= */}
      {activePage === 1 && (
        <div className="space-y-3.5">
          {/* Row 1: Executive High-Density KPI Ribbon Strip with Power BI Sparklines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* KPI 1: Total Postings with Trend Sparkline */}
            <KPICardWithSparkline
              title={t('kpi_totalJobs')}
              value={daxMetrics.totalJobs.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}
              badgeText={isFiltered ? (language === 'ar' ? 'نطاق مصفى' : 'Filtered Scope') : '+8.4% MoM'}
              badgeType="positive"
              subtitle={isFiltered ? (language === 'ar' ? `عبر ${daxMetrics.totalCompanies} شركة` : `Across ${daxMetrics.totalCompanies} Companies`) : (language === 'ar' ? '12,000 إجمالي الوظائف' : '12,000 Total Postings')}
              accentColor={PBI_PALETTE.blue}
              data={daxMetrics.monthlyTrend.map(m => ({ month: m.month, value: m.postings }))}
              formatTooltip={(v) => `${v.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} ${language === 'ar' ? 'وظيفة' : 'postings'}`}
              trendLabel={`${language === 'ar' ? 'الذروة' : 'Peak'}: ${Math.max(...daxMetrics.monthlyTrend.map(m => m.postings)).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}`}
            />

            {/* KPI 2: Active Employers with Trend Sparkline */}
            <KPICardWithSparkline
              title={t('kpi_activeEmployers')}
              value={daxMetrics.totalCompanies.toString()}
              badgeText={language === 'ar' ? `${daxMetrics.totalCountries} دول` : `${daxMetrics.totalCountries} Countries`}
              badgeType="neutral"
              subtitle={language === 'ar' ? '54 شركة مرصودة' : '54 Monitored Companies'}
              accentColor="#1e293b"
              data={daxMetrics.monthlyTrend.map((m, idx) => ({ 
                month: m.month, 
                value: Math.max(1, Math.round(daxMetrics.totalCompanies * (0.7 + (idx * 0.025)))) 
              }))}
              formatTooltip={(v) => `${v} ${language === 'ar' ? 'شركة' : 'employers'}`}
              trendLabel={`${daxMetrics.totalCompanies} ${language === 'ar' ? 'شركة' : 'Companies'}`}
            />

            {/* KPI 3: Workplace Flexibility with Trend Sparkline */}
            <KPICardWithSparkline
              title={t('kpi_remoteHybrid')}
              value={`${(daxMetrics.remotePercentage + daxMetrics.hybridPercentage).toFixed(1)}%`}
              badgeText={`${daxMetrics.remoteJobs.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} ${t('mod_remote')}`}
              badgeType="positive"
              subtitle={`${daxMetrics.remotePercentage}% ${t('mod_remote')} + ${daxMetrics.hybridPercentage}% ${t('mod_hybrid')}`}
              accentColor={PBI_PALETTE.purple}
              data={daxMetrics.monthlyTrend.map(m => ({ month: m.month, value: m.remote }))}
              formatTooltip={(v) => `${v.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} ${language === 'ar' ? 'وظيفة عن بعد' : 'remote roles'}`}
              trendLabel={`${daxMetrics.remotePercentage}% ${t('mod_remote')}`}
            />

            {/* KPI 4: AI Specialization with Trend Sparkline */}
            <KPICardWithSparkline
              title={t('kpi_aiSpecialization')}
              value={`${daxMetrics.aiPercentage}%`}
              badgeText={`+${daxMetrics.aiSalaryPremiumPct}% ${language === 'ar' ? 'أجر' : 'Pay'}`}
              badgeType="accent"
              subtitle={`${daxMetrics.aiJobs.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} ${language === 'ar' ? 'وظيفة متخصصة' : 'Specialized Roles'}`}
              accentColor={PBI_PALETTE.coral}
              data={daxMetrics.monthlyTrend.map(m => ({ month: m.month, value: m.ai }))}
              formatTooltip={(v) => `${v} ${language === 'ar' ? 'وظيفة ذكاء اصطناعي' : 'AI/ML positions'}`}
              trendLabel={`${daxMetrics.aiJobs} ${language === 'ar' ? 'فرصة عمل' : 'Specialized Openings'}`}
            />

            {/* KPI 5: Benchmark Remuneration with Trend Sparkline */}
            <KPICardWithSparkline
              title={t('kpi_avgSalary')}
              value={formatSalary(daxMetrics.avgSalary, currency, { compact: true, isArabic: language === 'ar' })}
              subValue={currency}
              badgeText={`${language === 'ar' ? 'الوسيط:' : 'Med:'} ${formatSalary(daxMetrics.medianSalary, currency, { compact: true, isArabic: language === 'ar' })}`}
              badgeType="positive"
              subtitle={language === 'ar' ? 'متوسط الراتب للنطاق المصفى' : 'Mean Pay for Filtered Context'}
              accentColor={PBI_PALETTE.green}
              className="sm:col-span-2 lg:col-span-1"
              data={daxMetrics.monthlyTrend.map(m => ({ month: m.month, value: m.avgSalary }))}
              formatTooltip={(v) => formatSalary(v, currency, { isArabic: language === 'ar' })}
              trendLabel={`${formatSalary(daxMetrics.avgSalary, currency, { compact: true, isArabic: language === 'ar' })} ${language === 'ar' ? 'المعيار' : 'Mean Benchmark'}`}
            />
          </div>

          {/* Row 2: Visual Cards - Industry Category Bar Chart & Modality Donut */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            {/* Visual 1: Job Postings by Industry Category (Horizontal Bar Chart) - 7 cols */}
            <VisualCard 
              visualType="bar"
              title={t('chart_postingsByCategory')}
              subtitle={language === 'ar' ? 'مخطط شريطي أفقي • انقر على أي شريط للتعمق في البيانات الفرعية للقطاع' : 'Horizontal Clustered Bar Chart • Click any bar to drill through into category microdata'}
              className="lg:col-span-7"
              filterContext={selectedCategory !== 'All' ? `${t('slicerCategory')} = ${translateCategory(selectedCategory, language)}` : undefined}
              onFocusMode={() => setFocusedVisual(t('chart_postingsByCategory'))}
              language={language}
              tableData={{
                headers: [t('slicerCategory'), t('col_postingsCount'), t('col_marketShare'), `${t('kpi_avgSalary')} (${currency})`],
                rows: localizedCategories.map(c => [c.displayName, c.jobs.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US'), `${c.share}%`, formatSalary(c.avgSalary, currency, { isArabic: language === 'ar' })])
              }}
            >
              <div className="h-72 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={localizedCategories} 
                    layout="vertical" 
                    margin={{ top: 0, right: 25, left: 100, bottom: 0 }}
                    onClick={(e: any) => {
                      if (e && e.activePayload && e.activePayload[0]) {
                        const clickedCat = e.activePayload[0].payload.category;
                        setDrillThroughTarget({
                          type: 'category',
                          title: translateCategory(clickedCat, language),
                          category: clickedCat
                        });
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} />
                    <YAxis dataKey="displayName" type="category" tick={{ fontSize: 10, fill: '#334155' }} width={100} />
                    <Tooltip 
                      formatter={(val: any, _name: any, item: any) => [
                        `${val.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} ${language === 'ar' ? 'وظيفة' : 'postings'} (${item.payload.share}%) • ${language === 'ar' ? 'المتوسط' : 'Avg'}: ${formatSalary(item.payload.avgSalary, currency, { isArabic: language === 'ar' })}`, 
                        language === 'ar' ? 'حجم الطلب' : 'Demand Volume'
                      ]}
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '4px', fontSize: '11px', color: '#1e293b' }}
                    />
                    <Bar 
                      dataKey="jobs" 
                      radius={[0, 3, 3, 0]}
                      className="cursor-pointer"
                    >
                      {localizedCategories.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={selectedCategory === 'All' || selectedCategory === entry.category ? PBI_PALETTE.blue : '#cbd5e1'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </VisualCard>

            {/* Visual 2: Workplace Modality Distribution (Donut Chart) - 5 cols */}
            <VisualCard 
              visualType="donut"
              title={t('chart_modalityDistribution')}
              subtitle={language === 'ar' ? 'مخطط حلقي تفاعلي • انقر على أي قسم لعرض السجلات التفصيلية' : 'Donut Ring Visual • Click slice to drill through into modality records'}
              className="lg:col-span-5"
              filterContext={selectedModality !== 'All' ? `${t('slicerModality')} = ${translateModality(selectedModality, language)}` : undefined}
              language={language}
              tableData={{
                headers: [t('slicerModality'), t('col_postingsCount'), t('col_marketShare')],
                rows: localizedModality.map(m => [m.displayName, m.count.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US'), `${m.percentage}%`])
              }}
            >
              <div className="h-48 w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={localizedModality}
                      innerRadius={48}
                      outerRadius={74}
                      paddingAngle={3}
                      dataKey="count"
                      nameKey="displayName"
                      onClick={(e: any) => {
                        if (e && e.modality) {
                          setDrillThroughTarget({
                            type: 'modality',
                            title: translateModality(e.modality, language),
                            modality: e.modality
                          });
                        }
                      }}
                      className="cursor-pointer"
                    >
                      {MODALITY_COLORS.map((color, idx) => (
                        <Cell key={`cell-${idx}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: any, name: any, item: any) => [`${val.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} ${language === 'ar' ? 'وظيفة' : 'jobs'} (${item.payload.percentage}%)`, name]}
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '4px', fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Callout Value */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{language === 'ar' ? 'الإجمالي' : 'TOTAL'}</span>
                  <span className="text-sm font-bold font-mono text-slate-800">{daxMetrics.totalJobs.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</span>
                </div>
              </div>

              {/* Power BI Interactive Legend & Slicer Chiclets */}
              <div className="grid grid-cols-3 gap-1.5 text-center pt-2 border-t border-slate-100 text-xs">
                <div 
                  onClick={() => setDrillThroughTarget({ type: 'modality', title: t('mod_remote'), modality: 'Remote' })}
                  className={`p-1.5 rounded-[4px] cursor-pointer transition-colors border ${
                    selectedModality === 'Remote' 
                      ? 'bg-sky-50 border-sky-300 shadow-2xs font-semibold' 
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                  title={language === 'ar' ? 'انقر للتعمق في وظائف العمل عن بُعد' : 'Click to drill-through into Remote postings'}
                >
                  <div className="font-bold text-[#118dff] font-mono text-[11px]">{daxMetrics.remotePercentage}%</div>
                  <div className="text-[10px] text-slate-600 font-medium">{t('mod_remote')} ⚡</div>
                </div>
                <div 
                  onClick={() => setDrillThroughTarget({ type: 'modality', title: t('mod_hybrid'), modality: 'Hybrid' })}
                  className={`p-1.5 rounded-[4px] cursor-pointer transition-colors border ${
                    selectedModality === 'Hybrid' 
                      ? 'bg-purple-50 border-purple-300 shadow-2xs font-semibold' 
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                  title={language === 'ar' ? 'انقر للتعمق في وظائف العمل الهجين' : 'Click to drill-through into Hybrid postings'}
                >
                  <div className="font-bold text-[#6b007b] font-mono text-[11px]">{daxMetrics.hybridPercentage}%</div>
                  <div className="text-[10px] text-slate-600 font-medium">{t('mod_hybrid')} ⚡</div>
                </div>
                <div 
                  onClick={() => setDrillThroughTarget({ type: 'modality', title: t('mod_onsite'), modality: 'On-site' })}
                  className={`p-1.5 rounded-[4px] cursor-pointer transition-colors border ${
                    selectedModality === 'On-site' 
                      ? 'bg-teal-50 border-teal-300 shadow-2xs font-semibold' 
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                  title={language === 'ar' ? 'انقر للتعمق في وظائف العمل الحضوري' : 'Click to drill-through into On-site postings'}
                >
                  <div className="font-bold text-[#00b7c3] font-mono text-[11px]">{daxMetrics.onsitePercentage}%</div>
                  <div className="text-[10px] text-slate-600 font-medium">{t('mod_onsite')} ⚡</div>
                </div>
              </div>
            </VisualCard>
          </div>

          {/* Row 3: Visual Card - Squarified Power BI Job Distribution Treemap (12 cols) */}
          <VisualCard 
            visualType="treemap"
            title={t('chart_treemap')}
            subtitle={language === 'ar' ? 'تدرج بصري مربع • انقر على أي كتلة للتعمق في تفاصيل السجلات' : 'Squarified Visual Hierarchy • Click tile to trigger Power BI Drill-Through into microdata'}
            filterContext={selectedCategory !== 'All' ? `${t('slicerCategory')} = ${translateCategory(selectedCategory, language)}` : selectedCountry !== 'All' ? `${t('slicerCountry')} = ${translateCountry(selectedCountry, language)}` : undefined}
            onFocusMode={() => setFocusedVisual(t('chart_treemap'))}
            language={language}
            tableData={{
              headers: [t('slicerCategory'), t('col_postingsCount'), t('col_marketShare'), `${t('kpi_avgSalary')} (${currency})`],
              rows: localizedCategories.map(c => [c.displayName, c.jobs.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US'), `${c.share}%`, formatSalary(c.avgSalary, currency, { isArabic: language === 'ar' })])
            }}
          >
            <PowerBITreemap 
              mode="category"
              height={290}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedCountry={selectedCountry}
              onSelectCountry={setSelectedCountry}
              allowDrilldown={true}
              onDrillThrough={(target) => setDrillThroughTarget(target)}
              language={language}
              currency={currency}
            />
          </VisualCard>

          {/* Row 4: Visual Cards - Monthly Velocity Area Chart & Sovereign Nations Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            {/* Visual 3: Monthly Postings Velocity & Trajectory (Area & Line Chart) - 6 cols */}
            <VisualCard 
              visualType="area"
              title={t('chart_monthlyTrend')}
              subtitle={language === 'ar' ? 'مخطط مساحي وخطي • مقارنة إجمالي الوظائف مع حجم العمل عن بُعد شهرياً' : 'Area & Line Visual • Total Postings vs. Remote Volume by Month'}
              className="lg:col-span-6"
              onFocusMode={() => setFocusedVisual(t('chart_monthlyTrend'))}
              language={language}
              tableData={{
                headers: [language === 'ar' ? 'الشهر' : 'Month', t('kpi_totalJobs'), t('mod_remote'), t('slicerAI'), `${t('kpi_avgSalary')} (${currency})`],
                rows: daxMetrics.monthlyTrend.map(m => [m.month, m.postings, m.remote, m.ai, formatSalary(m.avgSalary, currency, { isArabic: language === 'ar' })])
              }}
            >
              <div className="h-64 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={daxMetrics.monthlyTrend} margin={{ top: 10, right: 20, left: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Tooltip 
                      formatter={(val: any, name: any) => [
                        `${val.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} ${language === 'ar' ? 'وظيفة' : 'positions'}`, 
                        name === 'postings' ? t('kpi_totalJobs') : t('mod_remote')
                      ]}
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '4px', fontSize: '11px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="postings" 
                      name="postings"
                      stroke={PBI_PALETTE.blue} 
                      fill="#e0f2fe" 
                      strokeWidth={2} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="remote" 
                      name="remote"
                      stroke={PBI_PALETTE.violet} 
                      strokeWidth={2} 
                      dot={{ r: 3, fill: PBI_PALETTE.violet }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>{language === 'ar' ? 'ذروة التوظيف:' : 'Peak Volume:'} <strong className="text-slate-800">{language === 'ar' ? 'أكتوبر' : 'October'} ({Math.max(...daxMetrics.monthlyTrend.map(m => m.postings)).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')})</strong></span>
                <span>{language === 'ar' ? 'المعيار السنوي:' : 'Annual Benchmark:'} <strong className="text-slate-800">{formatSalary(daxMetrics.avgSalary, currency, { compact: true, isArabic: language === 'ar' })}</strong></span>
              </div>
            </VisualCard>

            {/* Visual 4: Postings Across Countries (Column Bar Chart) - 6 cols */}
            <VisualCard 
              visualType="bar"
              title={t('chart_postingsByCountry')}
              subtitle={language === 'ar' ? 'مخطط أعمدة مجمّع • انقر على أي عمود لاستعراض بيانات الدولة' : 'Clustered Column Chart • Click column to view country details'}
              className="lg:col-span-6"
              filterContext={selectedCountry !== 'All' ? `${t('slicerCountry')} = ${translateCountry(selectedCountry, language)}` : undefined}
              onFocusMode={() => setFocusedVisual(t('chart_postingsByCountry'))}
              language={language}
              tableData={{
                headers: [t('slicerCountry'), t('col_postingsCount'), t('col_marketShare'), `${t('kpi_avgSalary')} (${currency})`],
                rows: localizedCountries.map(c => [c.displayName, c.jobs.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US'), `${c.share}%`, formatSalary(c.avgSalary, currency, { isArabic: language === 'ar' })])
              }}
            >
              <div className="h-64 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={localizedCountries} 
                    margin={{ top: 5, right: 10, left: -15, bottom: 25 }}
                    onClick={(e: any) => {
                      if (e && e.activePayload && e.activePayload[0]) {
                        const clickedCountry = e.activePayload[0].payload.country;
                        setDrillThroughTarget({
                          type: 'country',
                          title: translateCountry(clickedCountry, language),
                          country: clickedCountry
                        });
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="displayName" tick={{ fontSize: 9, fill: '#64748b' }} interval={0} angle={-25} textAnchor="end" height={35} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Tooltip 
                      formatter={(v: any, _name: any, item: any) => [
                        `${v.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} ${language === 'ar' ? 'وظيفة' : 'postings'} (${item.payload.share}%) • ${language === 'ar' ? 'المتوسط' : 'Avg'}: ${formatSalary(item.payload.avgSalary, currency, { isArabic: language === 'ar' })}`, 
                        language === 'ar' ? 'الوظائف' : 'Postings'
                      ]}
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '4px', fontSize: '11px' }}
                    />
                    <Bar 
                      dataKey="jobs" 
                      radius={[3, 3, 0, 0]}
                      className="cursor-pointer"
                    >
                      {localizedCountries.map((entry, index) => (
                        <Cell 
                          key={`cell-c-${index}`} 
                          fill={selectedCountry === 'All' || selectedCountry === entry.country ? PBI_PALETTE.teal : '#cbd5e1'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>{language === 'ar' ? 'الدول النشطة:' : 'Active Countries:'} <strong className="text-slate-800">{daxMetrics.totalCountries} {language === 'ar' ? 'دول' : 'Countries'}</strong></span>
                <span>{language === 'ar' ? 'متوسط الأجور:' : 'Average Salary:'} <strong className="text-[#107c41]">{formatSalary(daxMetrics.avgSalary, currency, { compact: true, isArabic: language === 'ar' })}</strong></span>
              </div>
            </VisualCard>
          </div>

          {/* Row 5: Visual Cards - Key Strategic Findings & Job Postings Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            {/* Visual 7: Key Findings - 4 cols */}
            <VisualCard 
              visualType="custom"
              title={language === 'ar' ? 'رؤى واستنتاجات سوق العمل الرئيسية' : 'Key Market Insights'}
              subtitle={language === 'ar' ? 'ملخص تحليلي لأبرز اتجاهات التوظيف، العمل عن بعد، ومعايير الأجور' : 'Summary of hiring trends, remote work, and compensation benchmarks'}
              className="lg:col-span-4"
              language={language}
            >
              <div className="space-y-2.5 pt-1">
                {KEY_FINDINGS.slice(0, 4).map((f) => {
                  const title = language === 'ar' ? (f.titleAr || f.title) : f.title;
                  const desc = language === 'ar' ? (f.descAr || f.desc) : f.desc;
                  return (
                    <div key={f.number} className="p-2.5 bg-[#f8fafc] rounded-[4px] border border-slate-200">
                      <div className="flex items-center justify-between font-bold text-slate-900 text-xs mb-1">
                        <span className="truncate pr-2 rtl:pr-0 rtl:pl-2">{title}</span>
                        <span className="font-mono text-[11px] text-[#118dff] bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100 shrink-0">
                          {f.stat}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        {desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </VisualCard>

            {/* Visual 8: Job Postings Table - 8 cols */}
            <VisualCard 
              visualType="table"
              title={t('jobTableTitle')}
              subtitle={language === 'ar' ? 'جدول بيانات تفاعلي قابل للبحث والتصفية مع إمكانية الفرز والتعمق' : 'Searchable table of job postings with filter support'}
              className="lg:col-span-8"
              language={language}
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 mb-2 border-b border-slate-100 gap-2">
                    <div className="text-[11px] text-slate-600">
                      {language === 'ar' 
                        ? `عرض ${paginatedJobs.length} من أصل ${filteredJobs.length.toLocaleString('ar-EG')} وظيفة مطابقة`
                        : `Showing ${paginatedJobs.length} of ${filteredJobs.length.toLocaleString()} matching postings`}
                      {isFiltered && <span className="text-[#118dff] ml-1.5 rtl:ml-0 rtl:mr-1.5 font-bold">• {t('filterApplied')}</span>}
                    </div>
                    <div className="relative w-full sm:w-auto">
                      <Search className="w-3.5 h-3.5 absolute left-2 rtl:left-auto rtl:right-2 top-2 text-slate-400" />
                      <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={jobSearch}
                        onChange={(e) => {
                          setJobSearch(e.target.value);
                          setAtsTablePage(1);
                        }}
                        className="pl-6 rtl:pl-2 rtl:pr-6 pr-2.5 py-1 bg-slate-50 rounded-[4px] text-xs border border-slate-200 text-slate-800 focus:outline-hidden focus:border-[#118dff] w-full sm:w-64"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto max-h-64">
                    <table className="w-full text-left rtl:text-right text-xs border-collapse">
                      <thead className="bg-[#f8fafc] text-slate-700 text-[11px] font-bold border-b border-slate-200 sticky top-0">
                        <tr>
                          <th className="py-2 px-2.5">{t('col_jobTitle')}</th>
                          <th className="py-2 px-2.5">{t('col_company')}</th>
                          <th className="py-2 px-2.5">{t('col_category')}</th>
                          <th className="py-2 px-2.5">{t('col_location')}</th>
                          <th className="py-2 px-2.5">{t('col_modality')}</th>
                          <th className="py-2 px-2.5">{t('col_aiRole')}</th>
                          <th className="py-2 px-2.5 text-right rtl:text-left">{t('col_salary')} ({currency})</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-[11px]">
                        {paginatedJobs.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                              {language === 'ar' ? 'لا توجد وظائف مطابقة لمعايير التصفية الحالية. جرب توسيع نطاق التصفية.' : 'No postings match the active filter criteria. Try broadening your filter selection.'}
                            </td>
                          </tr>
                        ) : (
                          paginatedJobs.map((j) => (
                            <tr 
                              key={j.Job_ID} 
                              onClick={() => setDrillThroughTarget({
                                type: 'category',
                                title: `${translateCategory(j.Job_Category, language)} (${translateCountry(j.Country, language)})`,
                                category: j.Job_Category,
                                country: j.Country
                              })}
                              className="hover:bg-sky-50/80 transition-colors cursor-pointer group"
                              title={language === 'ar' ? 'انقر على الصف للتعمق في هذا القطاع والدولة' : 'Click row to drill-through into this category & country segment'}
                            >
                              <td className="py-1.5 px-2.5 font-medium text-slate-900 group-hover:text-[#118dff]">
                                <div>{j.Job_Title}</div>
                                <div className="text-[10px] text-slate-400">{translateSeniority(j.Seniority, language)}</div>
                              </td>
                              <td className="py-1.5 px-2.5 text-slate-700 font-semibold">{j.Company}</td>
                              <td className="py-1.5 px-2.5 text-slate-600">
                                <span className="underline decoration-dotted underline-offset-2 decoration-slate-300 group-hover:decoration-sky-400">
                                  {translateCategory(j.Job_Category, language)}
                                </span>
                              </td>
                              <td className="py-1.5 px-2.5 text-slate-500 truncate max-w-[120px]">{translateCountry(j.Country, language)}</td>
                              <td className="py-1.5 px-2.5">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                  j.Workplace_Modality === 'Remote' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                                  j.Workplace_Modality === 'Hybrid' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                                  'bg-teal-50 text-teal-700 border border-teal-200'
                                }`}>
                                  {translateModality(j.Workplace_Modality, language)}
                                </span>
                              </td>
                              <td className="py-1.5 px-2.5 font-mono">
                                {j.Is_AI_Job === 'Yes' ? (
                                  <span className="text-[#e66c37] font-semibold flex items-center space-x-1 rtl:space-x-reverse">
                                    <Sparkles className="w-2.5 h-2.5" />
                                    <span>{language === 'ar' ? 'نعم' : 'Yes'}</span>
                                  </span>
                                ) : (
                                  <span className="text-slate-400">{language === 'ar' ? 'لا' : 'No'}</span>
                                )}
                              </td>
                              <td className="py-1.5 px-2.5 font-mono text-right rtl:text-left text-[#107c41] font-semibold tabular-nums">
                                {formatSalary(j.Salary_Avg_USD || 0, currency, { isArabic: language === 'ar' })}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Table Pagination & Total Summary */}
                <div className="pt-2 mt-2 border-t border-slate-200 flex items-center justify-between text-xs font-medium bg-slate-50 px-3 py-1.5 rounded-[4px]">
                  <span className="text-slate-600 text-[11px]">
                    {language === 'ar' 
                      ? `الصفحة ${atsTablePage} من ${totalAtsPages} (${filteredJobs.length.toLocaleString('ar-EG')} سجل)`
                      : `Page ${atsTablePage} of ${totalAtsPages} (${filteredJobs.length} active rows)`}
                  </span>
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <button
                      onClick={() => setAtsTablePage(p => Math.max(1, p - 1))}
                      disabled={atsTablePage === 1}
                      className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 flex items-center text-[11px] cursor-pointer"
                    >
                      <ChevronLeft className="w-3 h-3 mr-0.5 rtl:mr-0 rtl:ml-0.5 rtl:rotate-180" />
                      {language === 'ar' ? 'السابق' : 'Prev'}
                    </button>
                    <button
                      onClick={() => setAtsTablePage(p => Math.min(totalAtsPages, p + 1))}
                      disabled={atsTablePage === totalAtsPages || totalAtsPages === 0}
                      className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 flex items-center text-[11px] cursor-pointer"
                    >
                      {language === 'ar' ? 'التالي' : 'Next'}
                      <ChevronRight className="w-3 h-3 ml-0.5 rtl:ml-0 rtl:mr-0.5 rtl:rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            </VisualCard>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 2: INDUSTRY DEMAND & SENIORITY */}
      {/* ========================================================================= */}
      {activePage === 2 && (
        <div className="space-y-3.5">
          {/* Visual Container: Power BI Treemap Visual for Industry & Country Distribution */}
          <VisualCard 
            visualType="treemap"
            title={language === 'ar' ? 'توزيع الوظائف حسب القطاع والدولة' : 'Job Postings by Category & Country'}
            subtitle={language === 'ar' ? 'شجرة هرمية تفاعلية • انقر على أي كتلة للتعمق في إعلانات الوظائف' : 'Squarified Treemap • Click tile to view job listings'}
            filterContext={selectedCategory !== 'All' ? `${t('slicerCategory')} = ${translateCategory(selectedCategory, language)}` : selectedCountry !== 'All' ? `${t('slicerCountry')} = ${translateCountry(selectedCountry, language)}` : undefined}
            onFocusMode={() => setFocusedVisual(language === 'ar' ? 'توزيع الوظائف حسب القطاع والدولة' : 'Job Postings by Category & Country')}
            language={language}
            tableData={{
              headers: [t('slicerCategory'), t('col_postingsCount'), t('col_marketShare'), `${t('kpi_avgSalary')} (${currency})`],
              rows: localizedCategories.map(c => [c.displayName, c.jobs.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US'), `${c.share}%`, formatSalary(c.avgSalary, currency, { isArabic: language === 'ar' })])
            }}
          >
            <PowerBITreemap 
              mode="cross"
              height={320}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedCountry={selectedCountry}
              onSelectCountry={setSelectedCountry}
              allowDrilldown={true}
              onDrillThrough={(target) => setDrillThroughTarget(target)}
              language={language}
              currency={currency}
            />
          </VisualCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            {/* Visual Container: Bar Chart (Seniority Distribution) */}
            <VisualCard 
              visualType="bar"
              title={language === 'ar' ? 'توزيع المستويات المهنية والخبرات' : 'Career Seniority Distribution'} 
              subtitle={language === 'ar' ? 'مخطط أعمدة • انقر على أي مستوى للتعمق في تفاصيله' : 'Clustered Column Chart • Click column to view seniority breakdown'}
              language={language}
              tableData={{
                headers: [t('slicerSeniority'), t('col_postingsCount'), t('col_marketShare')],
                rows: localizedSeniority.map(s => [s.displayName, s.jobs.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US'), `${s.share}%`])
              }}
            >
              <div className="h-72 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={localizedSeniority} 
                    margin={{ top: 5, right: 20, left: -10, bottom: 25 }}
                    onClick={(e: any) => {
                      if (e && e.activePayload && e.activePayload[0]) {
                        const level = e.activePayload[0].payload.level;
                        setDrillThroughTarget({
                          type: 'seniority',
                          title: translateSeniority(level, language),
                          seniority: level
                        });
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="displayName" tick={{ fontSize: 9, fill: '#64748b' }} interval={0} angle={-20} textAnchor="end" height={35} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Tooltip 
                      formatter={(val: any, _name: any, item: any) => [`${val.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} ${language === 'ar' ? 'وظيفة' : 'postings'} (${item.payload.share}%)`, language === 'ar' ? 'العدد' : 'Headcount']}
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '4px', fontSize: '11px' }}
                    />
                    <Bar dataKey="jobs" fill={PBI_PALETTE.violet} radius={[3, 3, 0, 0]} className="cursor-pointer" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between px-1">
                <span>{language === 'ar' ? 'أعلى فئة:' : 'Top Level:'} <strong>{language === 'ar' ? 'المستوى المتوسط والمتقدم (52.8%)' : 'Mid Level & Senior (52.8%)'}</strong></span>
                <span>{language === 'ar' ? 'النطاق النشط:' : 'Active Scope:'} <strong>{daxMetrics.totalJobs.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} {language === 'ar' ? 'وظيفة' : 'jobs'}</strong></span>
              </div>
            </VisualCard>

            {/* Visual Container: Bar Chart (Remote Share by Category) */}
            <VisualCard 
              visualType="bar"
              title={language === 'ar' ? 'معدل تبني العمل عن بُعد حسب القطاع' : 'Remote Work Adoption Rate by Sector'} 
              subtitle={language === 'ar' ? 'مخطط شريطي أفقي • انقر على شريط القطاع للتعمق في الوظائف المتاحة عن بعد' : 'Horizontal Bar Chart • Click sector bar to drill through into remote postings'}
              language={language}
              tableData={{
                headers: [t('slicerCategory'), `${t('mod_remote')} %`],
                rows: CATEGORY_DATA.map(c => [translateCategory(c.category, language), `${c.remotePct}%`])
              }}
            >
              <div className="h-72 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={CATEGORY_DATA.map(c => ({ ...c, displayName: translateCategory(c.category, language) }))} 
                    layout="vertical" 
                    margin={{ top: 0, right: 30, left: 100, bottom: 0 }}
                    onClick={(e: any) => {
                      if (e && e.activePayload && e.activePayload[0]) {
                        const cat = e.activePayload[0].payload.category;
                        setDrillThroughTarget({
                          type: 'category',
                          title: `${translateCategory(cat, language)} (${t('mod_remote')})`,
                          category: cat,
                          modality: 'Remote'
                        });
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" unit="%" tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 60]} />
                    <YAxis dataKey="displayName" type="category" tick={{ fontSize: 10, fill: '#334155' }} width={100} />
                    <Tooltip 
                      formatter={(val: any) => [`${val}% ${t('mod_remote')}`, language === 'ar' ? 'نسبة العمل عن بعد' : 'Remote Percentage']}
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '4px', fontSize: '11px' }}
                    />
                    <Bar dataKey="remotePct" fill={PBI_PALETTE.blue} radius={[0, 3, 3, 0]} className="cursor-pointer" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </VisualCard>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 3: GEOGRAPHIC & GLOBAL DISTRIBUTION */}
      {/* ========================================================================= */}
      {activePage === 3 && (
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            {/* Visual Container: Bar Chart (Top Skills Penetration) - 8 cols */}
            <VisualCard 
              visualType="bar"
              title={language === 'ar' ? 'معدل انتشار المهارات التقنية الأكثر طلباً' : 'Skill Demand Penetration'} 
              subtitle={language === 'ar' ? 'مخطط شريطي أفقي • انقر على شريط المهارة للتعمق في الوظائف التي تطلبها' : 'Horizontal Bar Chart • Click skill bar to drill through into jobs demanding this proficiency'}
              className="lg:col-span-8"
              language={language}
              tableData={{
                headers: [language === 'ar' ? 'المهارة' : 'Skill', t('slicerCategory'), t('col_postingsCount'), language === 'ar' ? 'نسبة الانتشار' : 'Penetration %'],
                rows: daxMetrics.skillsRanked.map(s => [s.skill, s.category, s.count.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US'), `${s.pct_of_jobs}%`])
              }}
            >
              <div className="h-80 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={daxMetrics.skillsRanked} 
                    layout="vertical" 
                    margin={{ top: 0, right: 30, left: 85, bottom: 0 }}
                    onClick={(e: any) => {
                      if (e && e.activePayload && e.activePayload[0]) {
                        const skillItem = e.activePayload[0].payload;
                        setDrillThroughTarget({
                          type: 'skill',
                          title: `${language === 'ar' ? 'المهارة:' : 'Skill:'} ${skillItem.skill}`,
                          skill: skillItem.skill
                        });
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" unit="%" tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 100]} />
                    <YAxis dataKey="skill" type="category" tick={{ fontSize: 10, fill: '#334155' }} width={80} />
                    <Tooltip 
                      formatter={(val: any, _name: any, item: any) => [
                        `${item.payload.count.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} ${language === 'ar' ? 'وظيفة' : 'postings'} (${val}%)`,
                        language === 'ar' ? 'معدل الطلب' : 'Penetration'
                      ]}
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '4px', fontSize: '11px' }}
                    />
                    <Bar dataKey="pct_of_jobs" fill={PBI_PALETTE.green} radius={[0, 3, 3, 0]} className="cursor-pointer" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </VisualCard>

            {/* Visual Container: Matrix Breakdown - 4 cols */}
            <VisualCard 
              visualType="table"
              title={language === 'ar' ? 'مصفوفة تصنيف المجموعات المهارية' : 'Skill Cluster Taxonomy'} 
              subtitle={language === 'ar' ? 'توزيع الكفاءات حسب المجالات التخصصية' : 'Matrix Breakdown by Competency Domain'}
              className="lg:col-span-4"
              language={language}
            >
              <div className="space-y-2.5 text-xs pt-1">
                <div 
                  onClick={() => setDrillThroughTarget({ type: 'skill', title: language === 'ar' ? 'المهارات التقنية والبرمجية' : 'Technical & Programming Core', skill: 'Python' })}
                  className="p-3 bg-[#f8fafc] rounded-[4px] border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 cursor-pointer transition-colors"
                >
                  <div className="font-bold text-[#118dff] mb-1 flex items-center justify-between">
                    <span>{language === 'ar' ? 'البرمجة والهندسة التقنية' : 'Technical & Programming'}</span>
                    <span className="font-mono text-[11px]">42.8% ⚡</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Git (21.2%), Python (20.4%), SQL (17.0%), AWS (11.3%), Docker (10.6%), React (7.6%)
                  </p>
                </div>

                <div 
                  onClick={() => setDrillThroughTarget({ type: 'skill', title: language === 'ar' ? 'الذكاء الاصطناعي وعلم البيانات' : 'AI, Data & Analytics Skills', skill: 'Machine Learning' })}
                  className="p-3 bg-[#f8fafc] rounded-[4px] border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 cursor-pointer transition-colors"
                >
                  <div className="font-bold text-[#6b007b] mb-1 flex items-center justify-between">
                    <span>{language === 'ar' ? 'الذكاء الاصطناعي وتحليل البيانات' : 'AI, Data & Analytics'}</span>
                    <span className="font-mono text-[11px]">18.4% ⚡</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Machine Learning (7.1%), Power BI (5.7%), PyTorch (4.9%), LLMs (4.0%)
                  </p>
                </div>

                <div 
                  onClick={() => setDrillThroughTarget({ type: 'skill', title: language === 'ar' ? 'القيادة وإدارة الأعمال' : 'Business & Leadership Competencies', skill: 'Leadership' })}
                  className="p-3 bg-[#f8fafc] rounded-[4px] border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 cursor-pointer transition-colors"
                >
                  <div className="font-bold text-[#e66c37] mb-1 flex items-center justify-between">
                    <span>{language === 'ar' ? 'الأعمال والقيادة التنفيذية' : 'Business & Leadership'}</span>
                    <span className="font-mono text-[11px]">38.8% ⚡</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Communication (100%), Leadership (33.9%), Excel (25.9%), PM (17.9%), Salesforce (11.7%)
                  </p>
                </div>
              </div>
            </VisualCard>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 4: COMPENSATION BENCHMARKS */}
      {/* ========================================================================= */}
      {activePage === 4 && (
        <div className="space-y-3.5">
          {/* Top KPI Cards Grid with Power BI Sparklines */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <KPICardWithSparkline
              title={language === 'ar' ? 'متوسط الراتب السنوي (المتوسط الحسابي)' : 'Average Annual Salary (Mean)'}
              value={formatSalary(daxMetrics.avgSalary, currency, { compact: true, isArabic: language === 'ar' })}
              subValue={currency}
              badgeText={language === 'ar' ? 'المتوسط الحسابي' : 'Arithmetic Mean'}
              badgeType="positive"
              subtitle={language === 'ar' ? 'محسوب عبر الوظائف النشطة المصفاة' : 'Calculated across active filtered postings'}
              accentColor={PBI_PALETTE.green}
              data={daxMetrics.monthlyTrend.map(m => ({ month: m.month, value: m.avgSalary }))}
              formatTooltip={(v) => formatSalary(v, currency, { isArabic: language === 'ar' })}
              trendLabel={`${formatSalary(daxMetrics.avgSalary, currency, { compact: true, isArabic: language === 'ar' })} ${language === 'ar' ? 'المعيار' : 'Benchmark'}`}
            />

            <KPICardWithSparkline
              title={language === 'ar' ? 'الوسيط السنوي للرواتب (الشريحة 50%)' : 'Median Annual Salary (50th %ile)'}
              value={formatSalary(daxMetrics.medianSalary, currency, { compact: true, isArabic: language === 'ar' })}
              subValue={currency}
              badgeText={language === 'ar' ? 'مرتكز الوسيط' : 'Median Anchor'}
              badgeType="positive"
              subtitle={language === 'ar' ? 'معيار تعويض مقاوم للقيم المتطرفة' : 'Outlier-resistant compensation benchmark'}
              accentColor={PBI_PALETTE.blue}
              data={daxMetrics.monthlyTrend.map(m => ({ month: m.month, value: Math.round(m.avgSalary * 0.948) }))}
              formatTooltip={(v) => formatSalary(v, currency, { isArabic: language === 'ar' })}
              trendLabel={`${formatSalary(daxMetrics.medianSalary, currency, { compact: true, isArabic: language === 'ar' })} ${language === 'ar' ? 'الوسيط' : 'Median'}`}
            />

            <KPICardWithSparkline
              title={language === 'ar' ? 'الامتثال للشفافية في الأجور' : 'Pay Transparency Compliance'}
              value={`${daxMetrics.salaryDisclosurePct}%`}
              badgeText={language === 'ar' ? 'رواتب مفصح عنها' : 'Disclosed Pay'}
              badgeType="positive"
              subtitle={language === 'ar' ? 'نسبة الإفصاح الإلزامي عن الراتب' : 'Mandatory compensation disclosure rate'}
              accentColor={PBI_PALETTE.purple}
              data={[
                { month: 'Jan', value: 62.1 }, { month: 'Feb', value: 63.4 }, 
                { month: 'Mar', value: 64.8 }, { month: 'Apr', value: 65.5 }, 
                { month: 'May', value: 66.8 }, { month: 'Jun', value: 67.2 }, 
                { month: 'Jul', value: 67.5 }, { month: 'Aug', value: 67.9 }, 
                { month: 'Sep', value: 68.2 }, { month: 'Oct', value: 68.6 }, 
                { month: 'Nov', value: 68.6 }, { month: 'Dec', value: 68.6 }
              ]}
              formatTooltip={(v) => `${v}% ${language === 'ar' ? 'نسبة الإفصاح' : 'compliance'}`}
              trendLabel={language === 'ar' ? '68.6% الامتثال التنظيمي' : '68.6% Regulatory Compliance'}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            {/* Visual Container: Line Chart (Salary Progression) */}
            <VisualCard 
              visualType="line"
              title={language === 'ar' ? 'منحنى تدرج الرواتب حسب المستوى الوظيفي' : 'Salary Progression Curve by Seniority Tier'} 
              subtitle={language === 'ar' ? 'مخطط خطي • انقر على أي عقدة للتعمق في رواتب فئة الخبرة' : 'Line Chart • Click tier node to drill through into seniority microdata'}
              language={language}
              tableData={{
                headers: [t('slicerSeniority'), `${t('kpi_avgSalary')} (${currency})`, `${language === 'ar' ? 'وسيط الراتب' : 'Median Salary'} (${currency})`],
                rows: SENIORITY_DATA.map(s => [translateSeniority(s.level, language), formatSalary(s.avgSalary, currency, { isArabic: language === 'ar' }), formatSalary(s.medianSalary, currency, { isArabic: language === 'ar' })])
              }}
            >
              <div className="h-72 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={SENIORITY_DATA.map(s => ({ ...s, displayName: translateSeniority(s.level, language) }))} 
                    margin={{ top: 5, right: 20, left: 15, bottom: 25 }}
                    onClick={(e: any) => {
                      if (e && e.activePayload && e.activePayload[0]) {
                        const level = e.activePayload[0].payload.level;
                        setDrillThroughTarget({
                          type: 'seniority',
                          title: translateSeniority(level, language),
                          seniority: level
                        });
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="displayName" tick={{ fontSize: 9, fill: '#64748b' }} interval={0} angle={-20} textAnchor="end" height={35} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => formatSalary(v, currency, { compact: true, isArabic: language === 'ar' })} />
                    <Tooltip 
                      formatter={(v: any) => [`${formatSalary(v, currency, { isArabic: language === 'ar' })}`, language === 'ar' ? 'الراتب' : 'Salary']}
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '4px', fontSize: '11px' }}
                    />
                    <Line type="monotone" dataKey="avgSalary" stroke={PBI_PALETTE.blue} strokeWidth={2.5} name={language === 'ar' ? 'متوسط الراتب' : 'Average Salary'} />
                    <Line type="monotone" dataKey="medianSalary" stroke={PBI_PALETTE.green} strokeWidth={2} strokeDasharray="3 3" name={language === 'ar' ? 'وسيط الراتب' : 'Median Salary'} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </VisualCard>

            {/* Visual Container: Bar Chart (Salary by Category) */}
            <VisualCard 
              visualType="bar"
              title={language === 'ar' ? 'متوسط الرواتب حسب القطاع التقني' : 'Average Salary by Industry Category'} 
              subtitle={language === 'ar' ? 'مخطط شريطي أفقي • انقر على القطاع لاستعراض الوظائف الأعلى أجراً' : 'Horizontal Bar Chart • Click category to drill through into high-paying roles'}
              language={language}
              tableData={{
                headers: [t('slicerCategory'), `${t('kpi_avgSalary')} (${currency})`],
                rows: [...localizedCategories].sort((a,b) => b.avgSalary - a.avgSalary).map(c => [c.displayName, formatSalary(c.avgSalary, currency, { isArabic: language === 'ar' })])
              }}
            >
              <div className="h-72 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[...localizedCategories].sort((a,b) => b.avgSalary - a.avgSalary)} 
                    layout="vertical" 
                    margin={{ top: 0, right: 30, left: 100, bottom: 0 }}
                    onClick={(e: any) => {
                      if (e && e.activePayload && e.activePayload[0]) {
                        const cat = e.activePayload[0].payload.category;
                        setDrillThroughTarget({
                          type: 'category',
                          title: translateCategory(cat, language),
                          category: cat
                        });
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" tickFormatter={(v) => formatSalary(v, currency, { compact: true, isArabic: language === 'ar' })} tick={{ fontSize: 10, fill: '#64748b' }} />
                    <YAxis dataKey="displayName" type="category" tick={{ fontSize: 10, fill: '#334155' }} width={100} />
                    <Tooltip 
                      formatter={(v: any) => [`${formatSalary(v, currency, { isArabic: language === 'ar' })}`, t('kpi_avgSalary')]}
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '4px', fontSize: '11px' }}
                    />
                    <Bar dataKey="avgSalary" fill={PBI_PALETTE.teal} radius={[0, 3, 3, 0]} className="cursor-pointer" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </VisualCard>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 5: AI VS MACRO LABOR MARKET */}
      {/* ========================================================================= */}
      {activePage === 5 && (
        <div className="space-y-3.5">
          {/* Top Comparative KPI Cards with Power BI Sparklines */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <KPICardWithSparkline
              title={language === 'ar' ? 'وظائف الذكاء الاصطناعي التخصصية' : 'AI & ML Specialized Roles'}
              value={daxMetrics.aiJobs.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}
              subValue={`(${daxMetrics.aiPercentage}%)`}
              badgeText={`+${daxMetrics.aiSalaryPremiumPct}% ${language === 'ar' ? 'أجر' : 'Pay'}`}
              badgeType="accent"
              subtitle={`${language === 'ar' ? 'المتوسط:' : 'Avg:'} ${formatSalary(daxMetrics.aiAvgSalary, currency, { compact: true, isArabic: language === 'ar' })}`}
              accentColor={PBI_PALETTE.coral}
              data={daxMetrics.monthlyTrend.map(m => ({ month: m.month, value: m.ai }))}
              formatTooltip={(v) => `${v} ${language === 'ar' ? 'وظيفة ذكاء اصطناعي' : 'AI/ML positions'}`}
              trendLabel={`${daxMetrics.aiJobs} ${language === 'ar' ? 'وظيفة متخصصة' : 'Specialized Roles'}`}
            />

            <KPICardWithSparkline
              title={language === 'ar' ? 'وظائف السوق العامة (غير المتخصصة بالذكاء الاصطناعي)' : 'Core Non-AI Labor Market'}
              value={daxMetrics.nonAiJobs.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}
              subValue={`(${daxMetrics.nonAiPercentage}%)`}
              badgeText={language === 'ar' ? 'السوق العام' : 'Broad Market'}
              badgeType="positive"
              subtitle={`${language === 'ar' ? 'المتوسط:' : 'Avg:'} ${formatSalary(daxMetrics.nonAiAvgSalary, currency, { compact: true, isArabic: language === 'ar' })}`}
              accentColor={PBI_PALETTE.blue}
              data={daxMetrics.monthlyTrend.map(m => ({ month: m.month, value: m.postings - m.ai }))}
              formatTooltip={(v) => `${v.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} ${language === 'ar' ? 'وظيفة عامة' : 'non-AI positions'}`}
              trendLabel={`${daxMetrics.nonAiJobs} ${language === 'ar' ? 'وظيفة عامة' : 'Core Positions'}`}
            />

            <KPICardWithSparkline
              title={language === 'ar' ? 'علاوة رواتب الذكاء الاصطناعي' : 'AI Compensation Premium'}
              value={`+${daxMetrics.aiSalaryPremiumPct}%`}
              subValue={language === 'ar' ? 'فارق الأجر' : 'Delta'}
              badgeText={`+${formatSalary(daxMetrics.aiAvgSalary - daxMetrics.nonAiAvgSalary, currency, { compact: true, isArabic: language === 'ar' })}`}
              badgeType="positive"
              subtitle={language === 'ar' ? 'متوسط الفارق المالي مقارنة بالوظائف العامة' : 'Average compensation premium over core roles'}
              accentColor={PBI_PALETTE.green}
              data={daxMetrics.monthlyTrend.map((m, idx) => ({ 
                month: m.month, 
                value: Number((daxMetrics.aiSalaryPremiumPct * (0.95 + (idx * 0.01))).toFixed(1)) 
              }))}
              formatTooltip={(v) => `+${v}% ${language === 'ar' ? 'علاوة' : 'pay premium'}`}
              trendLabel={`+${daxMetrics.aiSalaryPremiumPct}% ${language === 'ar' ? 'علاوة اقتصادية' : 'Economic Premium'}`}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            {/* Visual Container: Bar Chart (AI Concentration) */}
            <VisualCard 
              visualType="bar"
              title={language === 'ar' ? 'نسبة تركيز وظائف الذكاء الاصطناعي حسب القطاع' : 'AI Role Concentration by Industry Sector'} 
              subtitle={language === 'ar' ? 'مخطط أعمدة • انقر على العمود للتعمق في وظائف الذكاء الاصطناعي لهذا القطاع' : 'Clustered Column Chart • Click column to drill through into AI roles for sector'}
              language={language}
              tableData={{
                headers: [t('slicerCategory'), language === 'ar' ? 'تركيز الذكاء الاصطناعي %' : 'AI Concentration %'],
                rows: CATEGORY_DATA.filter(c => c.aiPct > 0).map(c => [translateCategory(c.category, language), `${c.aiPct}%`])
              }}
            >
              <div className="h-72 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={CATEGORY_DATA.filter(c => c.aiPct > 0).map(c => ({ ...c, displayName: translateCategory(c.category, language) }))} 
                    margin={{ top: 5, right: 20, left: 10, bottom: 10 }}
                    onClick={(e: any) => {
                      if (e && e.activePayload && e.activePayload[0]) {
                        const cat = e.activePayload[0].payload.category;
                        setDrillThroughTarget({
                          type: 'category',
                          title: `${translateCategory(cat, language)} (${language === 'ar' ? 'تخصص ذكاء اصطناعي' : 'AI Specialized'})`,
                          category: cat,
                          ai: 'Yes'
                        });
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="displayName" tick={{ fontSize: 10, fill: '#334155' }} />
                    <YAxis unit="%" tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Tooltip 
                      formatter={(v: any) => [`${v}% ${language === 'ar' ? 'نسبة تركيز الذكاء الاصطناعي' : 'AI concentration'}`, '']}
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '4px', fontSize: '11px' }}
                    />
                    <Bar dataKey="aiPct" fill={PBI_PALETTE.coral} radius={[3, 3, 0, 0]} className="cursor-pointer" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </VisualCard>

            {/* Visual Container: Donut / Bar Comparison (Modality in AI vs Non-AI) */}
            <VisualCard 
              visualType="bar"
              title={language === 'ar' ? 'مرونة العمل: وظائف الذكاء الاصطناعي مقابل الوظائف العامة' : 'Remote Work Adoption: AI vs. Non-AI Roles'} 
              subtitle={language === 'ar' ? 'مقارنة أنماط العمل (عن بُعد، هجين، حضوري)' : 'Clustered Column Chart • Click bar to drill through into AI vs Non-AI segments'}
              language={language}
              tableData={{
                headers: [language === 'ar' ? 'الفئة' : 'Segment', t('mod_remote'), t('mod_hybrid'), t('mod_onsite')],
                rows: [
                  [language === 'ar' ? 'وظائف الذكاء الاصطناعي' : 'AI Specialized Roles', '48.3%', '38.6%', '13.1%'],
                  [language === 'ar' ? 'الوظائف العامة' : 'Non-AI General Roles', '37.6%', '36.3%', '26.1%']
                ]
              }}
            >
              <div className="h-72 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[
                      { name: language === 'ar' ? 'وظائف الذكاء الاصطناعي' : 'AI Roles', raw: 'AI', remote: 48.3, hybrid: 38.6, onsite: 13.1 },
                      { name: language === 'ar' ? 'الوظائف العامة' : 'Non-AI Roles', raw: 'Non-AI', remote: 37.6, hybrid: 36.3, onsite: 26.1 }
                    ]}
                    margin={{ top: 15, right: 30, left: 10, bottom: 5 }}
                    onClick={(e: any) => {
                      if (e && e.activePayload && e.activePayload[0]) {
                        const rawType = e.activePayload[0].payload.raw;
                        const isAi = rawType === 'AI';
                        setDrillThroughTarget({
                          type: 'ai',
                          title: isAi ? (language === 'ar' ? 'وظائف متخصصة بالذكاء الاصطناعي' : 'AI Specialized Positions') : (language === 'ar' ? 'الوظائف العامة' : 'Core Non-AI Positions'),
                          ai: isAi ? 'Yes' : 'No'
                        });
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#334155' }} />
                    <YAxis unit="%" tick={{ fontSize: 10, fill: '#64748b' }} />
                    <Tooltip 
                      formatter={(val: any) => [`${val}%`, '']}
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '4px', fontSize: '11px' }}
                    />
                    <Bar dataKey="remote" name={`${t('mod_remote')} %`} fill={PBI_PALETTE.blue} className="cursor-pointer" />
                    <Bar dataKey="hybrid" name={`${t('mod_hybrid')} %`} fill={PBI_PALETTE.violet} className="cursor-pointer" />
                    <Bar dataKey="onsite" name={`${t('mod_onsite')} %`} fill={PBI_PALETTE.teal} className="cursor-pointer" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </VisualCard>
          </div>
        </div>
      )}

      {/* Power BI Interactive Drill-Through Overlay */}
      {drillThroughTarget && (
        <DrillThroughOverlay
          target={drillThroughTarget}
          currency={currency}
          language={language}
          onClose={() => setDrillThroughTarget(null)}
          onApplyAsSlicer={handleApplyDrillThroughSlicer}
          globalFilters={{
            country: selectedCountry,
            category: selectedCategory,
            modality: selectedModality,
            ai: selectedAI,
            seniority: selectedSeniority,
          }}
        />
      )}
    </div>
  );
};
