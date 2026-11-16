import React, { useState, useMemo, useEffect } from 'react';
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
import { NativeChart } from './AdvancedCharts';
import { PowerBITreemap } from './PowerBITreemap';
import { KPICardWithSparkline } from './KPICardWithSparkline';
import { DrillThroughOverlay, DrillThroughTarget } from './DrillThroughOverlay';
import { CurrencyCode, formatSalary } from '../utils/currency';
import { CustomMetric } from './DaxPlaygroundModal';
import { Language, useTranslation, translateCategory, translateCountry, translateSeniority, translateModality, translateMonth } from '../utils/i18n';

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
  blue: '#E58A3A',
  navy: '#A94F24',
  coral: '#F28B35',
  violet: '#B66A42',
  purple: '#A85C36',
  teal: '#D6A15B',
  green: '#63A77A',
  crimson: '#D45F55',
  amber: '#F0A34A',
  slate: '#A99A8C',
  lightSlate: '#6B5748',
  bgSoft: '#21150F'
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

  // Keep the ATS table on its first page whenever slicers or search change.
  useEffect(() => {
    setAtsTablePage(1);
  }, [selectedCountry, selectedCategory, selectedModality, selectedAI, selectedSeniority, jobSearch]);

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

  // Month labels localized for the trend visual
  const localizedMonthlyTrend = useMemo(() => {
    return daxMetrics.monthlyTrend.map(m => ({ ...m, month: translateMonth(m.month, language) }));
  }, [daxMetrics.monthlyTrend, language]);

  // Derive all comparison visuals from the same filtered record set.
  // This prevents fixed demo percentages from ignoring active slicers.
  const scopedCategoryMetrics = useMemo(() => localizedCategories.map(category => {
    const rows = daxMetrics.matchingRecords.filter(job => job.Job_Category === category.category);
    const remote = rows.filter(job => job.Workplace_Modality?.toLowerCase() === 'remote' || job.Is_Remote === 'Yes').length;
    const ai = rows.filter(job => job.Is_AI_Job === 'Yes' || (job.Is_AI_Job as any) === true || (job.Is_AI_Job as any) === 'true').length;
    const salaries = rows.map(job => job.Salary_Avg_USD).filter((value): value is number => typeof value === 'number' && value > 0).sort((a,b)=>a-b);
    const avgSalary = salaries.length ? Math.round(salaries.reduce((sum,value)=>sum+value,0)/salaries.length) : 0;
    const medianSalary = salaries.length ? (salaries.length % 2 ? salaries[Math.floor(salaries.length/2)] : Math.round((salaries[salaries.length/2-1]+salaries[salaries.length/2])/2)) : 0;
    return { ...category, avgSalary, medianSalary, remotePct: rows.length ? Number((remote / rows.length * 100).toFixed(1)) : 0, aiPct: rows.length ? Number((ai / rows.length * 100).toFixed(1)) : 0 };
  }), [localizedCategories, daxMetrics.matchingRecords]);

  const scopedSeniorityMetrics = useMemo(() => localizedSeniority.map(level => {
    const rows = daxMetrics.matchingRecords.filter(job => job.Seniority === level.level);
    const salaries = rows.map(job => job.Salary_Avg_USD).filter((value): value is number => typeof value === 'number' && value > 0).sort((a,b)=>a-b);
    const average = salaries.length ? Math.round(salaries.reduce((sum,value)=>sum+value,0)/salaries.length) : 0;
    const median = salaries.length ? (salaries.length % 2 ? salaries[Math.floor(salaries.length/2)] : Math.round((salaries[salaries.length/2-1] + salaries[salaries.length/2]) / 2)) : 0;
    return { ...level, jobs: rows.length, avgSalary: average, medianSalary: median };
  }), [localizedSeniority, daxMetrics.matchingRecords]);

  const scopedAiModality = useMemo(() => (['Yes', 'No'] as const).map(aiFlag => {
    const rows = daxMetrics.matchingRecords.filter(job => {
      const isAi = job.Is_AI_Job === 'Yes' || (job.Is_AI_Job as any) === true || (job.Is_AI_Job as any) === 'true';
      return aiFlag === 'Yes' ? isAi : !isAi;
    });
    const count = (modality: string) => rows.filter(job => job.Workplace_Modality?.toLowerCase() === modality.toLowerCase()).length;
    return { raw: aiFlag === 'Yes' ? 'AI' : 'Non-AI', name: aiFlag === 'Yes' ? (language === 'ar' ? 'وظائف الذكاء الاصطناعي' : 'AI Roles') : (language === 'ar' ? 'الوظائف العامة' : 'Non-AI Roles'), remote: rows.length ? Number((count('Remote') / rows.length * 100).toFixed(1)) : 0, hybrid: rows.length ? Number((count('Hybrid') / rows.length * 100).toFixed(1)) : 0, onsite: rows.length ? Number((count('On-site') / rows.length * 100).toFixed(1)) : 0 };
  }), [daxMetrics.matchingRecords, language]);

  const scopedMonthlySalaryMetrics = useMemo(() => daxMetrics.monthlyTrend.map((month, index) => {
    // Match by year-month, not month name, so January from different years is never merged.
    const rows = daxMetrics.matchingRecords.filter(job => job.Year_Month === month.yearMonth);
    const salaries = rows.map(job => job.Salary_Avg_USD).filter((value): value is number => typeof value === 'number' && value > 0).sort((a,b)=>a-b);
    const aiSalaries = rows.filter(job => job.Is_AI_Job === 'Yes').map(job => job.Salary_Avg_USD).filter((value): value is number => typeof value === 'number' && value > 0);
    const otherSalaries = rows.filter(job => job.Is_AI_Job !== 'Yes').map(job => job.Salary_Avg_USD).filter((value): value is number => typeof value === 'number' && value > 0);
    const mean = (values: number[]) => values.length ? values.reduce((sum,value)=>sum+value,0)/values.length : 0;
    const aiMean = mean(aiSalaries);
    const otherMean = mean(otherSalaries);
    return {
      month: localizedMonthlyTrend[index]?.month || month.month,
      avgSalary: mean(salaries),
      medianSalary: salaries.length ? (salaries.length % 2 ? salaries[Math.floor(salaries.length / 2)] : Math.round((salaries[salaries.length / 2 - 1] + salaries[salaries.length / 2]) / 2)) : 0,
      disclosurePct: rows.length ? Number((salaries.length / rows.length * 100).toFixed(1)) : 0,
      premiumPct: otherMean > 0 ? Number(((aiMean - otherMean) / otherMean * 100).toFixed(1)) : 0
    };
  }), [daxMetrics.monthlyTrend, daxMetrics.matchingRecords, localizedMonthlyTrend]);

  const skillGroups = useMemo(() => [
    { id: 'technical', label: language === 'ar' ? 'البرمجة والهندسة التقنية' : 'Technical & Programming', skills: ['Git','Python','SQL','AWS','Docker','React','TypeScript','Node.js','Kubernetes','Java','Go','C#'] },
    { id: 'data', label: language === 'ar' ? 'الذكاء الاصطناعي وتحليل البيانات' : 'AI, Data & Analytics', skills: ['Machine Learning','Power BI','PyTorch','TensorFlow','Generative AI / LLM','Deep Learning','Snowflake','Spark','Databricks','Pandas','HuggingFace'] },
    { id: 'business', label: language === 'ar' ? 'الأعمال والقيادة التنفيذية' : 'Business & Leadership', skills: ['Communication','Leadership','Excel','Project Management','Salesforce','Negotiation','Strategic Planning','Stakeholder Management'] }
  ], [language]);

  const scopedSkillClusters = useMemo(() => skillGroups.map(group => {
    const counts = group.skills.map(skill => ({ skill, count: daxMetrics.matchingRecords.filter(job => (job.Skills_List || '').split(',').some(value => value.trim().toLowerCase() === skill.toLowerCase())).length })).filter(item => item.count > 0).sort((a,b)=>b.count-a.count);
    const postings = daxMetrics.matchingRecords.filter(job => (job.Skills_List || '').split(',').some(value => group.skills.some(skill => value.trim().toLowerCase() === skill.toLowerCase()))).length;
    return { ...group, count: postings, pct: daxMetrics.matchingRecords.length ? Number((postings / daxMetrics.matchingRecords.length * 100).toFixed(1)) : 0, topSkills: counts.slice(0,5) };
  }), [skillGroups, daxMetrics.matchingRecords]);

  const peakMonth = localizedMonthlyTrend.length > 0
    ? localizedMonthlyTrend.reduce((best, cur) => (cur.postings > best.postings ? cur : best), localizedMonthlyTrend[0])
    : null;

  // If a visual is in Focus Mode
  if (focusedVisual) {
    return (
      <div className="focus-mode-panel rounded-2xl border border-[#513522] p-5 shadow-2xl flex flex-col h-full min-h-[520px]">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
          <button
            onClick={() => setFocusedVisual(null)}
            className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-semibold text-[#118dff] hover:text-[#0078d4] px-3 py-1.5 bg-sky-50 rounded-[4px] border border-sky-200 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{language === 'ar' ? 'العودة إلى لوحة التقرير الكاملة' : 'Back to Full Report Canvas'}</span>
          </button>
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs text-slate-600 font-medium">
            <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] border border-slate-200">{language === 'ar' ? 'وضع التركيز الموسّع' : 'Expanded View'}</span>
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
                categoryData={daxMetrics.categoryDistribution}
                countryData={daxMetrics.countryDistribution}
                records={daxMetrics.matchingRecords}
                totalJobs={daxMetrics.totalJobs}
              />
            </div>
          ) : (
            <div className="w-full h-96">
              <NativeChart kind="lollipop" language={language} height={260} color={PBI_PALETTE.coral} data={localizedCategories.slice(0,9).map(c=>({id:c.category,label:c.displayName,value:c.jobs}))} onSelect={d=>setSelectedCategory(d.id||'All')} formatValue={v=>v.toLocaleString(language==='ar'?'ar-EG':'en-US')} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-canvas space-y-4">
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
  <section className="exec-report" aria-label={language === 'ar' ? 'التقرير التنفيذي' : 'Executive report'}>
    <div className="exec-toolbar">
      <div><span className="exec-report-kicker">{language === 'ar' ? 'لوحة المؤشرات الرئيسية' : 'EXECUTIVE SCORECARD'}</span><strong>{language === 'ar' ? 'مؤشرات سوق العمل' : 'Labour market indicators'}</strong></div>
      <span>{language === 'ar' ? 'تتغير النتائج وفق عوامل التصفية المحددة' : 'Results respond to selected filters'}</span>
    </div>

    <div className="exec-kpis">
      <article className="exec-kpi exec-kpi-primary"><span>{t('kpi_totalJobs')}</span><strong>{daxMetrics.totalJobs.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</strong><small>{language === 'ar' ? 'إجمالي الإعلانات ضمن النطاق' : 'Total postings in scope'}</small></article>
      <article className="exec-kpi"><span>{t('kpi_activeEmployers')}</span><strong>{daxMetrics.totalCompanies.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</strong><small>{language === 'ar' ? 'جهة توظيف' : 'Employers'}</small></article>
      <article className="exec-kpi"><span>{language === 'ar' ? 'الدول الممثلة' : 'Countries represented'}</span><strong>{daxMetrics.totalCountries.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</strong><small>{language === 'ar' ? 'ضمن البيانات الحالية' : 'In current dataset'}</small></article>
      <article className="exec-kpi"><span>{t('kpi_remoteHybrid')}</span><strong>{(daxMetrics.remotePercentage + daxMetrics.hybridPercentage).toFixed(1)}%</strong><small>{language === 'ar' ? 'عن بُعد أو هجين' : 'Remote or hybrid'}</small></article>
      <article className="exec-kpi"><span>{t('kpi_aiSpecialization')}</span><strong>{daxMetrics.aiPercentage}%</strong><small>{daxMetrics.aiJobs.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} {language === 'ar' ? 'وظيفة' : 'postings'}</small></article>
      <article className="exec-kpi"><span>{t('kpi_avgSalary')}</span><strong>{formatSalary(daxMetrics.avgSalary, currency, {compact:true,isArabic:language==='ar'})}</strong><small>{language === 'ar' ? 'الوسيط' : 'Median'}: {formatSalary(daxMetrics.medianSalary,currency,{compact:true,isArabic:language==='ar'})}</small></article>
    </div>

    <div className="exec-grid exec-grid-main">
      <article className="exec-panel exec-panel-wide">
        <header><div><span className="exec-panel-index">01</span><h3>{t('chart_monthlyTrend')}</h3></div><small>{language === 'ar' ? 'إجمالي الإعلانات الشهرية ونسبة الوظائف عن بُعد' : 'Postings and remote-work trend by month'}</small></header>
        <div className="exec-chart exec-chart-tall">
          <NativeChart kind="monthly" height={280} language={language} color={PBI_PALETTE.blue} secondaryColor={PBI_PALETTE.violet} data={localizedMonthlyTrend.map(m=>({label:m.month,value:m.postings}))} secondaryData={localizedMonthlyTrend.map(m=>({label:m.month,value:m.postings>0?Number((m.remote/m.postings*100).toFixed(1)):0}))} formatValue={v=>v.toLocaleString(language==='ar'?'ar-EG':'en-US')} />
        </div>
        <footer><span><i className="exec-key exec-key-blue"/> {t('kpi_totalJobs')}</span><span><i className="exec-key exec-key-purple"/> {language==='ar'?'نسبة العمل عن بُعد':'Remote share (%)'}</span><b>{peakMonth ? peakMonth.month : '—'}</b></footer>
      </article>

      <article className="exec-panel">
        <header><div><span className="exec-panel-index">02</span><h3>{t('chart_modalityDistribution')}</h3></div><small>{language==='ar'?'توزيع نمط العمل':'Work arrangement mix'}</small></header>
        <div className="exec-chart exec-chart-donut">
          <NativeChart kind="donut" language={language} centerLabel={language==='ar'?'إجمالي الوظائف':'TOTAL JOBS'} centerValue={daxMetrics.totalJobs.toLocaleString(language==='ar'?'ar-EG':'en-US')} data={localizedModality.map((m,i)=>({id:m.modality,label:m.displayName,value:m.count,color:MODALITY_COLORS[i%MODALITY_COLORS.length]}))} onSelect={d=>setSelectedModality(d.id||'All')} />
        </div>
        <div className="exec-legend">{localizedModality.map((m:any,i:number)=><button key={m.modality||i} onClick={()=>setSelectedModality(m.modality)} className={selectedModality===m.modality?'is-selected':''}><i style={{background:MODALITY_COLORS[i%MODALITY_COLORS.length]}}/><span>{m.displayName}</span><b>{m.percentage}%</b></button>)}</div>
      </article>

      <article className="exec-panel exec-panel-half">
        <header><div><span className="exec-panel-index">03</span><h3>{t('chart_postingsByCategory')}</h3></div><small>{language==='ar'?'ترتيب القطاعات حسب حجم الطلب':'Ranked by posting volume'}</small></header>
        <div className="exec-chart exec-chart-bars">
          <NativeChart kind="lollipop" language={language} height={270} color={PBI_PALETTE.coral} data={localizedCategories.slice(0,10).map(c=>({id:c.category,label:c.displayName,value:c.jobs}))} onSelect={d=>setSelectedCategory(d.id||'All')} formatValue={v=>v.toLocaleString(language==='ar'?'ar-EG':'en-US')} />
        </div>
        <footer><span>{language==='ar'?'انقر على القطاع لتطبيق التصفية':'Select a category to filter'}</span><b>{localizedCategories.length} {language==='ar'?'قطاعاً':'categories'}</b></footer>
      </article>

      <article className="exec-panel exec-panel-half">
        <header><div><span className="exec-panel-index">04</span><h3>{t('chart_postingsByCountry')}</h3></div><small>{language==='ar'?'أعلى الدول من حيث الإعلانات':'Leading countries by postings'}</small></header>
        <div className="exec-chart exec-chart-bars">
          <NativeChart kind="bubble" language={language} height={250} data={localizedCountries.slice(0,8).map((c,i)=>({id:c.country,label:c.displayName,value:c.jobs,color:['#D6A15B','#F08B3D','#B95B35','#63A77A'][i%4]}))} onSelect={d=>setSelectedCountry(d.id||'All')} formatValue={v=>v.toLocaleString(language==='ar'?'ar-EG':'en-US')} />
        </div>
        <footer><span>{language==='ar'?'انقر على الدولة لتطبيق التصفية':'Select a country to filter'}</span><b>{daxMetrics.totalCountries} {language==='ar'?'دول':'countries'}</b></footer>
      </article>

      <article className="exec-panel exec-panel-half">
        <header><div><span className="exec-panel-index">05</span><h3>{language==='ar'?'مزيج المستويات المهنية':'Career seniority mix'}</h3></div><small>{language==='ar'?'حصة كل مستوى من الوظائف':'Share of postings by seniority'}</small></header>
        <div className="exec-chart exec-chart-donut">
          <NativeChart kind="waffle" language={language} data={localizedSeniority.map((e,i)=>({id:e.level,label:e.displayName,value:e.jobs,color:[PBI_PALETTE.blue,PBI_PALETTE.violet,PBI_PALETTE.teal,PBI_PALETTE.coral,PBI_PALETTE.green][i%5]}))} onSelect={d=>setSelectedSeniority(d.id||'All')} />
        </div>
        <div className="exec-legend">{localizedSeniority.map((entry:any,i:number)=><button key={entry.level||i} onClick={()=>setSelectedSeniority(entry.level)}><i style={{background:[PBI_PALETTE.blue,PBI_PALETTE.violet,PBI_PALETTE.teal,PBI_PALETTE.coral,PBI_PALETTE.green][i%5]}}/><span>{entry.displayName}</span><b>{entry.share}%</b></button>)}</div>
      </article>

      <article className="exec-panel exec-panel-half">
        <header><div><span className="exec-panel-index">06</span><h3>{language==='ar'?'حصة وظائف الذكاء الاصطناعي':'AI roles share'}</h3></div><small>{language==='ar'?'مقارنة الوظائف المتخصصة ببقية السوق':'Specialized roles vs. the rest of the market'}</small></header>
        <div className="exec-chart exec-chart-donut">
          <NativeChart kind="radial" language={language} centerLabel={language==='ar'?'حصة وظائف AI':'AI ROLE SHARE'} centerValue={daxMetrics.aiPercentage+'%'} data={[{id:'Yes',label:'AI roles',value:daxMetrics.aiPercentage,color:PBI_PALETTE.coral}]} onSelect={()=>setSelectedAI('Yes')} />
        </div>
        <div className="exec-legend"><button onClick={()=>setSelectedAI('Yes')}><i style={{background:PBI_PALETTE.coral}}/><span>{language==='ar'?'وظائف الذكاء الاصطناعي':'AI roles'}</span><b>{daxMetrics.aiPercentage}%</b></button><button onClick={()=>setSelectedAI('No')}><i style={{background:'#536b70'}}/><span>{language==='ar'?'وظائف أخرى':'Other roles'}</span><b>{daxMetrics.nonAiPercentage}%</b></button></div>
      </article>

      <article className="exec-panel exec-panel-wide">
        <header><div><span className="exec-panel-index">07</span><h3>{language==='ar'?'متوسط الرواتب حسب القطاع':'Average salary by category'}</h3></div><small>{language==='ar'?'مقارنة معيارية بالعملة المحددة':'Benchmark comparison in selected currency'}</small></header>
        <div className="exec-chart exec-chart-salary">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[...scopedCategoryMetrics].sort((a,b)=>a.avgSalary-b.avgSalary).slice(-10)} layout="vertical" margin={{top:2,right:28,left:language==='ar'?8:10,bottom:2}}>
              <CartesianGrid horizontal={false} stroke="#edf1f5"/>
              <XAxis type="number" tick={{fontSize:9,fill:'#748194'}} tickFormatter={(v)=>formatSalary(v,currency,{compact:true,isArabic:language==='ar'})} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="displayName" width={language==='ar'?112:125} tick={{fontSize:10,fill:'#475569'}} axisLine={false} tickLine={false}/>
              <Tooltip formatter={(v:any)=>[formatSalary(Number(v),currency,{isArabic:language==='ar'}),language==='ar'?'متوسط الراتب':'Average salary']} contentStyle={{border:'1px solid #cbd4df',borderRadius:2,fontSize:11}}/>
              <Bar dataKey="avgSalary" fill="#107C41" barSize={13} radius={[0,1,1,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="exec-panel exec-panel-insight">
        <header><div><span className="exec-panel-index">08</span><h3>{language==='ar'?'مؤشرات سريعة':'At a glance'}</h3></div></header>
        <div className="exec-facts">
          <div><span>{language==='ar'?'وظائف الذكاء الاصطناعي':'AI postings'}</span><b>{daxMetrics.aiJobs.toLocaleString(language==='ar'?'ar-EG':'en-US')}</b></div>
          <div><span>{language==='ar'?'علاوة راتب الذكاء الاصطناعي':'AI salary premium'}</span><b>+{daxMetrics.aiSalaryPremiumPct}%</b></div>
          <div><span>{language==='ar'?'الراتب الوسيط':'Median salary'}</span><b>{formatSalary(daxMetrics.medianSalary,currency,{compact:true,isArabic:language==='ar'})}</b></div>
          <div><span>{language==='ar'?'العمل عن بُعد':'Remote postings'}</span><b>{daxMetrics.remotePercentage}%</b></div>
        </div>
      </article>
    </div>

    <article className="exec-panel exec-table-panel">
      <header><div><span className="exec-panel-index">09</span><h3>{t('jobTableTitle')}</h3></div><input className="exec-table-search" type="search" value={jobSearch} onChange={(e)=>{setJobSearch(e.target.value);setAtsTablePage(1);}} placeholder={language==='ar'?'ابحث في المسميات والشركات...' : 'Search titles and employers...'}/><small>{language==='ar'? 'عينة من السجلات المطابقة' : 'Sample of matching records'}</small></header>
      <div className="exec-table-scroll"><table className="exec-table"><thead><tr><th>{t('col_jobTitle')}</th><th>{t('col_company')}</th><th>{t('col_category')}</th><th>{t('col_location')}</th><th>{t('col_modality')}</th><th>{t('col_salary')} ({currency})</th></tr></thead><tbody>
        {paginatedJobs.slice(0,5).map((j:any)=><tr key={j.Job_ID} onClick={()=>setDrillThroughTarget({type:'category',title:translateCategory(j.Job_Category,language)+' ('+translateCountry(j.Country,language)+')',category:j.Job_Category,country:j.Country})}><td>{j.Job_Title}</td><td>{j.Company}</td><td>{translateCategory(j.Job_Category,language)}</td><td>{translateCountry(j.Country,language)}</td><td>{translateModality(j.Workplace_Modality,language)}</td><td>{formatSalary(j.Salary_Avg_USD||0,currency,{isArabic:language==='ar'})}</td></tr>)}
      </tbody></table></div>
      <footer><span>{language==='ar'? 'عدد السجلات المطابقة: ' : 'Matching records: '}{filteredJobs.length.toLocaleString(language==='ar'?'ar-EG':'en-US')}</span><div className="exec-pagination"><button onClick={()=>setAtsTablePage(p=>Math.max(1,p-1))} disabled={atsTablePage===1}>{language==='ar'?'السابق':'Previous'}</button><span>{atsTablePage} / {totalAtsPages}</span><button onClick={()=>setAtsTablePage(p=>Math.min(totalAtsPages,p+1))} disabled={atsTablePage===totalAtsPages}>{language==='ar'?'التالي':'Next'}</button></div></footer>
    </article>
  </section>
)}

      {/* PAGE 2: INDUSTRY DEMAND & SENIORITY */}
      {/* ========================================================================= */}
      {activePage === 2 && (
        <div className="space-y-3.5">
          {/* Row 1: Skill Demand Penetration & Skill Cluster Taxonomy */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            <VisualCard
              visualType="bar"
              title={language === 'ar' ? 'معدل انتشار المهارات التقنية الأكثر طلباً' : 'Skill Demand Penetration'}
              subtitle={language === 'ar' ? 'مخطط شريطي أفقي • انقر على شريط المهارة للتعمق في الوظائف التي تطلبها' : 'Horizontal Bar Chart • Click skill bar to drill through into jobs demanding this proficiency'}
              className="lg:col-span-8"
              onFocusMode={() => setFocusedVisual(language === 'ar' ? 'معدل انتشار المهارات التقنية الأكثر طلباً' : 'Skill Demand Penetration')}
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
                    margin={{ top: 0, right: 30, left: 145, bottom: 0 }}
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
                    <YAxis dataKey="skill" type="category" tick={{ fontSize: 10, fill: '#334155' }} width={125} />
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

            <VisualCard
              visualType="table"
              title={language === 'ar' ? 'مصفوفة تصنيف المجموعات المهارية' : 'Skill Cluster Taxonomy'}
              subtitle={language === 'ar' ? 'توزيع الكفاءات حسب المجالات التخصصية' : 'Matrix Breakdown by Competency Domain'}
              className="lg:col-span-4"
              language={language}
            >
              <div className="space-y-2.5 text-xs pt-1">
                {scopedSkillClusters.map((group, index) => {
                  const accent = [PBI_PALETTE.blue, PBI_PALETTE.violet, PBI_PALETTE.coral][index];
                  const firstSkill = group.topSkills[0]?.skill;
                  return (
                    <button key={group.id} type="button" disabled={!firstSkill} onClick={() => firstSkill && setDrillThroughTarget({ type: 'skill', title: group.label, skill: firstSkill })} className="w-full text-left rtl:text-right p-3 bg-[#f8fafc] rounded-[4px] border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 disabled:opacity-50">
                      <div className="font-bold mb-1 flex items-center justify-between gap-2" style={{color:accent}}>
                        <span>{group.label}</span>
                        <span className="font-mono text-[11px]">{group.pct}% · {group.count.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {group.topSkills.map(item => `${item.skill} (${item.count.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')})`).join(' · ') || (language === 'ar' ? 'لا توجد سجلات لهذه المجموعة ضمن النطاق' : 'No matching skills in this filter context')}
                      </p>
                    </button>
                  );
                })}
              </div>
            </VisualCard>
          </div>

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
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
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
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} />
                    <YAxis dataKey="displayName" type="category" width={135} tick={{ fontSize: 10, fill: '#64748b', textAnchor: 'end', direction: language === 'ar' ? 'rtl' : 'ltr' }} />
                    <Tooltip
                      formatter={(val: any, _name: any, item: any) => [`${val.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} ${language === 'ar' ? 'وظيفة' : 'postings'} (${item.payload.share}%)`, language === 'ar' ? 'العدد' : 'Headcount']}
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '4px', fontSize: '11px' }}
                    />
                    <Bar dataKey="jobs" fill={PBI_PALETTE.violet} radius={[0, 3, 3, 0]} className="cursor-pointer" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between px-1">
                <span>{language === 'ar' ? 'أعلى فئة:' : 'Top Level:'} <strong>{scopedSeniorityMetrics.slice().sort((a,b)=>b.jobs-a.jobs).slice(0,2).map(item=>`${item.displayName} (${item.share}%)`).join(' · ') || '—'}</strong></span>
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
                rows: scopedCategoryMetrics.map(c => [c.displayName, `${c.remotePct}%`])
              }}
            >
              <div className="h-72 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={scopedCategoryMetrics}
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
                    <XAxis type="number" unit="%" tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 100]} />
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
            <VisualCard
              visualType="bar"
              title={t('chart_postingsByCountry')}
              subtitle={language === 'ar' ? 'ترتيب تنازلي لأعلى 10 دول حسب عدد الإعلانات • انقر على الدولة لاستعراض تفاصيلها' : 'Top 10 countries ranked by job postings • Click a country to inspect details'}
              className="lg:col-span-7"
              filterContext={selectedCountry !== 'All' ? `${t('slicerCountry')} = ${translateCountry(selectedCountry, language)}` : undefined}
              onFocusMode={() => setFocusedVisual(t('chart_postingsByCountry'))}
              language={language}
              tableData={{
                headers: [t('slicerCountry'), t('col_postingsCount'), t('col_marketShare'), `${t('kpi_avgSalary')} (${currency})`],
                rows: localizedCountries.map(c => [c.displayName, c.jobs.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US'), `${c.share}%`, formatSalary(c.avgSalary, currency, { isArabic: language === 'ar' })])
              }}
            >
              <div className="h-[340px] w-full min-w-0 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[...localizedCountries].sort((a,b)=>b.jobs-a.jobs).slice(0,10)}
                    layout="vertical"
                    margin={{ top: 8, right: 24, left: language === 'ar' ? 12 : 8, bottom: 8 }}
                    barCategoryGap="22%"
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
                    <CartesianGrid horizontal={false} stroke="#f1f5f9" />
                    <XAxis
                      type="number"
                      reversed={language === 'ar'}
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      tickFormatter={(value:number)=>value.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      orientation="left"
                      dataKey="displayName"
                      width={language === 'ar' ? 126 : 142}
                      tick={{ fontSize: 11, fill: '#64748b', textAnchor: 'end' }}
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                    />
                    <Tooltip
                      formatter={(v: any, _name: any, item: any) => [
                        `${Number(v).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')} ${language === 'ar' ? 'وظيفة' : 'postings'} (${item.payload.share}%) • ${language === 'ar' ? 'المتوسط' : 'Avg'}: ${formatSalary(item.payload.avgSalary, currency, { isArabic: language === 'ar' })}`,
                        language === 'ar' ? 'إعلانات الوظائف' : 'Job postings'
                      ]}
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '11px' }}
                    />
                    <Bar
                      dataKey="jobs"
                      radius={[0, 5, 5, 0]}
                      barSize={17}
                      className="cursor-pointer"
                      onClick={(entry: any) => {
                        const clickedCountry = entry?.country || entry?.payload?.country;
                        if (clickedCountry) {
                          setDrillThroughTarget({
                            type: 'country',
                            title: translateCountry(clickedCountry, language),
                            country: clickedCountry
                          });
                        }
                      }}
                    >
                      {[...localizedCountries].sort((a,b)=>b.jobs-a.jobs).slice(0,10).map((entry, index) => (
                        <Cell
                          key={`cell-geo-${index}`}
                          fill={selectedCountry === 'All' || selectedCountry === entry.country ? PBI_PALETTE.teal : '#765b49'}
                          fillOpacity={selectedCountry === 'All' || selectedCountry === entry.country ? 1 : 0.7}
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

            <VisualCard
              visualType="table"
              title={language === 'ar' ? 'مصفوفة الأسواق الجغرافية' : 'Geographic Market Matrix'}
              subtitle={language === 'ar' ? 'ترتيب الدول حسب حجم الطلب ومتوسط الأجر' : 'Countries ranked by demand volume and average pay'}
              className="lg:col-span-5"
              filterContext={selectedCountry !== 'All' ? `${t('slicerCountry')} = ${translateCountry(selectedCountry, language)}` : undefined}
              language={language}
              tableData={{
                headers: [t('slicerCountry'), t('col_postingsCount'), t('col_marketShare'), `${t('kpi_avgSalary')} (${currency})`],
                rows: localizedCountries.map(c => [c.displayName, c.jobs.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US'), `${c.share}%`, formatSalary(c.avgSalary, currency, { isArabic: language === 'ar' })])
              }}
            >
              <div className="space-y-2 pt-1">
                {[...localizedCountries].sort((a,b)=>b.jobs-a.jobs).map((c) => {
                  const maxShare = Math.max(...localizedCountries.map(x => x.share), 1);
                  return (
                    <button
                      key={c.country}
                      onClick={() => setDrillThroughTarget({
                        type: 'country',
                        title: c.displayName,
                        country: c.country
                      })}
                      className={`w-full text-left rtl:text-right p-2 rounded-[4px] border transition-colors cursor-pointer ${
                        selectedCountry === c.country
                          ? 'bg-sky-50 border-sky-300 shadow-2xs'
                          : 'bg-[#f8fafc] border-slate-200 hover:border-sky-300 hover:bg-sky-50/60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 gap-2">
                        <span className="truncate">{c.displayName}</span>
                        <span className="font-mono text-slate-600 tabular-nums shrink-0">
                          {c.jobs.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="h-1.5 flex-1 rounded bg-slate-200 overflow-hidden">
                          <div
                            className="h-full rounded bg-[#00b7c3]"
                            style={{ width: `${Math.max(3, (c.share / maxShare) * 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono w-11 text-right rtl:text-left">{c.share}%</span>
                      </div>
                      <div className="text-[10px] text-emerald-700 mt-0.5">
                        {formatSalary(c.avgSalary, currency, { compact: true, isArabic: language === 'ar' })} {language === 'ar' ? 'متوسط الأجر' : 'avg pay'}
                      </div>
                    </button>
                  );
                })}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
              data={scopedMonthlySalaryMetrics.map(m => ({ month: m.month, value: m.medianSalary }))}
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
              data={scopedMonthlySalaryMetrics.map(m => ({ month: m.month, value: m.disclosurePct }))}
              formatTooltip={(v) => `${v}% ${language === 'ar' ? 'نسبة الإفصاح' : 'compliance'}`}
              trendLabel={`${daxMetrics.salaryDisclosurePct}% ${language === 'ar' ? 'الامتثال التنظيمي' : 'Regulatory Compliance'}`}
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
                rows: scopedSeniorityMetrics.map(s => [s.displayName, formatSalary(s.avgSalary, currency, { isArabic: language === 'ar' }), formatSalary(s.medianSalary, currency, { isArabic: language === 'ar' })])
              }}
            >
              <div className="h-72 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={scopedSeniorityMetrics}
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
                rows: [...scopedCategoryMetrics].sort((a,b) => b.avgSalary - a.avgSalary).map(c => [c.displayName, formatSalary(c.avgSalary, currency, { isArabic: language === 'ar' })])
              }}
            >
              <div className="h-72 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[...scopedCategoryMetrics].sort((a,b) => b.avgSalary - a.avgSalary)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
                value: (scopedMonthlySalaryMetrics[idx]?.premiumPct ?? 0)
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
                rows: scopedCategoryMetrics.filter(c => c.aiPct > 0).map(c => [c.displayName, `${c.aiPct}%`])
              }}
            >
              <div className="h-72 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={scopedCategoryMetrics.filter(c => c.aiPct > 0)}
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
                  [scopedAiModality[0].name, `${scopedAiModality[0].remote}%`, `${scopedAiModality[0].hybrid}%`, `${scopedAiModality[0].onsite}%`],
                  [scopedAiModality[1].name, `${scopedAiModality[1].remote}%`, `${scopedAiModality[1].hybrid}%`, `${scopedAiModality[1].onsite}%`]
                ]
              }}
            >
              <div className="h-72 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={scopedAiModality}
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
